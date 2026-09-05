import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    QrCode,
    Receipt,
    Wrench,
    Wifi,
    Phone,
    ShieldAlert,
    CheckCircle2,
    Clock,
    BedDouble,
    Calendar,
    LogOut,
    Sparkles,
    CreditCard,
    ExternalLink,
    AlertCircle,
    Info,
} from 'lucide-react';

export default function TenantDashboard({ tenant = {}, activeInvoice = null, complaints = [] }) {
    const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const ibuKosPhone = '6281234567890'; // Default phone Ibu Kos
    const waText = encodeURIComponent(
        `Halo Ibu Kos, saya ${tenant.name} dari Kamar ${tenant.room_number}. Saya ingin menanyakan perihal sewa kamar kos.`
    );

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col items-center">
            <Head title="Portal Penghuni Kos - SIM-Kos" />

            <div className="w-full max-w-md bg-white dark:bg-zinc-900 min-h-screen shadow-2xl flex flex-col justify-between pb-12">
                <div>
                    {/* Top Header Card (Indigo Gradient) */}
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-6 text-white rounded-b-[2rem] shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-[11px] font-semibold text-indigo-200 block">
                                    Selamat Datang,
                                </span>
                                <h1 className="text-xl font-extrabold tracking-tight text-white">
                                    {tenant.name}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-right">
                                    <span className="text-[9px] uppercase tracking-wider text-indigo-200 block font-bold">Kamar</span>
                                    <span className="text-sm font-black text-white">{tenant.room_number}</span>
                                </div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                                    title="Keluar"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-indigo-100/90 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Arins Residence • {tenant.room_type}</span>
                        </div>

                        {/* Banner Tagihan Berjalan (Call-to-Action Utama) */}
                        {activeInvoice && (
                            <div className="mt-6 rounded-3xl bg-white dark:bg-zinc-900 p-5 text-slate-900 dark:text-white shadow-2xl border border-white/20">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="font-bold text-slate-500 dark:text-zinc-400">Tagihan Sewa Bulan Ini</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold">
                                        Jatuh Tempo: {activeInvoice.due_date}
                                    </span>
                                </div>

                                <div className="my-2">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                        Rp {activeInvoice.amount.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <a
                                    href={activeInvoice.payment_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-3 text-xs font-extrabold shadow-lg shadow-emerald-200 dark:shadow-none transition"
                                >
                                    <QrCode className="h-4 w-4" />
                                    Bayar Sekarang (QRIS / VA / E-Wallet)
                                    <ExternalLink className="h-3 w-3 opacity-70" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Quick Services Grid (4 Tombol) */}
                    <div className="p-5">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Layanan Penghuni
                        </h2>
                        <div className="grid grid-cols-4 gap-2.5">
                            {/* 1. Kwitansi */}
                            <button
                                onClick={() => alert('Fitur kwitansi digital akan mengunduh bukti invoice PDF lunas.')}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 hover:bg-slate-100 transition shadow-2xs"
                            >
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Receipt className="h-5 w-5" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Kwitansi</span>
                            </button>

                            {/* 2. Lapor Kerusakan */}
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 hover:bg-slate-100 transition shadow-2xs"
                            >
                                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                    <Wrench className="h-5 w-5" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Lapor Rusak</span>
                            </button>

                            {/* 3. Info WiFi */}
                            <button
                                onClick={() => setIsWifiModalOpen(true)}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 hover:bg-slate-100 transition shadow-2xs"
                            >
                                <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                    <Wifi className="h-5 w-5" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Info WiFi</span>
                            </button>

                            {/* 4. Chat Ibu Kos WhatsApp */}
                            <a
                                href={`https://wa.me/${ibuKosPhone}?text=${waText}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 hover:bg-slate-100 transition shadow-2xs"
                            >
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Ibu Kos</span>
                            </a>
                        </div>
                    </div>

                    {/* Informasi Kamar & Fasilitas */}
                    <div className="px-5 mb-5">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 space-y-3 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-zinc-700">
                                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <BedDouble className="h-4 w-4 text-indigo-600" /> Detail Kamar {tenant.room_number}
                                </span>
                                <span className="text-slate-500 text-[11px]">Mulai: {tenant.start_date}</span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {tenant.facilities && tenant.facilities.map((fac, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[10px] font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        {fac}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-700 flex justify-between text-[11px]">
                                <span className="text-slate-500">Deposit Tersimpan:</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                    Rp {Number(tenant.deposit_amount).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Tiket Pengaduan Terakhir */}
                    <div className="px-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Status Laporan Kendala
                            </h2>
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400"
                            >
                                + Buat Tiket
                            </button>
                        </div>

                        <div className="space-y-2">
                            {complaints.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-800 shadow-2xs flex items-center justify-between gap-3"
                                >
                                    <div>
                                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                            {c.title}
                                        </h3>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{c.created_at}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                        c.status === 'resolved'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                        {c.status === 'resolved' ? (
                                            <>
                                                <CheckCircle2 className="h-3 w-3" /> Selesai
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="h-3 w-3" /> Diproses
                                            </>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="px-5 pt-8 text-center text-xs text-slate-400">
                    SIM-Kos Tenant Mobile Portal
                </div>
            </div>

            {/* Modal Info WiFi */}
            {isWifiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="w-full max-w-xs rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 text-center">
                        <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 mx-auto flex items-center justify-center mb-3">
                            <Wifi className="h-6 w-6" />
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Akses WiFi Kos</h3>
                        <div className="my-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 text-xs space-y-1">
                            <p className="text-slate-500">SSID: <span className="font-bold text-slate-900 dark:text-white">Arins_Residence_Lt1</span></p>
                            <p className="text-slate-500">Password: <span className="font-mono font-bold text-indigo-600">kosarins2026</span></p>
                        </div>
                        <button
                            onClick={() => setIsWifiModalOpen(false)}
                            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Lapor Kerusakan (Simple Simulation) */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-200 dark:border-zinc-800">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                            Form Lapor Kerusakan Fasilitas
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                            Laporan akan langsung diteruskan ke Ibu Kos untuk jadwal teknisi.
                        </p>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold block mb-1">Judul Kendala</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: AC Menetes Air"
                                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="font-bold block mb-1">Deskripsi Lengkap</label>
                                <textarea
                                    rows="3"
                                    placeholder="Jelaskan detail kendala..."
                                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2">
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    alert('Tiket komplain berhasil dikirim ke Ibu Kos.');
                                    setIsReportModalOpen(false);
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-md"
                            >
                                Kirim Laporan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
