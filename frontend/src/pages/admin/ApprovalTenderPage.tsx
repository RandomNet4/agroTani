// =====================================================
// ADMIN: APPROVAL TENDER PETANI (PARTIAL SUPPLY)
// =====================================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { CheckSquare, Check, X } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatTanggal } from '../../data/adminDummy';

const ApprovalTenderPage: React.FC = () => {
  const { tenderPetani: dummyTenderPetani, tender: dummyTender, petani: dummyPetani, verifyTenderPetani } = useData();
  const [filterStatus, setFilterStatus] = useState('semua');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = filterStatus === 'semua'
    ? dummyTenderPetani
    : dummyTenderPetani.filter(tp => tp.statusApproval === filterStatus);

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingId(id);
    await verifyTenderPetani(id, status);
    setLoadingId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><CheckSquare size={24} /> Approval Tender</h1>
          <p className="text-sm text-gray-500 mt-1">Review & approve pendaftaran tender petani</p>
        </div>
        <div className="bg-amber-50 rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-bold text-amber-700">{dummyTenderPetani.filter(tp => tp.statusApproval === 'pending').length}</p>
          <p className="text-xs text-amber-600">Menunggu</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['semua', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {s === 'semua' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Petani</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tender / Komoditas</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Kesanggupan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tgl Daftar</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tp => {
                const tender = dummyTender.find(t => t.id === tp.tenderId);
                const petani = dummyPetani.find(p => p.id === tp.petaniId);
                const isLoading = loadingId === tp.id;
                return (
                  <tr key={tp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {petani?.fotoProfil && (petani.fotoProfil.startsWith('data:image/') || petani.fotoProfil.startsWith('http') || petani.fotoProfil.includes('.')) ? (
                          <img src={petani.fotoProfil} alt="Foto Profil" className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100" />
                        ) : (
                          <span className="text-xl">{petani?.fotoProfil}</span>
                        )}
                        <span className="font-medium">{tp.petaniNama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{tender?.komoditasNama} — {tender?.periodePanen}</td>
                    <td className="px-4 py-3 font-semibold">{tp.kesanggupanKg.toLocaleString()} kg</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatTanggal(tp.tanggalDaftar)}</td>
                    <td className="px-4 py-3"><StatusBadge status={tp.statusApproval} size="sm" /></td>
                    <td className="px-4 py-3">
                      {tp.statusApproval === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            disabled={isLoading}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                            onClick={() => handleVerify(tp.id, 'approved')}
                            title="Setujui"
                          ><Check size={16} /></button>
                          <button
                            disabled={isLoading}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                            onClick={() => handleVerify(tp.id, 'rejected')}
                            title="Tolak"
                          ><X size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovalTenderPage;
