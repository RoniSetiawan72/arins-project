import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FileText,
    Plus,
    Calendar,
    Phone,
    ShieldCheck,
    LogOut,
    CheckCircle2,
    AlertCircle,
    UserCheck,
    DollarSign,
    Trash2,
    X,
    PlusCircle,
} from 'lucide-react';

export default function LeasesIndex({ leases = [], counts = {}, status = 'active' }) {
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedLease, setSelectedLease] = useState(null);

    // Form Checkout
    const { data, setData, post, processing, errors, reset } = useForm({
        checkout_date: new Date().toISOString().split('T')[0],
        deductions: [],
        notes: '',
    });

    const openCheckoutModal = (lease) => {
        setSelectedLease(lease);
        reset();
        setData({
            checkout_date: new Date().toISOString().split('T')[0],
            deductions: [],
            notes: '',
        });
        setIsCheckoutModalOpen(true);
    };

    const addDeductionRow = () => {
        setData('deductions', [
            ...data.deductions,
            { reason: '', amount: 0 },
        ]);
    };

    const removeDeductionRow = (index) => {
        setData('deductions', data.deductions.filter((_, i) => i !== index));
    };

    const updateDeductionRow = (index, field, value) => {
        const updated = [...data.deductions];
        updated[index][field] = field === 'amount' ? Number(value) || 0 : value;
        setData('deductions', updated);
    };

    const totalDeductions = data.deductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const initialDeposit = selectedLease ? Number(selectedLease.deposit_amount) : 0;
    const estimatedRefund = Math.max(0, initialDeposit - totalDeductions);

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        if (!selectedLease) return;

        post(route('admin.leases.checkout', selectedLease.id), {
            onSuccess: () => {
                setIsCheckoutModalOpen(false);
            },
        });
    };

    const handleFilterStatus = (newStatus) => {
        router.get(route('admin.leases.index'), { status: newStatus }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Kontrak Sewa & Checkout - SIM-Kos" />

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Kontrak Sewa & Penghuni
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Kelola data perjanjian sewa aktif, siklus penagihan, uang deposit, dan penyelesaian checkout.
                    </p>
                </div>
                <Link
                    href={route('admin.leases.create')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Buat Kontrak Sewa Baru
                </Link>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 mb-6">
                {[
                    { key: 'active', label: 'Sewa Aktif', count: counts.active || 0 },
                    { key: 'completed', label: 'Riwayat Selesai', count: counts.completed || 0 },
                    { key: 'all', label: 'Semua', count: counts.all || 0 },
                ].map((tab) => {
                    const active = (status || 'active') === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleFilterStatus(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                                active
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-800 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label}
                            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Leases List */}
            {leases.length > 0 ? (
                <div className="space-y-4">
                    {leases.map((lease) => {
                        const isActive = lease.status === 'active';
                        return (
                            <div
                                key={lease.id}
                                className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                            >
                                {/* Left Info: Tenant & Room */}
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-base shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                                        {lease.room.room_number}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                                {lease.tenant.name}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                isActive
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}>
                                                {isActive ? 'Aktif' : 'Selesai / Checkout'}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-3 flex-wrap">
                                            <span>Kamar {lease.room.room_number} ({lease.room.room_type})</span>
                                            {lease.tenant.phone && (
                                                <a
                                                    href={`https://wa.me/${lease.tenant.phone.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                                                >
                                                    <Phone className="h-3 w-3" /> {lease.tenant.phone}
                                                </a>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Info: Financials & Dates */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 lg:py-0 border-y lg:border-y-0 border-slate-100 dark:border-zinc-800 text-xs">
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Sewa ({lease.billing_cycle === 'yearly' ? 'Tahunan' : 'Bulanan'})</span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Rp {lease.rent_amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Uang Deposit</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                            Rp {lease.deposit_amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Periode Mulai</span>
                                        <span className="font-medium text-slate-700 dark:text-zinc-300">
                                            {lease.start_date_formatted}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Status Tagihan</span>
                                        {lease.unpaid_invoices_count > 0 ? (
                                            <span className="font-bold text-rose-600">
                                                {lease.unpaid_invoices_count} Belum Bayar
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-emerald-600">
                                                Lancar
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right Actions: Checkout Button */}
                                <div className="flex items-center gap-2 justify-end">
                                    {isActive ? (
                                        <button
                                            onClick={() => openCheckoutModal(lease)}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white dark:bg-amber-950/40 dark:text-amber-300 px-3.5 py-2 text-xs font-bold border border-amber-200 dark:border-amber-900/60 transition"
                                        >
                                            <LogOut className="h-3.5 w-3.5" />
                                            Proses Checkout
                                        </button>
                                    ) : (
                                        <div className="text-right text-xs">
                                            <span className="text-slate-400 block text-[11px]">Checkout pada {lease.checkout_date}</span>
                                            <span className="font-bold text-emerald-600">
                                                Refund: Rp {lease.refund_amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900">
                    <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600" />
                    <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-zinc-200">
                        Belum ada kontrak sewa
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Klik tombol "Buat Kontrak Sewa Baru" untuk mendaftarkan penyewa pertama.
                    </p>
                </div>
            )}

            {/* Modal Checkout Settlement & Deposit Refund */}
            {isCheckoutModalOpen && selectedLease && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Checkout & Kalkulasi Deposit
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Penyewa: {selectedLease.tenant.name} • Kamar {selectedLease.room.room_number}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                            {/* Summary Ringkasan Deposit Awal */}
                            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold block">
                                        Deposit Awal Terbayar
                                    </span>
                                    <span className="text-xl font-extrabold text-indigo-950 dark:text-indigo-100">
                                        Rp {initialDeposit.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400 opacity-80" />
                            </div>

                            {/* Tanggal Checkout */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    Tanggal Berakhir / Keluar Kos <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={data.checkout_date}
                                    onChange={(e) => setData('checkout_date', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Daftar Potongan Denda / Kerusakan */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                        Potongan Kerusakan / Tunggakan
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addDeductionRow}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                    >
                                        <PlusCircle className="h-3.5 w-3.5" /> Tambah Potongan
                                    </button>
                                </div>

                                {data.deductions.length > 0 ? (
                                    <div className="space-y-2">
                                        {data.deductions.map((row, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Alasan (contoh: Kunci hilang, Dinding rusak)"
                                                    required
                                                    value={row.reason}
                                                    onChange={(e) => updateDeductionRow(idx, 'reason', e.target.value)}
                                                    className="flex-1 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="10000"
                                                    placeholder="Nominal (Rp)"
                                                    required
                                                    value={row.amount || ''}
                                                    onChange={(e) => updateDeductionRow(idx, 'amount', e.target.value)}
                                                    className="w-32 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeDeductionRow(idx)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 p-3 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 text-center">
                                        Tidak ada potongan (Kamar dalam kondisi baik).
                                    </p>
                                )}
                            </div>

                            {/* Kalkulasi Sisa Pengembalian Deposit */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 space-y-2 text-xs">
                                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                                    <span>Deposit Awal</span>
                                    <span>Rp {initialDeposit.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                                    <span>Total Potongan</span>
                                    <span>- Rp {totalDeductions.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 dark:border-zinc-700 flex justify-between font-bold text-sm">
                                    <span className="text-slate-900 dark:text-white">Estimasi Sisa Refund</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 text-base font-extrabold">
                                        Rp {estimatedRefund.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    Catatan Serah Terima Kunci / Kamar
                                </label>
                                <textarea
                                    rows="2"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: Kunci kamar dan gerbang telah dikembalikan lengkap..."
                                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCheckoutModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-100 transition disabled:opacity-50"
                                >
                                    {processing ? 'Memproses...' : 'Selesaikan Checkout & Kembalikan Kamar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
