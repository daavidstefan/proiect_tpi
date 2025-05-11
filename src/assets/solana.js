import { Connection } from '@solana/web3.js';

const endpoint = import.meta.env.VITE_RPC_ENDPOINT;
export const connection = new Connection(endpoint, 'confirmed');
