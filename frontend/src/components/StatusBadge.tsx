// =====================================================
// STATUS BADGE COMPONENT
// =====================================================

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  // Verifikasi
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Menunggu' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Disetujui' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Ditolak' },
  survey: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Survey' },
  // Pickup
  dijadwalkan: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Dijadwalkan' },
  berangkat: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Berangkat' },
  hampir_tiba: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Hampir Tiba' },
  sudah_sampai: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Sudah Sampai' },
  proses_timbang: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Proses Timbang' },
  selesai: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Selesai' },
  // Pembayaran
  menunggu: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Menunggu' },
  diproses: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Diproses' },
  dibayar: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Selesai' },
  gagal: { bg: 'bg-red-100', text: 'text-red-700', label: 'Gagal' },
  // Tender
  aktif: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Aktif' },
  terpenuhi: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Terpenuhi' },
  kadaluarsa: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Kadaluarsa' },
  // Pengajuan Jual
  pickup_dijadwalkan: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Pickup Dijadwalkan' },
  // Supply Status
  kurang: { bg: 'bg-red-100', text: 'text-red-700', label: 'Kurang' },
  cukup: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Cukup' },
  berlebih: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Berlebih' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${config.bg} ${config.text} ${sizeClass}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
