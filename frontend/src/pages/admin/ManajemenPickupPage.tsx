// =====================================================
// ADMIN: MANAJEMEN PICKUP, ARMADA & TRACKING
// =====================================================

import React, { useState } from 'react';
import { Truck, Plus, MapPin, Phone, Save, Camera, User } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { useData } from '../../context/DataContext';
import { formatTanggal } from '../../data/adminDummy';

const ManajemenPickupPage: React.FC = () => {
  const { pickup: dummyPickup, pengajuanJual: dummyPengajuanJual, schedulePickup, updatePickupStatus } = useData();
  const [showAssign, setShowAssign] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pengajuanJualId: '',
    tanggalPickup: '',
    driverNama: '',
    driverNoHp: '',
    armada: '',
    platNomor: '',
  });

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [beratTimbang, setBeratTimbang] = useState('');
  const [submittingSelesai, setSubmittingSelesai] = useState(false);

  const handleAdminSelesai = async (pkpId: string) => {
    if (!beratTimbang || isNaN(Number(beratTimbang)) || Number(beratTimbang) <= 0) {
      alert('Masukkan berat timbang yang valid!');
      return;
    }
    setSubmittingSelesai(true);
    try {
      const success = await updatePickupStatus(pkpId, {
        status: 'selesai',
        beratTimbangKg: Number(beratTimbang),
        waktuSelesai: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      });
      if (success) {
        setConfirmingId(null);
        setBeratTimbang('');
      } else {
        alert('Gagal memperbarui status pickup.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
    } finally {
      setSubmittingSelesai(false);
    }
  };

  // Only show approved pengajuan that don't have pickup yet and have weight >= 300kg
  const pengajuanSiapPickup = dummyPengajuanJual.filter(
    pj => pj.status === 'approved' && pj.beratEstimasiKg >= 300 && !dummyPickup.some(pk => pk.pengajuanJualId === pj.id)
  );

  const handleSimpan = async () => {
    if (!form.pengajuanJualId || !form.tanggalPickup || !form.driverNama) return alert('Lengkapi form!');
    const pengajuan = dummyPengajuanJual.find(pj => pj.id === form.pengajuanJualId);
    if (!pengajuan) return;
    setLoading(true);
    const id = `PKP_${Date.now()}`;
    const success = await schedulePickup({
      id,
      pengajuanJualId: form.pengajuanJualId,
      petaniId: pengajuan.petaniId,
      petaniNama: pengajuan.petaniNama,
      komoditasNama: pengajuan.komoditasNama,
      alamatPickup: pengajuan.lahanNama || '-',
      tanggalPickup: form.tanggalPickup,
      driverNama: form.driverNama,
      driverNoHp: form.driverNoHp,
      armada: form.armada,
      platNomor: form.platNomor,
      status: 'dijadwalkan',
    });
    setLoading(false);
    if (success) {
      setShowAssign(false);
      setForm({ pengajuanJualId: '', tanggalPickup: '', driverNama: '', driverNoHp: '', armada: '', platNomor: '' });
    } else {
      alert('Gagal menjadwalkan pickup.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Truck size={24} /> Pickup & Armada</h1>
          <p className="text-sm text-gray-500 mt-1">Jadwalkan dan pantau pengambilan hasil panen (Pengajuan &lt; 300kg otomatis dialihkan ke Pengantaran Mandiri)</p>
        </div>
        <button onClick={() => setShowAssign(!showAssign)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Jadwalkan Pickup
        </button>
      </div>

      {showAssign && (
        <div className="card mb-4 border-2 border-primary-200 animate-slide-up">
          <h3 className="section-title mb-4">Jadwalkan Pickup Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Pengajuan Jual (Approved)</label>
              <select className="input-field" value={form.pengajuanJualId} onChange={e => setForm({...form, pengajuanJualId: e.target.value})}>
                <option value="">Pilih pengajuan</option>
                {pengajuanSiapPickup.map(pj => (
                  <option key={pj.id} value={pj.id}>{pj.petaniNama} — {pj.komoditasNama} {pj.beratEstimasiKg.toLocaleString()}kg</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Tanggal Pickup</label>
              <input type="date" className="input-field" value={form.tanggalPickup} onChange={e => setForm({...form, tanggalPickup: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Driver</label>
              <input type="text" placeholder="Nama driver" className="input-field" value={form.driverNama} onChange={e => setForm({...form, driverNama: e.target.value})} />
            </div>
            <div>
              <label className="label-field">No. HP Driver</label>
              <input type="tel" placeholder="08xxxxxxx" className="input-field" value={form.driverNoHp} onChange={e => setForm({...form, driverNoHp: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Armada</label>
              <input type="text" placeholder="Mis: Pickup L300" className="input-field" value={form.armada} onChange={e => setForm({...form, armada: e.target.value})} />
            </div>
            <div>
              <label className="label-field">Plat Nomor</label>
              <input type="text" placeholder="D 1234 AB" className="input-field" value={form.platNomor} onChange={e => setForm({...form, platNomor: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAssign(false)} className="btn-secondary text-sm">Batal</button>
            <button onClick={handleSimpan} disabled={loading} className="btn-primary text-sm flex items-center gap-1 disabled:opacity-50">
              <Save size={14} /> {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      )}

      {/* Pickup List */}
      <div className="space-y-4">
        {dummyPickup.map(pkp => (
          <div key={pkp.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{pkp.komoditasNama}</span>
                  <StatusBadge status={pkp.status} size="sm" />
                </div>
                <p className="text-sm text-gray-600">{pkp.petaniNama}</p>
              </div>
              <p className="text-xs text-gray-500">{formatTanggal(pkp.tanggalPickup)}</p>
            </div>

            {pkp.armada === 'Pengantaran Mandiri' ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 md:col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-teal-600 font-bold uppercase tracking-wider">Metode Pengiriman</p>
                    <p className="font-bold text-sm text-teal-800">Pengantaran Mandiri oleh Petani</p>
                    <p className="text-[10px] text-teal-500 font-medium">Bypass penjemputan armada Agro</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> Tujuan Gudang</p>
                  <p className="font-medium text-xs">{pkp.alamatPickup}</p>
                </div>
                {pkp.beratTimbangKg ? (
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-emerald-600">Berat Timbang</p>
                    <p className="font-bold text-lg text-emerald-700">{pkp.beratTimbangKg.toLocaleString()} kg</p>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-xl p-3 flex items-center justify-center">
                    <p className="text-xs text-amber-700 font-semibold animate-pulse text-center">Menunggu Kedatangan Petani</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Truck size={12} /> Armada</p>
                  <p className="font-medium text-sm">{pkp.armada}</p>
                  <p className="text-xs text-gray-400">{pkp.platNomor}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12} /> Driver</p>
                  <p className="font-medium text-sm">{pkp.driverNama}</p>
                  <p className="text-xs text-gray-400">{pkp.driverNoHp}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> Lokasi</p>
                  <p className="font-medium text-xs">{pkp.alamatPickup}</p>
                </div>
                {pkp.beratTimbangKg && (
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-emerald-600">Berat Timbang</p>
                    <p className="font-bold text-lg text-emerald-700">{pkp.beratTimbangKg.toLocaleString()} kg</p>
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {pkp.waktuBerangkat && <span>🚀 Berangkat: {pkp.waktuBerangkat}</span>}
              {pkp.waktuTiba && <span>• 📍 Tiba: {pkp.waktuTiba}</span>}
              {pkp.waktuSelesai && <span>• ✅ Selesai: {pkp.waktuSelesai}</span>}
            </div>

            {/* Driver Upload Section */}
            {pkp.status !== 'selesai' && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex gap-2">
                  <button className="btn-secondary text-xs py-1.5 flex items-center gap-1"><Camera size={12} /> Foto Timbang</button>
                  <button className="btn-secondary text-xs py-1.5 flex items-center gap-1"><Camera size={12} /> Foto Panen</button>
                  <button className="btn-secondary text-xs py-1.5 flex items-center gap-1"><MapPin size={12} /> Update GPS</button>
                </div>
                
                {confirmingId === pkp.id ? (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-end gap-2 animate-fade-in">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Berat Timbang Aktual (kg)</label>
                      <input 
                        type="number"
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                        placeholder="Masukkan berat"
                        value={beratTimbang}
                        onChange={(e) => setBeratTimbang(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => handleAdminSelesai(pkp.id)}
                      disabled={submittingSelesai}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {submittingSelesai ? 'Proses...' : 'Simpan'}
                    </button>
                    <button 
                      onClick={() => setConfirmingId(null)}
                      className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setConfirmingId(pkp.id);
                      setBeratTimbang('');
                    }}
                    className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Konfirmasi Selesai Pickup & Timbang
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManajemenPickupPage;
