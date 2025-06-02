'use client';

import { createContext, useContext, useState } from 'react';

type PopupType = 'calendar' | 'weather' | null;

type PopupContextType = {
  openPopup: PopupType;
  setOpenPopup: (popup: PopupType) => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [openPopup, setOpenPopup] = useState<PopupType>(null);

  return (
    <PopupContext.Provider value={{ openPopup, setOpenPopup }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) throw new Error('usePopup must be used within PopupProvider');
  return context;
}
