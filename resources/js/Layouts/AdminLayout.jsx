import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    BedDouble,
    FileText,
    Users,
    Receipt,
    Wrench,
    Wallet,
    BarChart3,
    LogOut,
    Menu,
    X,
    CheckCircle2,
    AlertCircle,
    Building2,
    Sparkles,
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth, flash = {} } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [flashVisible, setFlashVisible] = useState(true);

    const navigation = [
        { name: 'Daftar Kamar', href: route('admin.rooms.index'), icon: BedDouble, current: route().current('admin.rooms.*') },
        { name: 'Kontrak Sewa', href: route('admin.leases.index'), icon: FileText, current: route().current('admin.leases.*') },
        { name: 'Data Penyewa', href: route('admin.tenants.index'), icon: Users, current: route().current('admin.tenants.*') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">SIM-Kos</span>
                        <span className="block text-[10px] text-indigo-600 font-semibold dark:text-indigo-400">Portal Pemilik</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                >
                    {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } flex flex-col justify-between`}>
                <div>
                    {/* Brand Logo */}
                    <div className="hidden md:flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-zinc-800">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100 dark:shadow-none">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">SIM-Kos</h1>
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Panel Kelola Properti</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="px-3 py-4 space-y-1">
                        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                            Operasional Utama
                        </div>
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        item.current
                                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                                            : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <Icon className={`h-5 w-5 ${item.current ? 'text-white' : 'text-slate-400 dark:text-zinc-500'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60">
                        <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{auth?.user?.name || 'Ibu Kos'}</p>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Pemilik Kos
                            </span>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition"
                            title="Keluar"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Flash Messages */}
                {flashVisible && (flash.success || flash.error) && (
                    <div className="px-4 pt-4 md:px-8">
                        {flash.success && (
                            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300 text-sm shadow-xs">
                                <div className="flex items-center gap-2.5 font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>{flash.success}</span>
                                </div>
                                <button onClick={() => setFlashVisible(false)} className="text-emerald-600 hover:opacity-75">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        {flash.error && (
                            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300 text-sm shadow-xs">
                                <div className="flex items-center gap-2.5 font-medium">
                                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                                    <span>{flash.error}</span>
                                </div>
                                <button onClick={() => setFlashVisible(false)} className="text-rose-600 hover:opacity-75">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-4 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
