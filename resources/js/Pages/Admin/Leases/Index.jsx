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
    ArrowUpRight,
    Search,
    Clock,
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
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Kontrak Sewa & Penghuni
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Kelola data perjanjian sewa aktif, siklus penagihan, uang deposit, dan penyelesaian checkout.
                    </p>
                </div>
                <Link
                    href={route('admin.leases.create')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white shadow-xs transition"
                >
                    <Plus className="h-4 w-4" />
                    Buat Kontrak Sewa Baru
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 w-fit mb-6">
                {[
                    { key: 'active', label: 'Sewa Aktif', count: counts.active || 0 },
                    { key: 'completed', label: 'Riwayat Selesai', count: counts.completed || 0 },
                    { key: 'all', label: 'Semua', count: counts.all || 0 },
                ].map((tab) => {
                    const isActive = (status || 'active') === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleFilterStatus(tab.key)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                isActive
                                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                        >
                            {tab.label}
                            <span
                                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                                    isActive
                                        ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                                        : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Leases List */}
            {leases.length > 0 ? (
                <div className="space-y-3">
                    {leases.map((lease) => {
                        const isActive = lease.status === 'active';
                        const cleanPhone = (lease.tenant.phone || '').replace(/[^0-9]/g, '');

                        return (
                            <div
                                key={lease.id}
                                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-xs transition hover:border-zinc-300 dark:hover:border-zinc-700 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                            >
                                {/* Left: Unit & Tenant Info */}
                                <div className="flex items-start gap-4 min-w-[280px]">
                                    <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Unit</span>
                                        <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                                            {lease.room.room_number}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                                {lease.tenant.name}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                                    isActive
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60'
                                                        : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        isActive ? 'bg-emerald-500' : 'bg-zinc-400'
                                                    }`}
                                                />
                                                {isActive ? 'Aktif' : 'Selesai'}
                                            </span>
                                        </div>

                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-3 flex-wrap">
                                            <span>Tipe {lease.room.room_type}</span>
                                            {lease.tenant.phone && (
                                                <a
                                                    href={`https://wa.me/${cleanPhone}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
                                                >
                                                    <Phone className="h-3 w-3" />
                                                    {lease.tenant.phone}
                                                </a>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Center: Financials & Dates (Grid) */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 lg:py-0 border-y lg:border-y-0 border-zinc-100 dark:border-zinc-800 text-xs">
                                    <div>
                                        <span className="text-zinc-400 block text-[11px] mb-0.5">
                                            Sewa ({lease.billing_cycle === 'yearly' ? 'Tahunan' : 'Bulanan'})
                                        </span>
                                        <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                                            Rp {Number(lease.rent_amount).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-zinc-400 block text-[11px] mb-0.5">Uang Deposit</span>
                                        <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                                            Rp {Number(lease.deposit_amount).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-zinc-400 block text-[11px] mb-0.5">Mulai Masuk</span>
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {lease.start_date_formatted || lease.start_date}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-zinc-400 block text-[11px] mb-0.5">Status Tagihan</span>
                                        {lease.unpaid_invoices_count > 0 ? (
                                            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                                                <AlertCircle className="h-3.5 w-3.5" />
                                                {lease.unpaid_invoices_count} Tunggakan
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Lancar
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Action Button */}
                                <div className="flex items-center gap-2 justify-end shrink-0">
                                    {isActive ? (
                                        <button
                                            onClick={() => openCheckoutModal(lease)}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/60 px-3.5 py-2 text-xs font-semibold border border-amber-200/80 dark:border-amber-900/60 transition"
                                        >
                                            <LogOut className="h-3.5 w-3.5" />
                                            Proses Checkout
                                        </button>
                                    ) : (
                                        <div className="text-right text-xs">
                                            <span className="text-zinc-400 block text-[11px]">
                                                Keluar: {lease.checkout_date}
                                            </span>
                                            <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                                                Refund: Rp {Number(lease.refund_amount || 0).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900">
                    <FileText className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                    <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Belum ada kontrak sewa
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Klik tombol "Buat Kontrak Sewa Baru" untuk mendaftarkan penyewa pertama.
                    </p>
                </div>
            )}

            {/* Modal Checkout Settlement & Deposit Refund */}
            {isCheckoutModalOpen && selectedLease && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
                            <div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Checkout & Kalkulasi Deposit
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                    {selectedLease.tenant.name} • Kamar {selectedLease.room.room_number}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                            {/* Deposit Overview Banner */}
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
                                        Deposit Awal Terbayar
                                    </span>
                                    <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
                                        Rp {initialDeposit.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                            </div>

                            {/* Tanggal Checkout */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Tanggal Berakhir / Keluar Kos <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={data.checkout_date}
                                    onChange={(e) => setData('checkout_date', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                />
                            </div>

                            {/* Daftar Potongan Denda / Kerusakan */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                        Potongan Kerusakan / Denda
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addDeductionRow}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        <PlusCircle className="h-3.5 w-3.5" /> Tambah Rincian
                                    </button>
                                </div>

                                {data.deductions.length > 0 ? (
                                    <div className="space-y-2">
                                        {data.deductions.map((row, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Keterangan (contoh: Kunci hilang, Dinding rusak)"
                                                    required
                                                    value={row.reason}
                                                    onChange={(e) => updateDeductionRow(idx, 'reason', e.target.value)}
                                                    className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="10000"
                                                    placeholder="Nominal (Rp)"
                                                    required
                                                    value={row.amount || ''}
                                                    onChange={(e) => updateDeductionRow(idx, 'amount', e.target.value)}
                                                    className="w-32 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeDeductionRow(idx)}
                                                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                                        Tidak ada potongan (Kamar dalam kondisi prima & bersih).
                                    </p>
                                )}
                            </div>

                            {/* Kalkulasi Sisa Pengembalian Deposit */}
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700 space-y-2 text-xs">
                                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                                    <span>Deposit Awal</span>
                                    <span className="font-mono">Rp {initialDeposit.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                                    <span>Total Potongan</span>
                                    <span className="font-mono">- Rp {totalDeductions.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between font-bold">
                                    <span className="text-zinc-900 dark:text-zinc-100">Estimasi Sisa Refund</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold font-mono">
                                        Rp {estimatedRefund.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Catatan Serah Terima Kunci / Kamar
                                </label>
                                <textarea
                                    rows="2"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: Kunci kamar dan kartu akses telah diserahkan lengkap..."
                                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCheckoutModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 shadow-xs transition disabled:opacity-50"
                                >
                                    {processing ? 'Memproses...' : 'Selesaikan Checkout & Kosongkan Kamar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
