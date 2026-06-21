import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users, Map, Sprout, BarChart3, DollarSign, FileText,
  ShoppingCart, Truck, CreditCard, BookOpen,
  ChevronLeft, ChevronRight, LogOut, Leaf, Menu, X, ChevronDown, Scale
} from 'lucide-react';

interface MenuSubItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface MenuGroup {
  label: string;
  icon: React.ReactNode;
  items: MenuSubItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Dashboard',
    icon: <BarChart3 size={20} />,
    items: [
      { path: '/admin/monitoring', label: 'Monitoring Supply', icon: <BarChart3 size={18} /> },
      { path: '/admin/anggaran', label: 'Transparansi Anggaran', icon: <BarChart3 size={18} /> },
    ],
  },
  {
    label: 'Verifikasi & Data',
    icon: <Users size={20} />,
    items: [
      { path: '/admin/verifikasi-petani', label: 'Verifikasi Petani', icon: <Users size={18} /> },
      { path: '/admin/data-lahan', label: 'Data Lahan', icon: <Map size={18} /> },
      { path: '/admin/verifikasi-tanaman', label: 'Verifikasi Tanaman', icon: <Sprout size={18} /> },
    ],
  },
  {
    label: 'Operasional',
    icon: <FileText size={20} />,
    items: [
      { path: '/admin/harga', label: 'Manajemen Harga', icon: <DollarSign size={18} /> },
    ],
  },
  {
    label: 'Logistik & Bayar',
    icon: <ShoppingCart size={20} />,
    items: [
      { path: '/admin/jual-panen', label: 'Pengajuan Jual', icon: <ShoppingCart size={18} /> },
      { path: '/admin/pickup', label: 'Pickup & Armada', icon: <Truck size={18} /> },
      { path: '/admin/qc', label: 'Penimbangan', icon: <Scale size={18} /> },
      { path: '/admin/pembayaran', label: 'Pembayaran', icon: <CreditCard size={18} /> },
      { path: '/admin/po', label: 'Surat Order (PO)', icon: <FileText size={18} /> },
    ],
  },

  {
    label: 'Lainnya',
    icon: <BookOpen size={20} />,
    items: [
      { path: '/admin/edukasi', label: 'Edukasi & Info', icon: <BookOpen size={18} /> },
    ],
  },
];

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Memoize active group based on current path
  useEffect(() => {
    menuGroups.forEach(group => {
      if (group.items.some(item => item.path === location.pathname)) {
        setOpenGroups(prev => ({ ...prev, [group.label]: true }));
      }
    });
  }, [location.pathname]);

  const toggleGroup = (label: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenGroups({ [label]: true });
      return;
    }
    setOpenGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-green-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
            <Leaf className="text-white" size={24} />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display font-bold text-white text-lg leading-tight uppercase tracking-wider">Agro Tani</h1>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Administrator</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        {menuGroups.map((group) => {
          const isOpen = openGroups[group.label];
          const hasActiveItem = group.items.some(item => item.path === location.pathname);

          return (
            <div key={group.label} className="mb-2">
              <button
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  hasActiveItem && !isOpen ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
                title={collapsed ? group.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <div className={`${hasActiveItem ? 'text-white' : 'text-primary-300 group-hover:text-white'} transition-colors`}>
                    {group.icon}
                  </div>
                  {!collapsed && <span className="animate-fade-in">{group.label}</span>}
                </div>
                {!collapsed && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 text-white/30 ${isOpen ? 'rotate-180 text-white' : ''}`} 
                  />
                )}
              </button>

              {!collapsed && isOpen && (
                <div className="mt-1 ml-4 space-y-1 animate-slide-down">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => { navigate(item.path); setMobileOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary-500/30 text-white border-l-2 border-primary-400 pl-2.5' 
                             : 'text-white/50 hover:bg-white/5 hover:text-white pl-3'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-green-700 bg-black/10">
        <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-200 text-sm font-medium transition-all duration-200 group">
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" /> {!collapsed && <span>Keluar</span>}
        </button>
        {!collapsed ? (
          <button onClick={() => setCollapsed(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/30 hover:bg-white/5 text-[10px] mt-1 transition-all uppercase font-bold tracking-widest translate-x-1">
            <ChevronLeft size={16} /> <span>Collapse</span>
          </button>
        ) : (
          <button onClick={() => setCollapsed(false)} className="w-full flex items-center justify-center py-2 rounded-xl text-white/30 hover:bg-white/5 mt-1 transition-all">
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 bg-primary-700 text-white p-3 rounded-2xl shadow-xl border border-white/10 active:scale-95 transition-all">
        <Menu size={20} />
      </button>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full bg-gradient-to-b from-primary-800 to-primary-900 border-r border-white/5 flex flex-col animate-slide-right shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white p-2 bg-white/5 rounded-xl"><X size={20} /></button>
            {sidebarContent}
          </div>
        </div>
      )}
      <aside className={`hidden lg:flex flex-col h-screen bg-gradient-to-b from-primary-800 to-primary-900 sticky top-0 border-r border-white/5 transition-all duration-500 ease-in-out z-50 ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
