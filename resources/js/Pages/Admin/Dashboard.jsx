import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    BedDouble,
    TrendingUp,
    TrendingDown,
    Wallet,
    Receipt,
    Wrench,
    Plus,
    ArrowUpRight,
    Users,
    Phone,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Building2,
    Sparkles,
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
    const COLORS = ['#10B981', '#0284C7', '#F59E0B']; // Hijau, Biru, Kuning

    const statusBadge = {
        occupied: {
            label: 'Terisi',
            container: 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/30',
            badge: 'bg-emerald-500 text-white',
            dot: 'bg-emerald-500',
        },
        available: {
            label: 'Kosong',
            container: 'border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/30',
            badge: 'bg-sky-500 text-white',
            dot: 'bg-sky-500',
        },
        maintenance: {
            label: 'Perbaikan',
            container: 'border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/30',
            badge: 'bg-amber-500 text-white',
            dot: 'bg-amber-500',
        },
    };

    const priorityBadge = {
        high: 'bg-rose-100 text-rose-700 font-bold',
        medium: 'bg-amber-100 text-amber-700 font-semibold',
        low: 'bg-slate-100 text-slate-600',
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Ringkasan Properti - SIM-Kos" />

            {/* Header Greeting & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Ringkasan Operasional Hari Ini
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Dashboard Ibu Kos
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                        Pantau tingkat okupansi unit, arus kas bersih, dan keluhan penyewa kos secara terpusat.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                        href={route('admin.leases.create')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-indigo-100 transition active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> Kontrak Baru
                    </Link>
                    <Link
                        href={route('admin.rooms.index')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold shadow-2xs transition"
                    >
                        <BedDouble className="h-4 w-4 text-indigo-600" /> Master Kamar
                    </Link>
                </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {/* 1. Tingkat Okupansi */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rasio Okupansi</span>
                        <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <BedDouble className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">
                            {metrics.occupancy_rate}%
                        </span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400 ml-2">
                            ({metrics.occupied_rooms} / {metrics.total_rooms} Kamar)
                        </span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.occupancy_rate}%` }}
                        />
                    </div>
                </div>

                {/* 2. Pendapatan Masuk */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pendapatan Sewa</span>
                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Wallet className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                            Rp {(metrics.current_month_income / 1000000).toFixed(1)} jt
                        </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <TrendingUp className="h-3.5 w-3.5" /> +8.4% vs bulan lalu
                    </div>
                </div>

                {/* 3. Laba Bersih */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Laba Bersih (Net)</span>
                        <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                            Rp {(metrics.net_profit / 1000000).toFixed(1)} jt
                        </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                        Biaya ops: Rp {(metrics.current_month_expense / 1000000).toFixed(1)} jt
                    </p>
                </div>

                {/* 4. Tagihan Belum Lunas */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tagihan Pending</span>
                        <div className="h-10 w-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Receipt className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                            {metrics.unpaid_invoices_count} Tagihan
                        </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500 font-semibold">
                        Nominal: Rp {(metrics.unpaid_invoices_amount / 1000000).toFixed(1)} jt
                    </p>
                </div>
            </div>

            {/* Analytics Charts (Cashflow & Occupancy Donut) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Cashflow Chart (2/3 width) */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                Arus Kas Bulanan (Cashflow)
                            </h2>
                            <p className="text-xs text-slate-500">Pemasukan sewa vs Biaya operasional kos</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1.5 text-emerald-600">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Pemasukan
                            </span>
                            <span className="flex items-center gap-1.5 text-rose-500">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Pengeluaran
                            </span>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashflowData}>
                                <defs>
                                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000000}jt`} />
                                <Tooltip formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']} />
                                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} fill="url(#incomeGrad)" name="Pemasukan" />
                                <Area type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={2.5} fill="url(#expenseGrad)" name="Pengeluaran" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Occupancy Donut (1/3 width) */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Proporsi Status Unit
                        </h2>
                        <p className="text-xs text-slate-500">Total {metrics.total_rooms} Kamar Properti</p>

                        <div className="h-48 w-full mt-3 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={occupancyData} innerRadius={48} outerRadius={70} paddingAngle={4} dataKey="value">
                                        {occupancyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs font-semibold">
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Terisi ({metrics.occupied_rooms})</span>
                            <span className="font-bold text-slate-800 dark:text-white">{metrics.occupancy_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Kosong ({metrics.available_rooms})</span>
                            <span className="font-bold text-slate-800 dark:text-white">{Math.round((metrics.available_rooms / metrics.total_rooms) * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Perbaikan ({metrics.maintenance_rooms})</span>
                            <span className="font-bold text-slate-800 dark:text-white">{Math.round((metrics.maintenance_rooms / metrics.total_rooms) * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Matrix Grid */}
            <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs mb-8">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Denah & Status Kamar Real-Time
                        </h2>
                        <p className="text-xs text-slate-500">Visualisasi unit kamar kos per nomor</p>
                    </div>
                    <Link
                        href={route('admin.rooms.index')}
                        className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                        Kelola Semua Kamar →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {roomMatrix.map((room) => {
                        const style = statusBadge[room.status] || statusBadge.available;
                        return (
                            <Link
                                key={room.id}
                                href={route('admin.rooms.index')}
                                className={`rounded-2xl border p-3.5 transition hover:scale-[1.02] ${style.container}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-sm text-slate-900 dark:text-white">
                                        {room.room_number}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${style.badge}`}>
                                        {style.label}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    {room.status === 'occupied' ? (
                                        <p className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 truncate">
                                            👤 {room.tenant_name || 'Penyewa'}
                                        </p>
                                    ) : room.status === 'available' ? (
                                        <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                            Rp {(room.price / 1000).toLocaleString()}k/bln
                                        </p>
                                    ) : (
                                        <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                                            🛠️ Perbaikan
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
                {/* Tagihan Terbaru (7 cols) */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs lg:col-span-7">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                Tagihan & Invoice Terbaru
                            </h2>
                            <p className="text-xs text-slate-500">Status pembayaran tagihan sewa</p>
                        </div>
                        <Link href={route('admin.leases.index')} className="text-xs font-bold text-indigo-600 hover:underline">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400">
                                    <th className="pb-3 font-bold">Penyewa / Kamar</th>
                                    <th className="pb-3 font-bold">Nominal</th>
                                    <th className="pb-3 font-bold">Jatuh Tempo</th>
                                    <th className="pb-3 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {recentInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
                                        <td className="py-3">
                                            <div className="font-bold text-slate-900 dark:text-white">{inv.tenant_name}</div>
                                            <span className="text-[11px] text-slate-400">Kamar {inv.room_number} • {inv.invoice_number}</span>
                                        </td>
                                        <td className="py-3 font-black text-slate-900 dark:text-white">
                                            Rp {inv.amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-3 text-slate-500">{inv.due_date}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                inv.status === 'paid'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {inv.status === 'paid' ? 'Lunas' : 'Menunggu'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tiket Komplain & Kerusakan (5 cols) */}
                <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-slate-200/80 dark:border-zinc-800 shadow-xs lg:col-span-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                    Tiket Pengaduan Kerusakan
                                </h2>
                                <p className="text-xs text-slate-500">Keluhan fasilitas dari anak kos</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {recentComplaints.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/60 flex items-start justify-between gap-3"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                                Kamar {c.room_number} ({c.tenant_name})
                                            </span>
                                            <span className={`px-1.5 py-0.2 rounded text-[9px] ${priorityBadge[c.priority]}`}>
                                                {c.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium">
                                            {c.title}
                                        </p>
                                        <p className="text-[10px] text-slate-400">{c.created_at_relative}</p>
                                    </div>

                                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold shrink-0">
                                        {c.status === 'open' ? 'Baru' : 'Diproses'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
                        <Link
                            href={route('admin.tenants.index')}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-indigo-600"
                        >
                            <Phone className="h-3.5 w-3.5" /> Hubungi Tukang / Teknisi
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
