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
    MessageSquare,
    UserCheck,
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
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Direktori & Kontak Penyewa
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Data identitas penghuni, kontak WhatsApp, nomor identitas KTP, dan kontak darurat keluarga.
                    </p>
                </div>
                <button
                    onClick={() => {
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white shadow-xs transition"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Kontak Penyewa
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="relative w-full max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, email, no. telepon..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                    />
                </form>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium px-2 shrink-0">
                    Total <strong className="font-mono text-zinc-900 dark:text-zinc-100">{tenants.length}</strong> Penyewa
                </span>
            </div>

            {/* Tenants Grid */}
            {tenants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tenants.map((tenant) => {
                        const cleanPhone = (tenant.phone || '').replace(/[^0-9]/g, '');
                        return (
                            <div
                                key={tenant.id}
                                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-xs flex flex-col justify-between transition hover:border-zinc-300 dark:hover:border-zinc-700"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                                {tenant.name}
                                            </h3>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                                                <Mail className="h-3 w-3 text-zinc-400" />
                                                <span>{tenant.email}</span>
                                            </p>
                                        </div>

                                        {tenant.active_room ? (
                                            <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold shrink-0">
                                                Unit {tenant.active_room.room_number}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-medium shrink-0">
                                                Tidak Aktif
                                            </span>
                                        )}
                                    </div>

                                    {/* Info KTP & Phone */}
                                    <div className="space-y-2 py-3 border-y border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Nomor KTP</span>
                                            <span className="font-mono text-zinc-800 dark:text-zinc-200">
                                                {tenant.id_card_number || '-'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">WhatsApp</span>
                                            <span className="font-mono text-zinc-800 dark:text-zinc-200">
                                                {tenant.phone || '-'}
                                            </span>
                                        </div>

                                        {tenant.emergency_contact_name && (
                                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-0.5">
                                                    Kontak Darurat:
                                                </span>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                                                    <span>{tenant.emergency_contact_name}</span>
                                                    <span className="font-mono text-[11px]">
                                                        {tenant.emergency_contact_phone || '-'}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* WhatsApp Button Action */}
                                <div className="mt-4 pt-2">
                                    {cleanPhone ? (
                                        <a
                                            href={`https://wa.me/${cleanPhone}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white border border-emerald-200/80 dark:border-emerald-900/50 py-2 text-xs font-semibold transition"
                                        >
                                            <Phone className="h-3.5 w-3.5" />
                                            Chat WhatsApp
                                        </a>
                                    ) : (
                                        <div className="text-center text-xs text-zinc-400 py-1 font-medium">
                                            Nomor WhatsApp belum tercatat
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900">
                    <Users className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                    <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Tidak ada penyewa ditemukan
                    </h3>
                </div>
            )}

            {/* Modal Tambah Penyewa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                Tambah Kontak Penyewa Baru
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Nama Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Budi Santoso"
                                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="budi@example.com"
                                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        No. WhatsApp <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Nomor NIK / KTP
                                </label>
                                <input
                                    type="text"
                                    value={data.id_card_number}
                                    onChange={(e) => setData('id_card_number', e.target.value)}
                                    placeholder="327301xxxxxxxxxx"
                                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        Kontak Darurat (Nama)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        placeholder="Orang tua / Wali"
                                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                        No. Darurat
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_phone}
                                        onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white shadow-xs transition disabled:opacity-50"
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
