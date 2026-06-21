// =====================================================
// ADMIN: MANAJEMEN SURAT ORDER / PURCHASE ORDER (PO)
// =====================================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FileText, Plus, Search,
  Trash2, X, Eye, AlertCircle, Edit, Save, Printer
} from 'lucide-react';
import { formatRupiah, formatTanggal } from '../../data/adminDummy';

interface POItem {
  komoditasNama: string;
  volumeKg: number;
  hargaPerKg: number;
  totalHarga: number;
}

const ManajemenPOPage: React.FC = () => {
  const {
    purchaseOrders,
    komoditas: dummyKomoditas,
    petani: dummyPetani,
    addPurchaseOrder,
    editPurchaseOrder,
    deletePurchaseOrder
  } = useData();

  // State Management
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);

  // Edit PO Fields (inside detail modal)
  const [editStatus, setEditStatus] = useState<'PENDING' | 'PROSES' | 'SELESAI' | 'BATAL'>('PENDING');
  const [editEstimasi, setEditEstimasi] = useState('');

  // Add Form State
  const [formReqId, setFormReqId] = useState('');
  const [formPenerima, setFormPenerima] = useState('');
  const [formCustomPenerima, setFormCustomPenerima] = useState('');
  const [formOperator, setFormOperator] = useState('admin (Admin Gudang)');
  const [formTanggalPengajuan, setFormTanggalPengajuan] = useState(new Date().toISOString().substring(0, 10));
  const [formEstimasiPengantaran, setFormEstimasiPengantaran] = useState(new Date().toISOString().substring(0, 10));
  const [formItems, setFormItems] = useState<POItem[]>([
    { komoditasNama: '', volumeKg: 0, hargaPerKg: 0, totalHarga: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  // Auto-generate REQ ID
  const generateReqId = () => {
    if (purchaseOrders.length === 0) return 'REQ-001';
    const numbers = purchaseOrders
      .map(po => {
        const match = po.nomorReq.match(/REQ-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    const maxNum = Math.max(...numbers, 0);
    return `REQ-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleOpenAddModal = () => {
    setFormReqId(generateReqId());
    setFormPenerima('');
    setFormCustomPenerima('');
    setFormOperator('admin (Admin Gudang)');
    setFormTanggalPengajuan(new Date().toISOString().substring(0, 10));
    setFormEstimasiPengantaran(new Date().toISOString().substring(0, 10));
    setFormItems([{ komoditasNama: '', volumeKg: 0, hargaPerKg: 0, totalHarga: 0 }]);
    setShowAddModal(true);
  };

  // Add item row
  const handleAddItemRow = () => {
    setFormItems([...formItems, { komoditasNama: '', volumeKg: 0, hargaPerKg: 0, totalHarga: 0 }]);
  };

  // Remove item row
  const handleRemoveItemRow = (index: number) => {
    if (formItems.length === 1) return;
    const newItems = formItems.filter((_, i) => i !== index);
    setFormItems(newItems);
  };

  // Handle item change
  const handleItemChange = (index: number, field: keyof POItem, value: any) => {
    const updated = [...formItems];
    if (field === 'komoditasNama') {
      updated[index].komoditasNama = value;
      // Auto-fill price from selected commodity
      const selectedComm = dummyKomoditas.find(k => k.nama === value);
      if (selectedComm) {
        updated[index].hargaPerKg = selectedComm.hargaSaatIni;
      }
    } else if (field === 'volumeKg') {
      updated[index].volumeKg = parseFloat(value) || 0;
    } else if (field === 'hargaPerKg') {
      updated[index].hargaPerKg = parseFloat(value) || 0;
    }
    
    // Calculate total price
    updated[index].totalHarga = updated[index].volumeKg * updated[index].hargaPerKg;
    setFormItems(updated);
  };

  // Save new PO
  const handleSavePO = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPenerima = formPenerima === 'CUSTOM' ? formCustomPenerima : formPenerima;
    if (!finalPenerima) {
      alert('Pilih atau masukkan Penerima Kontrak / Kelompok Tani!');
      return;
    }

    // Validation
    const invalidItem = formItems.some(item => !item.komoditasNama || item.volumeKg <= 0 || item.hargaPerKg <= 0);
    if (invalidItem) {
      alert('Lengkapi detail pesanan komoditas dengan benar (Volume & Harga harus lebih dari 0)!');
      return;
    }

    setLoading(true);
    const newPOId = `PO_${Date.now()}`;
    const success = await addPurchaseOrder({
      id: newPOId,
      nomorReq: formReqId,
      penerimaKontrak: finalPenerima,
      operatorLogistik: formOperator,
      tanggalPengajuan: formTanggalPengajuan,
      estimasiPengantaran: formEstimasiPengantaran,
      status: 'PENDING',
      itemsJson: JSON.stringify(formItems),
    });

    setLoading(false);
    if (success) {
      setShowAddModal(false);
    } else {
      alert('Gagal membuat Purchase Order.');
    }
  };

  // View PO details
  const handleViewPO = (po: any) => {
    setSelectedPO(po);
    setEditStatus(po.status);
    setEditEstimasi(po.estimasiPengantaran);
    setIsEditingMetadata(false);
  };

  // Update PO details (status & estimasi)
  const handleUpdatePO = async () => {
    setLoading(true);
    const success = await editPurchaseOrder(selectedPO.id, {
      status: editStatus,
      estimasiPengantaran: editEstimasi,
    });
    setLoading(false);
    if (success) {
      setSelectedPO({
        ...selectedPO,
        status: editStatus,
        estimasiPengantaran: editEstimasi
      });
      setIsEditingMetadata(false);
    } else {
      alert('Gagal memperbarui status/estimasi PO.');
    }
  };

  // Delete PO
  const handleDeletePO = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus Purchase Order ini?')) {
      const success = await deletePurchaseOrder(id);
      if (success) {
        if (selectedPO && selectedPO.id === id) {
          setSelectedPO(null);
        }
      } else {
        alert('Gagal menghapus PO.');
      }
    }
  };

  // Get color for status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SELESAI':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'PROSES':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'BATAL':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Parse items from JSON safety
  const parseItems = (jsonStr: string): POItem[] => {
    try {
      return JSON.parse(jsonStr) || [];
    } catch (e) {
      return [];
    }
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Filter Purchase Orders
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = 
      po.nomorReq.toLowerCase().includes(search.toLowerCase()) ||
      po.penerimaKontrak.toLowerCase().includes(search.toLowerCase()) ||
      po.operatorLogistik.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === 'ALL' ? true : po.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in print:p-0 print:bg-white">
      {/* Hide controls on printing */}
      <div className="print:hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <FileText size={24} className="text-primary-600" /> Surat Order Gudang (PO)
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manajemen penerimaan pembelian bahan baku dari pihak Gudang Agro Jabar ke kelompok tani
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Plus size={18} /> Buat PO Baru
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari REQ ID, Penerima Kontrak, Operator..."
              className="input-field pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              className="input-field"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">PENDING</option>
              <option value="PROSES">PROSES</option>
              <option value="SELESAI">SELESAI</option>
              <option value="BATAL">BATAL</option>
            </select>
          </div>
          <div className="flex items-center justify-between px-4 py-2 bg-primary-50 rounded-xl border border-primary-100 text-xs font-semibold text-primary-800">
            <span>Total PO: {filteredPOs.length}</span>
            <span>Total Anggaran: {formatRupiah(
              filteredPOs.reduce((acc, po) => {
                const items = parseItems(po.itemsJson);
                return acc + items.reduce((sum, item) => sum + item.totalHarga, 0);
              }, 0)
            )}</span>
          </div>
        </div>

        {/* PO Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                  <th className="text-left px-5 py-4">No. Request</th>
                  <th className="text-left px-5 py-4">Penerima Kontrak / Mitra</th>
                  <th className="text-left px-5 py-4">Tanggal Pengajuan</th>
                  <th className="text-left px-5 py-4">Estimasi Pengantaran</th>
                  <th className="text-right px-5 py-4">Total Komoditas</th>
                  <th className="text-right px-5 py-4">Total Anggaran</th>
                  <th className="text-center px-5 py-4">Status</th>
                  <th className="text-center px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      <AlertCircle className="mx-auto mb-2 text-gray-300" size={32} />
                      Tidak ada data purchase order ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredPOs.map(po => {
                    const items = parseItems(po.itemsJson);
                    const totalQty = items.reduce((sum, i) => sum + i.volumeKg, 0);
                    const totalBudget = items.reduce((sum, i) => sum + i.totalHarga, 0);
                    return (
                      <tr key={po.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-gray-700">{po.nomorReq}</td>
                        <td className="px-5 py-4 font-medium text-gray-900">{po.penerimaKontrak}</td>
                        <td className="px-5 py-4 text-gray-500">{formatTanggal(po.tanggalPengajuan)}</td>
                        <td className="px-5 py-4 text-gray-500">{formatTanggal(po.estimasiPengantaran)}</td>
                        <td className="px-5 py-4 text-right text-gray-700 font-medium">
                          {totalQty.toLocaleString('id-ID')} KG
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-primary-700">
                          {formatRupiah(totalBudget)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(po.status)}`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewPO(po)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Detail & Update PO"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePO(po.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus PO"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================================== MODAL: ADD NEW PO ==================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto print:hidden">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-gray-100 animate-slide-up">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <h3 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="text-primary-600" /> Form Surat Order Bahan Baku Tani
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePO} className="space-y-5">
                {/* Meta Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Nomor Request (REQID)</label>
                    <input
                      type="text"
                      className="input-field font-mono font-bold bg-gray-50"
                      value={formReqId}
                      onChange={e => setFormReqId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label-field">Operator Logistik</label>
                    <input
                      type="text"
                      className="input-field bg-gray-50"
                      value={formOperator}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="label-field">Penerima Kontrak / Kelompok Tani</label>
                    <select
                      className="input-field"
                      value={formPenerima}
                      onChange={e => setFormPenerima(e.target.value)}
                      required
                    >
                      <option value="">Pilih Kelompok Tani / Petani</option>
                      {dummyPetani.map(p => (
                        <option key={p.id} value={`${p.nama} (Mitra Kelompok Tani)`}>
                          {p.nama} - {p.kecamatan}, {p.kabupaten}
                        </option>
                      ))}
                      <option value="Mitra Kelompok Tani Agro Jabar (Lembang/Ciwidey)">
                        Mitra Kelompok Tani Agro Jabar (Lembang/Ciwidey)
                      </option>
                      <option value="CUSTOM">-- Input Manual / Lainnya --</option>
                    </select>
                  </div>
                  <div>
                    {formPenerima === 'CUSTOM' ? (
                      <>
                        <label className="label-field">Nama Kelompok Tani (Manual)</label>
                        <input
                          type="text"
                          placeholder="Masukkan nama Kelompok Tani / Mitra"
                          className="input-field"
                          value={formCustomPenerima}
                          onChange={e => setFormCustomPenerima(e.target.value)}
                          required
                        />
                      </>
                    ) : (
                      <>
                        <label className="label-field">Tanggal Pengajuan</label>
                        <input
                          type="date"
                          className="input-field"
                          value={formTanggalPengajuan}
                          onChange={e => setFormTanggalPengajuan(e.target.value)}
                          required
                        />
                      </>
                    )}
                  </div>
                  {formPenerima === 'CUSTOM' && (
                    <div>
                      <label className="label-field">Tanggal Pengajuan</label>
                      <input
                        type="date"
                        className="input-field"
                        value={formTanggalPengajuan}
                        onChange={e => setFormTanggalPengajuan(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="label-field">Estimasi Pengantaran</label>
                    <input
                      type="date"
                      className="input-field animate-pulse border-primary-300"
                      value={formEstimasiPengantaran}
                      onChange={e => setFormEstimasiPengantaran(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Commodity Items */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-semibold text-gray-800 text-sm">
                      Detail Pesanan Komoditas
                    </span>
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-2.5 py-1.5 rounded-lg border border-primary-100"
                    >
                      <Plus size={14} /> Tambah Komoditas
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {formItems.map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-gray-50/70 rounded-2xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                          {idx + 1}
                        </div>
                        <div className="flex-1 w-full">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-0.5">Komoditas</label>
                          <select
                            className="input-field py-2"
                            value={item.komoditasNama}
                            onChange={e => handleItemChange(idx, 'komoditasNama', e.target.value)}
                            required
                          >
                            <option value="">Pilih Komoditas</option>
                            {dummyKomoditas.map(k => (
                              <option key={k.id} value={k.nama}>
                                {k.gambar} {k.nama} ({formatRupiah(k.hargaSaatIni)}/kg)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-full md:w-32">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-0.5">Volume (KG)</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="KG"
                            className="input-field py-2"
                            value={item.volumeKg || ''}
                            onChange={e => handleItemChange(idx, 'volumeKg', e.target.value)}
                            required
                          />
                        </div>
                        <div className="w-full md:w-40">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-0.5">Harga / KG (Rp)</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Rp"
                            className="input-field py-2"
                            value={item.hargaPerKg || ''}
                            onChange={e => handleItemChange(idx, 'hargaPerKg', e.target.value)}
                            required
                          />
                        </div>
                        <div className="w-full md:w-44 text-right">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-0.5">Total Harga</label>
                          <span className="font-bold text-gray-900 block py-2 pr-2 text-sm">
                            {formatRupiah(item.totalHarga)}
                          </span>
                        </div>
                        {formItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl transition-colors md:mt-4"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-4 flex justify-end">
                    <div className="bg-slate-50 rounded-2xl px-5 py-3 border border-slate-100 flex gap-6 items-center">
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Total Volume</span>
                        <span className="font-bold text-gray-800 text-sm">
                          {formItems.reduce((acc, i) => acc + i.volumeKg, 0).toLocaleString('id-ID')} KG
                        </span>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Total Estimasi Anggaran</span>
                        <span className="font-bold text-primary-700 text-lg">
                          {formatRupiah(formItems.reduce((acc, i) => acc + i.totalHarga, 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Surat Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* ==================================== MODAL: DETAIL PO VIEW ==================================== */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 overflow-y-auto print:absolute print:inset-0 print:z-auto print:bg-white print:overflow-visible">
          <div className="flex items-center justify-center min-h-screen p-4 print:p-0">
            {/* Backdrop (hidden in print) */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden"
              onClick={() => setSelectedPO(null)}
            />

            {/* Document Paper Container */}
            <div className="relative bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-gray-100 print:shadow-none print:border-none print:p-0 print:w-full animate-slide-up">
              
              {/* Controls bar (hidden in print) */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 print:hidden">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Printer size={14} /> Cetak PO
                  </button>
                  <button
                    onClick={() => setIsEditingMetadata(!isEditingMetadata)}
                    className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Edit size={14} /> {isEditingMetadata ? 'Selesai Edit' : 'Edit Status / Estimasi'}
                  </button>
                </div>
                <button
                  onClick={() => setSelectedPO(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Inline Edit Panel (hidden in print) */}
              {isEditingMetadata && (
                <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-4 mb-6 print:hidden space-y-4">
                  <h4 className="font-semibold text-primary-800 text-sm flex items-center gap-1">
                    <Edit size={16} /> Perbarui Estimasi & Status Dokumen
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Status Dokumen</label>
                      <select
                        className="input-field py-2"
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as any)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROSES">PROSES</option>
                        <option value="SELESAI">SELESAI</option>
                        <option value="BATAL">BATAL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Estimasi Pengantaran</label>
                      <input
                        type="date"
                        className="input-field py-2"
                        value={editEstimasi}
                        onChange={e => setEditEstimasi(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setIsEditingMetadata(false)}
                      className="px-4 py-2 rounded-xl text-xs bg-white text-gray-600 border border-gray-200"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleUpdatePO}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl text-xs bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Save size={14} /> Simpan Perubahan
                    </button>
                  </div>
                </div>
              )}

              {/* High-Fidelity Letter Content (matches print) */}
              <div className="border border-slate-200/50 p-6 md:p-8 rounded-2xl bg-white shadow-sm print:border-none print:p-0 print:shadow-none">
                {/* Header (Logo + Company Info + Title) */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start pb-6 border-b border-gray-300 gap-4">
                  <div>
                    <h2 className="font-display font-extrabold text-slate-800 text-xl tracking-tight">
                      PT AGRO JABAR (PERSERODA)
                    </h2>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                      Divisi Produksi Makanan Beku & Logistik Bahan Baku
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bandung Raya Unit Gudang Utama, Jawa Barat
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Email: <span className="underline">procurement.gudang@agrojabar.co.id</span>
                    </p>
                  </div>
                  <div className="text-left md:text-right flex flex-col md:items-end">
                    <h1 className="font-display font-black text-slate-900 text-md tracking-tight leading-none uppercase">
                      Surat Order Bahan Baku Tani
                    </h1>
                    <div className="mt-3 bg-slate-900 text-emerald-400 font-mono text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1">
                      <span>REQID:</span>
                      <span className="tracking-widest">{selectedPO.nomorReq}</span>
                    </div>
                  </div>
                </div>

                {/* Metadata Fields Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 py-6 gap-6 text-sm border-b border-dashed border-slate-200">
                  {/* Left Column (Contract Partner) */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        PENERIMA KONTRAK / KELOMPOK TANI:
                      </span>
                      <span className="block font-bold text-slate-800 text-md mt-1 leading-snug">
                        {selectedPO.penerimaKontrak}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">
                        Operator Logistik:{' '}
                        <span className="font-semibold text-slate-700">{selectedPO.operatorLogistik}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column (Dates and Status) */}
                  <div className="md:col-span-5 md:text-right space-y-2">
                    <div className="flex md:justify-end gap-2 text-xs text-slate-500">
                      <span className="w-36 text-left md:text-right">Tanggal Pengajuan:</span>
                      <span className="font-bold text-slate-700">{formatTanggal(selectedPO.tanggalPengajuan)}</span>
                    </div>
                    <div className="flex md:justify-end gap-2 text-xs text-slate-500">
                      <span className="w-36 text-left md:text-right">Estimasi Pengantaran:</span>
                      <span className="font-bold text-slate-700">{formatTanggal(selectedPO.estimasiPengantaran)}</span>
                    </div>
                    <div className="flex md:justify-end gap-2 text-xs text-slate-500 items-center">
                      <span className="w-36 text-left md:text-right">Status Dokumen:</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${getStatusBadge(selectedPO.status)}`}>
                        {selectedPO.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Commodity List Section */}
                <div className="pt-6">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    DETAIL PESANAN KOMODITAS:
                  </span>

                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                          <th className="px-4 py-3 text-center w-12">NO</th>
                          <th className="px-4 py-3 text-left">NAMA KOMODITAS / SPESIFIKASI</th>
                          <th className="px-4 py-3 text-center w-36">VOLUME KEBUTUHAN (KG)</th>
                          <th className="px-4 py-3 text-right w-36">HARGA/KG</th>
                          <th className="px-4 py-3 text-right w-40">TOTAL HARGA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseItems(selectedPO.itemsJson).map((item, index) => (
                          <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/20 text-slate-800">
                            <td className="px-4 py-3.5 text-center font-bold text-slate-400">{index + 1}</td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">{item.komoditasNama}</td>
                            <td className="px-4 py-3.5 text-center font-semibold text-slate-700">
                              {item.volumeKg.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-3.5 text-right font-medium text-slate-600">
                              {formatRupiah(item.hargaPerKg)}
                            </td>
                            <td className="px-4 py-3.5 text-right font-black text-slate-900">
                              {formatRupiah(item.totalHarga)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Totals */}
                  <div className="mt-4 flex justify-end">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-right text-xs">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider">Total Volume:</span>
                      <span className="font-bold text-slate-800">
                        {parseItems(selectedPO.itemsJson)
                          .reduce((sum, item) => sum + item.volumeKg, 0)
                          .toLocaleString('id-ID')}{' '}
                        KG
                      </span>
                      <span className="text-slate-400 font-semibold uppercase tracking-wider">Total Nilai Kontrak:</span>
                      <span className="font-black text-primary-700 text-sm">
                        {formatRupiah(
                          parseItems(selectedPO.itemsJson).reduce((sum, item) => sum + item.totalHarga, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div className="grid grid-cols-2 mt-12 pt-8 border-t border-slate-100 text-xs text-center text-slate-500">
                  <div>
                    <p className="font-bold text-slate-700 mb-16">Penerima Kontrak / Mitra Tani</p>
                    <div className="w-32 h-px bg-slate-300 mx-auto" />
                    <p className="mt-1 text-[10px]">( Tanda Tangan & Cap )</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 mb-16">Operator Logistik Gudang</p>
                    <div className="w-32 h-px bg-slate-300 mx-auto" />
                    <p className="mt-1 text-[10px]">{selectedPO.operatorLogistik}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenPOPage;
