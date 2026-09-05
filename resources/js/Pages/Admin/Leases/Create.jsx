import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FileText,
    ArrowLeft,
    BedDouble,
    User,
    Calendar,
    DollarSign,
    ShieldCheck,
    CheckCircle2,
    UserPlus,
    Users,
} from 'lucide-react';

export default function LeasesCreate({ availableRooms = [], tenants = [], preselectedRoomId = null }) {
    const [isNewTenant, setIsNewTenant] = useState(tenants.length === 0);

    const { data, setData, post, processing, errors } = useForm({
        room_id: preselectedRoomId || (availableRooms[0]?.id ?? ''),
        is_new_tenant: tenants.length === 0,
        user_id: tenants[0]?.id ?? '',
        tenant_name: '',
        tenant_email: '',
        tenant_phone: '',
        tenant_id_card: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        billing_cycle: 'monthly',
        rent_amount: availableRooms.find((r) => r.id === preselectedRoomId)?.price || (availableRooms[0]?.price ?? 1000000),
        deposit_amount: 500000,
        notes: '',
        generate_initial_invoice: true,
    });

    const handleRoomChange = (roomId) => {
        const selected = availableRooms.find((r) => r.id === Number(roomId));
        setData({
            ...data,
            room_id: roomId,
            rent_amount: selected ? selected.price : data.rent_amount,
        });
    };

    const handleTenantModeChange = (newMode) => {
        setIsNewTenant(newMode);
        setData('is_new_tenant', newMode);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.leases.store'));
    };

    const selectedRoom = availableRooms.find((r) => r.id === Number(data.room_id));

    return (
        <AdminLayout>
            <Head title="Buat Kontrak Sewa Baru - SIM-Kos" />

            <div className="max-w-4xl mx-auto mb-8">
                <Link
                    href={route('admin.leases.index')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition mb-4"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Kontrak
                </Link>

                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Pendaftaran Penyewa & Kontrak Sewa Baru
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                    Tempatkan penyewa ke kamar yang tersedia dan atur kesepakatan sewa serta uang jaminan awal (deposit).
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                {/* 1. Pemilihan Kamar Kos */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                            1
                        </div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <BedDouble className="h-5 w-5 text-indigo-600" />
                            Pilih Kamar Kos yang Tersedia
                        </h2>
                    </div>

                    {availableRooms.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {availableRooms.map((room) => {
                                const isSelected = Number(data.room_id) === Number(room.id);
                                return (
                                    <div
                                        key={room.id}
                                        onClick={() => handleRoomChange(room.id)}
                                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                                            isSelected
                                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600'
                                                : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-black text-slate-900 dark:text-white">
                                                Kamar {room.room_number}
                                            </span>
                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                {room.room_type}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
                                            Rp {Number(room.price).toLocaleString('id-ID')} <span className="font-normal text-slate-400">/bln</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs">
                            Semua kamar saat ini sedang terisi atau dalam perbaikan. Tambahkan kamar baru terlebih dahulu.
                        </div>
                    )}
                    {errors.room_id && <p className="mt-2 text-xs text-rose-500">{errors.room_id}</p>}
                </div>

                {/* 2. Data Penyewa (Pilih / Baru) */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                2
                            </div>
                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-600" />
                                Identitas Penyewa
                            </h2>
                        </div>

                        {/* Toggle Existing vs New Tenant */}
                        <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => handleTenantModeChange(true)}
                                className={`px-3 py-1.5 rounded-lg transition ${
                                    isNewTenant ? 'bg-white dark:bg-zinc-900 text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Penyewa Baru
                            </button>
                            <button
                                type="button"
                                disabled={tenants.length === 0}
                                onClick={() => handleTenantModeChange(false)}
                                className={`px-3 py-1.5 rounded-lg transition ${
                                    !isNewTenant ? 'bg-white dark:bg-zinc-900 text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                                } ${tenants.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                                Pilih dari Kontak ({tenants.length})
                            </button>
                        </div>
                    </div>

                    {isNewTenant ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Nama Lengkap Penyewa <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required={isNewTenant}
                                        value={data.tenant_name}
                                        onChange={(e) => setData('tenant_name', e.target.value)}
                                        placeholder="Contoh: Ahmad Pratama"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                    {errors.tenant_name && <p className="mt-1 text-xs text-rose-500">{errors.tenant_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required={isNewTenant}
                                        value={data.tenant_phone}
                                        onChange={(e) => setData('tenant_phone', e.target.value)}
                                        placeholder="Contoh: 081234567890"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                    {errors.tenant_phone && <p className="mt-1 text-xs text-rose-500">{errors.tenant_phone}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Email Akun (Login Aplikasi) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required={isNewTenant}
                                        value={data.tenant_email}
                                        onChange={(e) => setData('tenant_email', e.target.value)}
                                        placeholder="ahmad@example.com"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                    {errors.tenant_email && <p className="mt-1 text-xs text-rose-500">{errors.tenant_email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Nomor NIK / KTP
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tenant_id_card}
                                        onChange={(e) => setData('tenant_id_card', e.target.value)}
                                        placeholder="327301xxxxxxxxxx"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Nama Kontak Darurat (Keluarga/Wali)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        placeholder="Bapak / Ibu Pratama"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        No. Telp Kontak Darurat
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_phone}
                                        onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                        placeholder="081122334455"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                Pilih Penyewa Terdaftar <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                            >
                                {tenants.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} ({t.phone || t.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* 3. Detail Kesepakatan Sewa & Deposit */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                            3
                        </div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-600" />
                            Ketentuan Sewa & Uang Jaminan (Deposit)
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                Tanggal Mulai Masuk Sewa <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                Siklus Penagihan
                            </label>
                            <select
                                value={data.billing_cycle}
                                onChange={(e) => setData('billing_cycle', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                            >
                                <option value="monthly">Bulanan (Per Bulan)</option>
                                <option value="yearly">Tahunan (Per Tahun)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                Nilai Sewa yang Disepakati (Rp) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="10000"
                                value={data.rent_amount}
                                onChange={(e) => setData('rent_amount', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                Uang Jaminan / Deposit Awal (Rp) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="10000"
                                value={data.deposit_amount}
                                onChange={(e) => setData('deposit_amount', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                            />
                            <p className="mt-1 text-[11px] text-slate-400">
                                Deposit akan dikembalikan saat checkout setelah dipotong biaya kerusakan/tunggakan.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                            Catatan Perjanjian / Kondisi Awal Kamar
                        </label>
                        <textarea
                            rows="2"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Contoh: Meteran listrik awal 124.5 kWh, kunci 2 pcs diberikan..."
                            className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Link
                        href={route('admin.leases.index')}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing || availableRooms.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        {processing ? 'Menyimpan...' : 'Terbitkan Kontrak & Tempatkan Penyewa'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
