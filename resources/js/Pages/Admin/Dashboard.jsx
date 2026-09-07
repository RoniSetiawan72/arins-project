import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    BedDouble,
    TrendingUp,
    Wallet,
    Receipt,
    Wrench,
    Plus,
    Users,
    Phone,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Building2,
    Shield,
    FileText,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

export default function AdminDashboard({
    metrics = {},
    cashflowData = [],
    occupancyData = [],
    roomMatrix = [],
    recentInvoices = [],
    recentComplaints = [],
}) {
    const DONUT_COLORS = ['#10B981', '#0EA5E9', '#F59E0B']; // Emerald, Sky, Amber

    const statusBadge = {
        occupied: {
            label: 'Terisi',
            container: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
            badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
            dot: 'bg-emerald-500',
        },
        available: {
            label: 'Tersedia',
            container: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
            badge: 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900',
            dot: 'bg-sky-500',
        },
        maintenance: {
            label: 'Perbaikan',
            container: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
            badge: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
            dot: 'bg-amber-500',
        },
    };

    const priorityBadge = {
        high: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold',
        medium: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
        low: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
    };

    return (
        <AdminLayout>
            <Head title="Ringkasan Operasional Properti - SIM-Kos" />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Ringkasan Operasional Properti
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Ikhtisar tingkat hunian, arus kas pembayaran, dan tindak lanjut keluhan unit secara terpusat.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                        href={route('admin.leases.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 px-4 py-2.5 text-xs font-bold shadow-xs transition active:scale-98"
                    >
                        <Plus className="h-3.5 w-3.5" /> Kontrak Baru
                    </Link>
                    <Link
                        href={route('admin.rooms.index')}
                        className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 px-4 py-2.5 text-xs font-semibold shadow-2xs transition"
                    >
                        <BedDouble className="h-3.5 w-3.5 text-zinc-500" /> Inventaris Kamar
                    </Link>
                </div>
            </div>

            {/* 4 KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* 1. Okupansi */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-5 border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Tingkat Okupansi
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                            <BedDouble className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
                            {metrics.occupancy_rate}%
                        </span>
                        <span className="text-xs text-zinc-500">
                            ({metrics.occupied_rooms}/{metrics.total_rooms} Kamar)
                        </span>
                    </div>
                    <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.occupancy_rate}%` }}
                        />
                    </div>
                </div>

                {/* 2. Pendapatan Bulan Ini */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-5 border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Pemasukan Sewa
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
                            Rp {(metrics.current_month_income / 1000000).toFixed(1)} jt
                        </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>Siklus berjalan bulan ini</span>
                    </div>
                </div>

                {/* 3. Laba Bersih */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-5 border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Estimasi Laba Bersih
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
                            Rp {(metrics.net_profit / 1000000).toFixed(1)} jt
                        </span>
                    </div>
                    <p className="mt-3 text-[11px] text-zinc-500">
                        Biaya operasional: Rp {(metrics.current_month_expense / 1000000).toFixed(1)} jt
                    </p>
                </div>

                {/* 4. Tagihan Belum Lunas */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-5 border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Tagihan Menunggu
                        </span>
                        <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Receipt className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
                            {metrics.unpaid_invoices_count} <span className="text-sm font-sans font-normal text-zinc-500">Invoice</span>
                        </span>
                    </div>
                    <p className="mt-3 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                        Nominal: Rp {(metrics.unpaid_invoices_amount / 1000000).toFixed(1)} jt
                    </p>
                </div>
            </div>

            {/* Analytics Section (Cashflow & Occupancy Donut) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Cashflow Chart (8 cols on lg) */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200/90 dark:border-zinc-800 shadow-xs lg:col-span-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                                Arus Kas Masuk vs Keluar
                            </h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Pemasukan sewa versus pengeluaran operasional per bulan</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Pemasukan
                            </span>
                            <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                                <span className="h-2 w-2 rounded-full bg-rose-500" /> Pengeluaran
                            </span>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashflowData}>
                                <defs>
                                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000000}jt`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        borderColor: '#27272a',
                                        borderRadius: '0.75rem',
                                        color: '#fff',
                                        fontSize: '11px',
                                    }}
                                    formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fill="url(#incomeFill)" name="Pemasukan" />
                                <Area type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={2} fill="url(#expenseFill)" name="Pengeluaran" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Occupancy Donut (4 cols on lg) */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200/90 dark:border-zinc-800 shadow-xs lg:col-span-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                            Distribusi Status Unit
                        </h2>
                        <p className="text-xs text-zinc-500">Total kapasitas: {metrics.total_rooms} Kamar</p>

                        <div className="h-44 w-full mt-2 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={occupancyData} innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value">
                                        {occupancyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Terisi ({metrics.occupied_rooms})
                            </span>
                            <span className="font-mono font-bold text-zinc-900 dark:text-white">{metrics.occupancy_rate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                <span className="h-2 w-2 rounded-full bg-sky-500" />
                                Tersedia ({metrics.available_rooms})
                            </span>
                            <span className="font-mono font-bold text-zinc-900 dark:text-white">
                                {Math.round((metrics.available_rooms / metrics.total_rooms) * 100)}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                Perbaikan ({metrics.maintenance_rooms})
                            </span>
                            <span className="font-mono font-bold text-zinc-900 dark:text-white">
                                {Math.round((metrics.maintenance_rooms / metrics.total_rooms) * 100)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Matrix Denah Kamar */}
            <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200/90 dark:border-zinc-800 shadow-xs mb-8">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                            Denah & Status Unit Kamar
                        </h2>
                        <p className="text-xs text-zinc-500">Visualisasi ketersediaan unit kos secara langsung</p>
                    </div>
                    <Link
                        href={route('admin.rooms.index')}
                        className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1"
                    >
                        <span>Kelola Kamar</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {roomMatrix.map((room) => {
                        const style = statusBadge[room.status] || statusBadge.available;
                        return (
                            <Link
                                key={room.id}
                                href={route('admin.rooms.index')}
                                className={`rounded-xl border p-3 transition hover:border-zinc-400 dark:hover:border-zinc-600 ${style.container}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white">
                                        {room.room_number}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.badge}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                        {style.label}
                                    </span>
                                </div>
                                <div className="mt-2.5">
                                    {room.status === 'occupied' ? (
                                        <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate flex items-center gap-1">
                                            <Users className="h-3 w-3 text-zinc-400 shrink-0" />
                                            <span className="truncate">{room.tenant_name || 'Penyewa'}</span>
                                        </p>
                                    ) : room.status === 'available' ? (
                                        <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                            Rp {(room.price / 1000).toLocaleString()}k
                                        </p>
                                    ) : (
                                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <Wrench className="h-3 w-3 text-amber-500 shrink-0" />
                                            <span>Perbaikan</span>
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity: Invoices & Complaints */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Invoices Table (7 cols on lg) */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200/90 dark:border-zinc-800 shadow-xs lg:col-span-7">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                                Tagihan Sewa Terkini
                            </h2>
                            <p className="text-xs text-zinc-500">Riwayat faktur penagihan bulanan</p>
                        </div>
                        <Link href={route('admin.leases.index')} className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                                    <th className="pb-3 font-semibold">Penyewa & Unit</th>
                                    <th className="pb-3 font-semibold">Nominal</th>
                                    <th className="pb-3 font-semibold">Jatuh Tempo</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                                {recentInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40">
                                        <td className="py-3">
                                            <div className="font-semibold text-zinc-900 dark:text-white">{inv.tenant_name}</div>
                                            <span className="text-[11px] text-zinc-400">Kamar {inv.room_number} • {inv.invoice_number}</span>
                                        </td>
                                        <td className="py-3 font-mono font-bold text-zinc-900 dark:text-white">
                                            Rp {inv.amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-3 text-zinc-500">{inv.due_date}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                inv.status === 'paid'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900'
                                            }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                {inv.status === 'paid' ? 'Lunas' : 'Menunggu'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Complaints (5 cols on lg) */}
                <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200/90 dark:border-zinc-800 shadow-xs lg:col-span-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                                    Laporan Kendala Fasilitas
                                </h2>
                                <p className="text-xs text-zinc-500">Tiket keluhan terkini dari penyewa</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {recentComplaints.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 flex items-start justify-between gap-3"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                                Kamar {c.room_number} ({c.tenant_name})
                                            </span>
                                            <span className={`px-1.5 py-0.2 rounded text-[9px] ${priorityBadge[c.priority]}`}>
                                                {c.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-600 dark:text-zinc-300">
                                            {c.title}
                                        </p>
                                        <p className="text-[10px] text-zinc-400">{c.created_at_relative}</p>
                                    </div>

                                    <span className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold shrink-0">
                                        {c.status === 'open' ? 'Baru' : 'Diproses'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <Link
                            href={route('admin.tenants.index')}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        >
                            <Phone className="h-3.5 w-3.5" /> Hubungi Teknisi / Kontak
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

