import React from 'react';
import { Leaf, Clock, MapPin, Truck, CheckCircle2, Factory } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatTanggal } from '../../data/dummy';;

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string; activeColor: string }> = {
  qc_selesai: { label: 'Lolos QC', icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', activeColor: 'bg-emerald-500' },
  masuk_cuci: { label: 'Proses Pencucian', icon: Leaf, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', activeColor: 'bg-blue-500' },
  proses_packing: { label: 'Proses Packing', icon: Factory, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', activeColor: 'bg-indigo-500' },
  siap_distribusi: { label: 'Siap Distribusi', icon: Truck, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', activeColor: 'bg-amber-500' },
  didistribusikan: { label: 'Dalam Pengiriman', icon: Truck, color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-200', activeColor: 'bg-violet-500' },
  diterima_toko: { label: 'Diterima Toko', icon: CheckCircle2, color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-200', activeColor: 'bg-teal-500' },
};

const JejakPanenPage: React.FC = () => {
  const { jejakPanen: dummyJejakPanen } = useData();
  // Simulasi login sebagai PTN002 (Siti Aminah)
  const petaniId = 'PTN002';
  const myJejak = dummyJejakPanen.filter(j => j.petaniId === petaniId);

  return (
    <div className="pb-24">
      <div className="bg-emerald-600 pt-12 pb-6 px-6 rounded-b-[2.5rem] shadow-lg mb-6 sticky top-0 z-20">
        <h1 className="text-2xl font-display font-bold text-white mb-2">Jejak Panen</h1>
        <p className="text-emerald-100 text-sm">Pantau perjalanan hasil panen Anda hingga ke tangan konsumen</p>
      </div>

      <div className="px-5 space-y-6">
        {myJejak.map((jejak) => (
          <div key={jejak.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            {/* Header Card */}
            <div className="flex items-start gap-4 mb-6 pb-5 border-b border-gray-100">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                {jejak.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg">{jejak.komoditasNama}</h3>
                <p className="text-xs text-gray-500 mb-2">ID Pickup: {jejak.pickupId}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-medium rounded-lg border border-gray-200">
                    {jejak.beratAwalKg} kg
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-lg border border-emerald-100 flex items-center gap-1">
                    Grade {jejak.gradeAwal}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-4 space-y-6">
              {/* Garis Vertikal Timeline */}
              <div className="absolute top-3 bottom-3 left-[23px] w-0.5 bg-gray-100" />

              {jejak.timeline.map((step, index) => {
                const config = statusConfig[step.status];
                const isCurrent = index === jejak.timeline.length - 1;
                
                return (
                  <div key={index} className="relative flex gap-4">
                    {/* Bullet Info */}
                    <div className="relative z-10 w-3 h-3 mt-1.5 shrink-0 rounded-full bg-white border-2 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${isCurrent ? config.activeColor : 'bg-gray-300'} ring-4 ring-white`} />
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 rounded-2xl p-4 transition-all ${isCurrent ? `${config.bgColor} ${config.borderColor} border shadow-sm` : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <config.icon size={14} className={isCurrent ? config.color : 'text-gray-400'} />
                        <span className={`text-xs font-bold \${isCurrent ? config.color : 'text-gray-600'}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                        <Clock size={10} /> {formatTanggal(step.tanggal.split('T')[0])} • {step.tanggal.split('T')[1].substring(0,5)}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                        <MapPin size={10} className="text-gray-400" /> {step.lokasi}
                      </div>

                      {step.keterangan && (
                        <div className={`mt-2 text-[11px] p-2 rounded-xl ${isCurrent ? 'bg-white/60 text-gray-700' : 'bg-white text-gray-500'}`}>
                          💬 {step.keterangan}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        ))}

        {myJejak.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
            <Leaf size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium pb-1">Belum ada jejak panen</p>
            <p className="text-xs text-gray-400">Jejak akan muncul setelah panen Anda lolos QC.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JejakPanenPage;
