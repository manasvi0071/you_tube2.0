// context/HMSContext.tsx
import React, { createContext, useContext } from 'react';
import { HMSReactiveStore } from '@100mslive/hms-video-store';

const hms = new HMSReactiveStore();

export const HMSContext = createContext(hms);

export const HMSProvider = ({ children }: { children: React.ReactNode }) => {
  return <HMSContext.Provider value={hms}>{children}</HMSContext.Provider>;
};

export const useHMS = () => useContext(HMSContext);
