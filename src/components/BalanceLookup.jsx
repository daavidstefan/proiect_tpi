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
      setBal((lam / 1e9).toFixed(9));  // formatăm la 9 zecimale
    } catch {
      setBal('Adresă invalidă');
    }
  }

  return (
    <div className="balance-lookup">
      <div className="lookup-controls">
        <input
          className="input-public-key"
          placeholder="Enter your key"
          value={addr}
          onChange={e => setAddr(e.target.value)}
        />
        <button className="unit-toggle" onClick={onCheck}>
          Check balance
        </button>
      </div>

      {bal !== null && (
        <p className="lookup-result">
          Balanță: {bal} SOL
        </p>
      )}
    </div>
  );
}
