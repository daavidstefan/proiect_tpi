import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { connection } from '../assets/solana';

export default function BalanceLookup() {
  const [addr, setAddr] = useState('');
  const [bal, setBal]   = useState(null);

  async function onCheck() {
    try {
      const pk = new PublicKey(addr);
      const lam = await connection.getBalance(pk);
      setBal(lam / 1e9);
    } catch {
      setBal('Adresă invalidă');
    }
  }

  return (
    <div className="border p-4 rounded space-y-2">
      <input
        className="border p-1 w-full"
        placeholder="PublicKey Solana"
        value={addr}
        onChange={e => setAddr(e.target.value)}
      />
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={onCheck}
      >
        Verifică balanța
      </button>
      {bal !== null && <p>Balanță: {bal} SOL</p>}
    </div>
  );
}
