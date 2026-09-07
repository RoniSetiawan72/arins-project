import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    BedDouble,
    FileText,
    Users,
    LogOut,
    Menu,
    X,
    CheckCircle2,
    AlertCircle,
    Building2,
    ChevronRight,
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth, flash = {} } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [flashVisible, setFlashVisible] = useState(true);

    const navigation = [
        {
            name: 'Dashboard Ringkasan',
            href: route('admin.dashboard'),
            icon: LayoutDashboard,
            current: route().current('admin.dashboard'),
        },
        {
            name: 'Inventaris Kamar',
            href: route('admin.rooms.index'),
            icon: BedDouble,
            current: route().current('admin.rooms.*'),
        },
        {
            name: 'Kontrak Sewa',
            href: route('admin.leases.index'),
            icon: FileText,
            current: route().current('admin.leases.*'),
        },
        {
            name: 'Direktori Penyewa',
            href: route('admin.tenants.index'),
            icon: Users,
            current: route().current('admin.tenants.*'),
        },
    ];

    const userInitials = (auth?.user?.name || 'Ibu Kos')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-white">
            {/* Mobile Top Header */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 sticky top-0 z-40">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                        <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white block leading-none">
                            SIM-Kos
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                            Arins Residence
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Toggle Menu"
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
                >
                    {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </header>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/80 dark:border-zinc-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static flex flex-col justify-between ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* Brand Header */}
                    <div className="px-5 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-xs">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white leading-tight">
                                    SIM-Kos
                                </h1>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                                    Sistem Kelola Properti
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="px-3 py-4 space-y-1">
                        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Menu Utama
                        </div>
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                        item.current
                                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                                            : 'text-zinc-600 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-white'
                                    }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 ${
                                            item.current
                                                ? 'text-white dark:text-zinc-900'
                                                : 'text-zinc-400 dark:text-zinc-500'
                                        }`}
                                    />
                                    <span className="flex-1">{item.name}</span>
                                    {item.current && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-600" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom User Profile Section */}
                <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-200 shrink-0">
                                {userInitials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                                    {auth?.user?.name || 'Ibu Kos'}
                                </p>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Owner
                                </span>
                            </div>
                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                            title="Keluar Akun"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs z-40 md:hidden"
                />
            )}

            {/* Main Workspace */}
            <main className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Desktop Top Header Bar */}
                <div className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">SIM-Kos</span>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Panel Manajemen Properti</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Sistem Operasional Aktif
                        </div>
                    </div>
                </div>

                {/* Flash Messages */}
                {flashVisible && (flash.success || flash.error) && (
                    <div className="px-4 pt-4 md:px-8 max-w-7xl w-full mx-auto">
                        {flash.success && (
                            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300 text-xs shadow-xs">
                                <div className="flex items-center gap-2 font-medium">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>{flash.success}</span>
                                </div>
                                <button
                                    onClick={() => setFlashVisible(false)}
                                    className="text-emerald-600 hover:opacity-75 p-1"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        )}
                        {flash.error && (
                            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 text-xs shadow-xs">
                                <div className="flex items-center gap-2 font-medium">
                                    <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                    <span>{flash.error}</span>
                                </div>
                                <button
                                    onClick={() => setFlashVisible(false)}
                                    className="text-rose-600 hover:opacity-75 p-1"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Page Content Container */}
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
