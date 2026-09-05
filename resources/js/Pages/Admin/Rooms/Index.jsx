import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    BedDouble,
    Plus,
    Search,
    Edit2,
    Trash2,
    UserPlus,
    Check,
    X,
    Sparkles,
    SlidersHorizontal,
    Phone,
    Calendar,
    Wifi,
    Tv,
    Wind,
} from 'lucide-react';

export default function RoomsIndex({ rooms = [], counts = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    // Form helper
    const { data, setData, post, put, processing, errors, reset } = useForm({
        room_number: '',
        room_type: 'Standard',
        price: '',
        status: 'available',
        description: '',
        facilities: ['WiFi', 'Kamar Mandi Dalam'],
    });

    const commonFacilities = [
        'AC',
        'WiFi',
        'Kamar Mandi Dalam',
        'Kamar Mandi Luar',
        'Water Heater',
        'Kasur Springbed',
        'Lemari Pakaian',
        'Meja Belajar',
        'Smart TV',
        'Balkon',
    ];

    const openCreateModal = () => {
        setEditingRoom(null);
        reset();
        setData({
            room_number: '',
            room_type: 'Standard',
            price: '',
            status: 'available',
            description: '',
            facilities: ['WiFi', 'Kamar Mandi Dalam'],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (room) => {
        setEditingRoom(room);
        setData({
            room_number: room.room_number,
            room_type: room.room_type,
            price: room.price,
            status: room.status,
            description: room.description || '',
            facilities: room.facilities || [],
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRoom) {
            put(route('admin.rooms.update', editingRoom.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route('admin.rooms.store'), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (room) => {
        if (confirm(`Apakah Anda yakin ingin menghapus Kamar ${room.room_number}?`)) {
            router.delete(route('admin.rooms.destroy', room.id));
        }
    };

    const handleFilterStatus = (status) => {
        router.get(route('admin.rooms.index'), { status, search }, { preserveState: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.rooms.index'), { status: filters.status || 'all', search }, { preserveState: true });
    };

    const toggleFacility = (facility) => {
        if (data.facilities.includes(facility)) {
            setData('facilities', data.facilities.filter((f) => f !== facility));
        } else {
            setData('facilities', [...data.facilities, facility]);
        }
    };

    const statusBadge = {
        available: {
            label: 'Tersedia',
            class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
            dot: 'bg-emerald-500',
        },
        occupied: {
            label: 'Terisi',
            class: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900',
            dot: 'bg-blue-500',
        },
        maintenance: {
            label: 'Perbaikan',
            class: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
            dot: 'bg-amber-500',
        },
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Kamar - SIM-Kos" />

            {/* Page Header & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Manajemen Master Kamar
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Kelola data inventaris, tarif sewa, fasilitas, dan status ketersediaan kamar kos.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Kamar Baru
                </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                    {[
                        { key: 'all', label: 'Semua Kamar', count: counts.all || 0 },
                        { key: 'available', label: 'Tersedia', count: counts.available || 0 },
                        { key: 'occupied', label: 'Terisi', count: counts.occupied || 0 },
                        { key: 'maintenance', label: 'Perbaikan', count: counts.maintenance || 0 },
                    ].map((tab) => {
                        const active = (filters.status || 'all') === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handleFilterStatus(tab.key)}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                    active
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                                }`}
                            >
                                {tab.label}
                                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari no. kamar / tipe..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                </form>
            </div>

            {/* Room Grid Cards */}
            {rooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {rooms.map((room) => {
                        const style = statusBadge[room.status] || statusBadge.available;
                        return (
                            <div
                                key={room.id}
                                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700"
                            >
                                <div>
                                    {/* Top Card: Room Number & Status */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                                                Kamar {room.room_number}
                                            </span>
                                            <span className="block text-xs font-semibold text-slate-500 dark:text-zinc-400">
                                                {room.room_type}
                                            </span>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${style.class}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                            {style.label}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                                            Rp {room.price.toLocaleString('id-ID')}
                                            <span className="text-xs font-normal text-slate-400"> /bulan</span>
                                        </div>
                                    </div>

                                    {/* Facilities Pills */}
                                    {room.facilities && room.facilities.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {room.facilities.slice(0, 3).map((facility, idx) => (
                                                <span
                                                    key={idx}
                                                    className="rounded-lg bg-slate-100 dark:bg-zinc-800 px-2 py-0.8 text-[10px] font-medium text-slate-600 dark:text-zinc-300"
                                                >
                                                    {facility}
                                                </span>
                                            ))}
                                            {room.facilities.length > 3 && (
                                                <span className="rounded-lg bg-slate-100 dark:bg-zinc-800 px-2 py-0.8 text-[10px] font-semibold text-slate-500">
                                                    +{room.facilities.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Tenant Info (if Occupied) */}
                                    {room.status === 'occupied' && room.current_tenant && (
                                        <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-3 mb-4 text-xs">
                                            <p className="font-bold text-blue-950 dark:text-blue-200 truncate">
                                                👤 {room.current_tenant.name}
                                            </p>
                                            <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> Sejak: {room.current_tenant.start_date}
                                            </p>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {room.description && (
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mb-4">
                                            {room.description}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                                    {room.status === 'available' ? (
                                        <Link
                                            href={route('admin.leases.create', { room_id: room.id })}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 py-2 text-xs font-bold hover:bg-indigo-600 hover:text-white transition"
                                        >
                                            <UserPlus className="h-3.5 w-3.5" />
                                            Tempatkan
                                        </Link>
                                    ) : (
                                        <div className="flex-1" />
                                    )}

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(room)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition"
                                            title="Ubah Kamar"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        {room.status !== 'occupied' && (
                                            <button
                                                onClick={() => handleDelete(room)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                                                title="Hapus Kamar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900">
                    <BedDouble className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600" />
                    <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-zinc-200">
                        Tidak ada kamar ditemukan
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Coba sesuaikan filter pencarian atau tambahkan kamar baru.
                    </p>
                </div>
            )}

            {/* Modal Form Create/Edit Room */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-5">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                {editingRoom ? `Edit Kamar ${editingRoom.room_number}` : 'Tambah Kamar Baru'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Nomor Kamar <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.room_number}
                                        onChange={(e) => setData('room_number', e.target.value)}
                                        placeholder="Contoh: 101, 202A"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.room_number && (
                                        <p className="mt-1 text-[11px] text-rose-500">{errors.room_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Tipe Kamar <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.room_type}
                                        onChange={(e) => setData('room_type', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="VIP Suite">VIP Suite</option>
                                        <option value="Eksklusif">Eksklusif</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Tarif Sewa (Rp / Bulan) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="10000"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="Contoh: 1500000"
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-[11px] text-rose-500">{errors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                        Status Kamar
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="available">Tersedia (Kosong)</option>
                                        <option value="occupied">Terisi</option>
                                        <option value="maintenance">Perbaikan (Maintenance)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Facilities Selection */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                                    Fasilitas Kamar
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {commonFacilities.map((fac) => {
                                        const isSelected = data.facilities.includes(fac);
                                        return (
                                            <button
                                                type="button"
                                                key={fac}
                                                onClick={() => toggleFacility(fac)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                                                    isSelected
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                                        : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700'
                                                }`}
                                            >
                                                {fac}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                                    Deskripsi & Catatan Tambahan
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Contoh: Kamar lantai 1 dekat dapur umum, ventilasi udara bagus..."
                                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data Kamar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
