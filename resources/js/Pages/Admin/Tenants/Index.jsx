import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users,
    Plus,
    Search,
    Phone,
    Mail,
    IdCard,
    ShieldAlert,
    BedDouble,
    X,
    UserPlus,
} from 'lucide-react';

export default function TenantsIndex({ tenants = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        id_card_number: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.tenants.index'), { search }, { preserveState: true });
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post(route('admin.tenants.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Direktori Penyewa - SIM-Kos" />

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Direktori & Kontak Penyewa
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Data identitas penghuni, kontak WhatsApp, nomor identitas KTP, dan kontak darurat keluarga.
                    </p>
                </div>
                <button
                    onClick={() => {
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Kontak Penyewa
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
                <form onSubmit={handleSearch} className="relative w-full max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, email, no. telepon..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                </form>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold px-3">
                    Total {tenants.length} Penyewa
                </span>
            </div>

            {/* Tenants Grid */}
            {tenants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tenants.map((tenant) => {
                        const cleanPhone = (tenant.phone || '').replace(/[^0-9]/g, '');
                        return (
                            <div
                                key={tenant.id}
                                className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                                {tenant.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                                                <Mail className="h-3 w-3" /> {tenant.email}
                                            </p>
                                        </div>

                                        {tenant.active_room ? (
                                            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 text-xs font-black">
                                                Kamar {tenant.active_room.room_number}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500 text-[10px] font-semibold">
                                                Tidak Aktif
                                            </span>
                                        )}
                                    </div>

                                    {/* Info KTP & Phone */}
                                    <div className="space-y-2 py-3 border-y border-slate-100 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Nomor KTP:</span>
                                            <span className="font-medium text-slate-800 dark:text-zinc-200">
                                                {tenant.id_card_number || '-'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-slate-400">WhatsApp:</span>
                                            <span className="font-medium text-slate-800 dark:text-zinc-200">
                                                {tenant.phone || '-'}
                                            </span>
                                        </div>

                                        {tenant.emergency_contact_name && (
                                            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                                                <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                                                    Kontak Darurat:
                                                </span>
                                                <p className="text-xs text-slate-500">
                                                    {tenant.emergency_contact_name} ({tenant.emergency_contact_phone || '-'})
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* WhatsApp Button Action */}
                                <div className="mt-4 pt-3">
                                    {cleanPhone ? (
                                        <a
                                            href={`https://wa.me/${cleanPhone}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-200 dark:border-emerald-900 py-2.5 text-xs font-bold transition"
                                        >
                                            <Phone className="h-3.5 w-3.5" />
                                            Chat WhatsApp Penyewa
                                        </a>
                                    ) : (
                                        <div className="text-center text-xs text-slate-400 py-1">
                                            Nomor HP belum tersedia
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900">
                    <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600" />
                    <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-zinc-200">
                        Tidak ada penyewa ditemukan
                    </h3>
                </div>
            )}

            {/* Modal Tambah Penyewa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                Tambah Kontak Penyewa Baru
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    Nama Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        No. WhatsApp <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    Nomor NIK / KTP
                                </label>
                                <input
                                    type="text"
                                    value={data.id_card_number}
                                    onChange={(e) => setData('id_card_number', e.target.value)}
                                    placeholder="327301xxxxxxxxxx"
                                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Kontak Darurat (Nama)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        No. Darurat
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_phone}
                                        onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Kontak'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
