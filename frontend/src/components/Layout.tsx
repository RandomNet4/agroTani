// =====================================================
// LAYOUT WRAPPER - AGRO TANI (PETANI ONLY)
// =====================================================

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

// Layout untuk App Petani (mobile-first, bottom navigation)
export const PetaniLayout: React.FC = () => {
  const location = useLocation();
  const hideNavPaths = [
    '/petani/jual-panen/form',
    '/petani/edit-profile',
    '/petani/alamat',
    '/petani/mengenai'
  ];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      <main className={shouldHideNav ? '' : 'pb-20'}>
        <Outlet />
      </main>
      {!shouldHideNav && <BottomNav />}
    </div>
  );
};
