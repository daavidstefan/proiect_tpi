// src/context/NetworkContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { Connection } from '@solana/web3.js';

export const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const [network, setNetwork] = useState('devnet');

  const endpoints = useMemo(() => ({
    devnet: import.meta.env.VITE_DEVNET_RPC_ENDPOINT,
    mainnet: import.meta.env.VITE_MAINNET_RPC_ENDPOINT,
  }), []);

  const connection = useMemo(
    () => new Connection(endpoints[network]),
    [network, endpoints]
  );

  const toggleNetwork = () =>
    setNetwork(prev => (prev === 'mainnet' ? 'devnet' : 'mainnet'));

  return (
    <NetworkContext.Provider value={{ network, connection, toggleNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used inside NetworkProvider');
  return ctx;
}
