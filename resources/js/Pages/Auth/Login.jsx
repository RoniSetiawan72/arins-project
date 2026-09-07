import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Building2,
    Lock,
    Mail,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Shield,
    KeyRound,
    UserCheck,
    Building,
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('owner');

    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'owner@simkos.test',
        password: 'password',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleQuickLogin = (role) => {
        setSelectedRole(role);
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
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 antialiased selection:bg-emerald-500 selection:text-white">
            <Head title="Masuk ke Sistem - SIM-Kos" />

            <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
                {/* Left Side: Editorial Branding & Product Value (5 cols on lg) */}
                <div className="lg:col-span-5 bg-zinc-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800">
                    {/* Subtle grid texture overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                            backgroundSize: '24px 24px',
                        }}
                    />

                    {/* Logo & Title */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black shadow-sm">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-xl font-bold tracking-tight text-white block leading-none">
                                    SIM-Kos
                                </span>
                                <span className="text-[11px] text-zinc-400 font-medium">
                                    Arins Residence
                                </span>
                            </div>
                        </div>

                        <div className="mt-12 space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-[11px] font-medium text-zinc-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Platform Manajemen Hunian Sewa
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
                                Pengelolaan properti kos yang rapi, transparan, dan terotomatisasi.
                            </h2>
                            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                                Dirancang untuk membantu pemilik kos mengelola unit kamar, mencatat kontrak, dan mengotomatisasi tagihan sewa.
                            </p>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="relative z-10 mt-8 pt-6 border-t border-zinc-800/80 space-y-3 text-xs text-zinc-300">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Integrasi Pembayaran Otomatis QRIS & Virtual Account</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Kalkulator Transparan Deposit & Checkout Sewa</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Portal Mandiri & Saluran Komplain Penghuni</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form (7 cols on lg) */}
                <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white dark:bg-zinc-900">
                    <div>
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                Masuk ke Akun
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                Pilih akun akses cepat atau masukkan kredensial akun Anda.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                {status}
                            </div>
                        )}

                        {/* Fast Demo Role Switcher Tabs */}
                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                                Akses Cepat Akun Demo (1-Klik):
                            </label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
                                <button
                                    type="button"
                                    onClick={() => handleQuickLogin('owner')}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                                        selectedRole === 'owner'
                                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                                    }`}
                                >
                                    <Building className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>Ibu Kos (Owner)</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleQuickLogin('tenant')}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
                                        selectedRole === 'tenant'
                                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                                    }`}
                                >
                                    <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                                    <span>Anak Kos (Tenant)</span>
                                </button>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => {
                                            setData('email', e.target.value);
                                            setSelectedRole('');
                                        }}
                                        placeholder="nama@email.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                        Kata Sandi
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 h-4 w-4"
                                    />
                                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                                        Ingat saya di perangkat ini
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 py-3 text-xs font-bold shadow-xs transition active:scale-[0.99] disabled:opacity-50"
                            >
                                {processing ? 'Memproses Masuk...' : 'Masuk ke SIM-Kos'}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>SIM-Kos Properti v1.0</span>
                        <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-emerald-500" />
                            Koneksi Aman
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

