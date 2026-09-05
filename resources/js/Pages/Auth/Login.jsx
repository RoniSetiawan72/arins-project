import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Building2,
    Lock,
    Mail,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Eye,
    EyeOff,
    Sparkles,
    UserCheck,
    KeyRound,
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleQuickLogin = (role) => {
        if (role === 'owner') {
            setData({
                email: 'owner@simkos.test',
                password: 'password',
                remember: true,
            });
        } else if (role === 'tenant') {
            setData({
                email: 'tenant@simkos.test',
                password: 'password',
                remember: true,
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <Head title="Masuk ke Sistem - SIM-Kos" />

            <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                {/* Left Side: Branding & Marketing Illustration (5 cols on lg) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative background blurs */}
                    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

                    {/* Logo & Title */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-2xl font-black tracking-tight text-white block leading-none">
                                    SIM-Kos
                                </span>
                                <span className="text-xs text-indigo-200 font-medium mt-0.5 block">
                                    Sistem Informasi Pengelolaan Kos
                                </span>
                            </div>
                        </div>

                        <div className="mt-12 space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-indigo-100 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Manajemen Kos Otomatis & Cerdas
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                                Kelola properti kos Anda dengan tenang dan transparan.
                            </h2>
                            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                                Otomatisasi tagihan bulanan dengan payment gateway Xendit, kelola tiket perbaikan kamar, dan pantau arus kas bersih secara real-time.
                            </p>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-2.5 text-xs text-indigo-100">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                            <span>Integrasi QRIS, Virtual Account, & E-Wallet</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                            <span>Kalkulator Otomatis Pengembalian Deposit</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                            <span>Pelaporan Kendala Fasilitas & WhatsApp Click-to-Chat</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form (7 cols on lg) */}
                <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
                    <div>
                        <div className="mb-6">
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Selamat Datang Kembali 👋
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                                Silakan masuk ke akun Anda untuk melanjutkan ke dashboard.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200">
                                {status}
                            </div>
                        )}

                        {/* Quick Demo Login Cards */}
                        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2.5">
                                <KeyRound className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Akun Demo Cepat (1-Klik Isi Form):</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleQuickLogin('owner')}
                                    className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-900/60 text-left hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30 transition group shadow-2xs"
                                >
                                    <div>
                                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
                                            🏢 Ibu Kos (Owner)
                                        </span>
                                        <span className="text-[10px] text-slate-400 block font-mono">
                                            owner@simkos.test
                                        </span>
                                    </div>
                                    <ArrowRight className="h-3.5 w-3.5 text-indigo-400 group-hover:translate-x-0.5 transition" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleQuickLogin('tenant')}
                                    className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/60 text-left hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 transition group shadow-2xs"
                                >
                                    <div>
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                                            👤 Anak Kos (Penyewa)
                                        </span>
                                        <span className="text-[10px] text-slate-400 block font-mono">
                                            tenant@simkos.test
                                        </span>
                                    </div>
                                    <ArrowRight className="h-3.5 w-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
                                </button>
                            </div>
                        </div>

                        {/* Form Login */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                                        Kata Sandi (Password)
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
                                        Ingat saya di perangkat ini
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition active:scale-[0.99] disabled:opacity-50"
                            >
                                {processing ? 'Memverifikasi...' : 'Masuk ke SIM-Kos'}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 text-center">
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            SIM-Kos Properti & Boarding House Management • Versi 1.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
