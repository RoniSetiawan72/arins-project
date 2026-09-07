import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    QrCode,
    Receipt,
    Wrench,
    Wifi,
    Phone,
    CheckCircle2,
    Clock,
    BedDouble,
    LogOut,
    ExternalLink,
    Building2,
    ShieldCheck,
    X,
    MessageCircle,
    ChevronRight,
} from 'lucide-react';

export default function TenantDashboard({ tenant = {}, activeInvoice = null, complaints = [] }) {
    const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const ibuKosPhone = '6281234567890';
    const waText = encodeURIComponent(
        `Halo Ibu Kos, saya ${tenant.name || 'Penyewa'} dari Kamar ${tenant.room_number || ''}. Saya ingin menanyakan perihal sewa kamar kos.`
    );

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center antialiased selection:bg-emerald-500 selection:text-white">
            <Head title="Portal Penghuni - SIM-Kos" />

            {/* Mobile App Container Frame */}
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 min-h-screen shadow-lg border-x border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between pb-10">
                <div>
                    {/* Top App Bar Header */}
                    <div className="bg-zinc-950 text-white p-5 border-b border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="font-bold text-sm tracking-tight text-white block leading-none">
                                        SIM-Kos
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-medium">
                                        Arins Residence
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-right">
                                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-semibold leading-none">Kamar</span>
                                    <span className="text-xs font-mono font-bold text-white">{tenant.room_number}</span>
                                </div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                                    title="Keluar"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs text-zinc-400">Selamat datang,</span>
                            <h1 className="text-lg font-bold text-white tracking-tight">
                                {tenant.name}
                            </h1>
                            <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Tipe Kamar: {tenant.room_type}
                            </p>
                        </div>
                    </div>

                    {/* Active Invoice Card Banner */}
                    <div className="p-4">
                        {activeInvoice ? (
                            <div className="rounded-xl bg-zinc-950 text-white p-5 border border-zinc-800 shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-medium text-zinc-400">Tagihan Sewa Bulan Ini</span>
                                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold font-mono">
                                        Tempo: {activeInvoice.due_date}
                                    </span>
                                </div>

                                <div className="my-2">
                                    <span className="text-2xl font-bold font-mono text-white tracking-tight">
                                        Rp {activeInvoice.amount.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <a
                                    href={activeInvoice.payment_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold transition shadow-xs active:scale-98"
                                >
                                    <QrCode className="h-4 w-4" />
                                    <span>Bayar Tagihan (QRIS / VA)</span>
                                    <ExternalLink className="h-3 w-3 opacity-70" />
                                </a>
                            </div>
                        ) : (
                            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 p-4 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-300">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <div>
                                    <p className="font-bold">Semua Tagihan Lunas</p>
                                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Tidak ada tagihan sewa yang menunggu pembayaran.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4 Quick Action Service Buttons */}
                    <div className="px-4 mb-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5">
                            Layanan Cepat
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {/* 1. Kwitansi */}
                            <button
                                onClick={() => alert('Fitur kwitansi digital akan mengunduh bukti invoice PDF lunas.')}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                <div className="h-9 w-9 rounded-lg bg-zinc-200/80 dark:bg-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                                    <Receipt className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Kwitansi</span>
                            </button>

                            {/* 2. Lapor Kendala */}
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                <div className="h-9 w-9 rounded-lg bg-zinc-200/80 dark:bg-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                                    <Wrench className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Lapor Rusak</span>
                            </button>

                            {/* 3. Info WiFi */}
                            <button
                                onClick={() => setIsWifiModalOpen(true)}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                <div className="h-9 w-9 rounded-lg bg-zinc-200/80 dark:bg-zinc-700 flex items-center justify-center text-zinc-800 dark:text-zinc-200">
                                    <Wifi className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Info WiFi</span>
                            </button>

                            {/* 4. Chat WhatsApp */}
                            <a
                                href={`https://wa.me/${ibuKosPhone}?text=${waText}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Ibu Kos</span>
                            </a>
                        </div>
                    </div>

                    {/* Room Info Specs */}
                    <div className="px-4 mb-4">
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 space-y-3 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-700">
                                <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                                    <BedDouble className="h-4 w-4 text-zinc-500" /> Informasi Kamar {tenant.room_number}
                                </span>
                                <span className="text-zinc-500 text-[11px] font-mono">Mulai: {tenant.start_date}</span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {tenant.facilities && tenant.facilities.map((fac, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[10px] font-medium text-zinc-700 dark:text-zinc-300"
                                    >
                                        {fac}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700 flex justify-between text-[11px]">
                                <span className="text-zinc-500">Deposit Tersimpan:</span>
                                <span className="font-mono font-bold text-zinc-900 dark:text-white">
                                    Rp {Number(tenant.deposit_amount || 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Complaint History */}
                    <div className="px-4">
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                Status Laporan Kendala
                            </span>
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
                            >
                                + Buat Tiket
                            </button>
                        </div>

                        <div className="space-y-2">
                            {complaints.length > 0 ? (
                                complaints.map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-3 rounded-xl bg-white dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-2xs"
                                    >
                                        <div>
                                            <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">
                                                {c.title}
                                            </h3>
                                            <p className="text-[10px] text-zinc-400 mt-0.5">{c.created_at}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                            c.status === 'resolved'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900'
                                                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900'
                                        }`}>
                                            {c.status === 'resolved' ? (
                                                <>
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Selesai
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="h-3 w-3 text-amber-500" /> Diproses
                                                </>
                                            )}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-zinc-400 p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                                    Tidak ada riwayat kendala fasilitas.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Portal Brand */}
                <div className="px-4 pt-6 text-center text-[11px] text-zinc-400">
                    SIM-Kos Portal Penghuni • Arins Residence
                </div>
            </div>

            {/* Modal Info WiFi */}
            {isWifiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                    <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-xl border border-zinc-200 dark:border-zinc-800 text-center">
                        <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 mx-auto flex items-center justify-center mb-3">
                            <Wifi className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Akses Internet WiFi</h3>
                        <div className="my-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700 text-xs space-y-1.5 text-left">
                            <div className="flex justify-between">
                                <span className="text-zinc-500">SSID:</span>
                                <span className="font-mono font-bold text-zinc-900 dark:text-white">Arins_Residence_Lt1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500">Password:</span>
                                <span className="font-mono font-bold text-zinc-900 dark:text-white">kosarins2026</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsWifiModalOpen(false)}
                            className="w-full py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Lapor Kendala Form */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                                Form Lapor Kerusakan
                            </h3>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">Jenis Kendala</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: AC bocor / Lampu kamar mandi mati"
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">Deskripsi Detail</label>
                                <textarea
                                    rows="3"
                                    placeholder="Jelaskan kendala fasilitas yang dialami..."
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2">
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                className="flex-1 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    alert('Laporan kendala telah tercatat dan diteruskan ke Ibu Kos.');
                                    setIsReportModalOpen(false);
                                }}
                                className="flex-1 py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:opacity-90"
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

