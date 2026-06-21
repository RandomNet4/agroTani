// =====================================================
// TRACKING PICKUP & PEMBAYARAN - PETANI
// =====================================================

import React from 'react';
import { ArrowLeft, Truck, MapPin, Phone, Clock, Scale, CreditCard, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { formatRupiah, formatTanggal } from '../../data/dummy';
import { useData } from '../../context/DataContext';

const TrackingPickupPage: React.FC = () => {
  const { pickup, pembayaran, currentUser } = useData();
  const navigate = useNavigate();
  const petaniId = currentUser?.id || '';

  const pickupSaya = pickup.filter(p => p.petaniId === petaniId);
  const pembayaranSaya = pembayaran.filter(p => p.petaniId === petaniId);

  // Timeline steps
  const getTimelineSteps = (status: string) => {
    const steps = [
      { key: 'dijadwalkan', label: 'Dijadwalkan', icon: <Clock size={14} /> },
      { key: 'berangkat', label: 'Berangkat', icon: <Truck size={14} /> },
      { key: 'hampir_tiba', label: 'Hampir Tiba', icon: <MapPin size={14} /> },
      { key: 'sudah_sampai', label: 'Tiba', icon: <MapPin size={14} /> },
      { key: 'proses_timbang', label: 'Timbang', icon: <Scale size={14} /> },
      { key: 'selesai', label: 'Selesai', icon: <CheckCircle size={14} /> },
    ];
    const currentIdx = steps.findIndex(s => s.key === status);
    return steps.map((s, i) => ({ ...s, done: i <= currentIdx, active: i === currentIdx }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-600 text-white px-4 py-4 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-lg">Tracking Pickup</h1>
            <p className="text-blue-100 text-xs">Pantau pengambilan & pembayaran</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-4">
        {pickupSaya.length === 0 && (
          <div className="card text-center py-10">
            <Truck size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Belum ada pickup yang dijadwalkan</p>
          </div>
        )}

        {pickupSaya.map(pkp => {
          const timeline = getTimelineSteps(pkp.status);
          const pembayaran = pembayaranSaya.find(p => p.pickupId === pkp.id);

          return (
            <div key={pkp.id} className="card">
              {/* Pickup Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{pkp.komoditasNama}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> {pkp.alamatPickup}
                  </p>
                  <p className="text-xs text-gray-500">{formatTanggal(pkp.tanggalPickup)}</p>
                </div>
                <StatusBadge status={pkp.status} />
              </div>

              {/* Driver Info */}
              <div className="bg-blue-50 rounded-xl p-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center text-lg">🚛</div>
                  <div>
                    <p className="font-semibold text-sm">{pkp.driverNama}</p>
                    <p className="text-xs text-gray-500">{pkp.armada} • {pkp.platNomor}</p>
                  </div>
                </div>
                <button className="p-2 bg-blue-100 rounded-xl text-blue-600">
                  <Phone size={18} />
                </button>
              </div>

              {/* Timeline */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-600 mb-3">Status Perjalanan</h4>
                <div className="flex items-center justify-between">
                  {timeline.map((step, i) => (
                    <div key={step.key} className="flex flex-col items-center relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                        step.active
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : step.done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <p className={`text-[9px] mt-1 text-center ${step.done ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {/* Connector line */}
                      {i < timeline.length - 1 && (
                        <div className={`absolute top-4 left-8 w-[calc(100%-8px)] h-0.5 ${
                          timeline[i + 1].done ? 'bg-emerald-400' : 'bg-gray-200'
                        }`} style={{ width: '30px', left: '32px' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timbang Result */}
              {pkp.beratTimbangKg && (
                <div className="bg-emerald-50 rounded-xl p-3 mb-3">
                  <h4 className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                    <Scale size={14} /> Hasil Timbang di Lokasi
                  </h4>
                  <p className="text-2xl font-bold text-emerald-700">{pkp.beratTimbangKg.toLocaleString()} kg</p>
                </div>
              )}

              {/* Pembayaran */}
              {pembayaran && (
                <div className={`rounded-xl p-3 ${
                  pembayaran.status === 'dibayar' ? 'bg-emerald-50' : 'bg-amber-50'
                }`}>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                    <CreditCard size={14} />
                    Pembayaran
                    <StatusBadge status={pembayaran.status} size="sm" />
                  </h4>
                  {pembayaran.status === 'dibayar' && (
                    <>
                      <p className="text-2xl font-bold text-emerald-700">{formatRupiah(pembayaran.totalBayar)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {pembayaran.beratKg} kg × {formatRupiah(pembayaran.hargaPerKg)}/kg
                      </p>
                      <p className="text-xs text-gray-500">{pembayaran.metodeBayar}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="btn-secondary text-xs py-1.5 flex items-center gap-1 flex-1">
                          <FileText size={14} /> Download Invoice
                        </button>
                        <button className="btn-primary text-xs py-1.5 flex items-center gap-1 flex-1">
                          <CreditCard size={14} /> Bukti Transfer
                        </button>
                      </div>
                    </>
                  )}
                  {pembayaran.status === 'menunggu' && (
                    <p className="text-sm text-amber-700">Pembayaran akan diproses setelah pickup selesai.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingPickupPage;
