// src/components/BalanceLookup.jsx
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { connection } from '../assets/solana';

export default function BalanceLookup({
  onLookupSlot,
  slotValue,
  setSlotValue,
  minSlot,
  maxSlot
}) {
  const [addr, setAddr] = useState('');
  const [bal, setBal]   = useState(null);

  // Check balance handler
  async function onCheck() {
    try {
      const pk  = new PublicKey(addr);
      const lam = await connection.getBalance(pk);
      setBal((lam / 1e9).toFixed(9));
    } catch {
      setBal('Adresă invalidă');
    }
  }

  return (
    <div className="balance-lookup">
      {/* existing balance lookup */}
      <div className="lookup-controls">
        <input
          className="input-public-key"
          placeholder="Enter your key"
          value={addr}
          onChange={e => setAddr(e.target.value)}
        />
        <button
          className="unit-toggle"
          onClick={onCheck}
        >
          Check balance
        </button>
      </div>

      {bal !== null && (
        <p className="lookup-result">
          Balanță: {bal} SOL
        </p>
      )}

      {/* slot lookup, reusing same classes */}
      <div className="lookup-controls">
        <input
          className="input-public-key"
          min={minSlot}
          max={maxSlot}
          placeholder={`Enter slot # (min. ${minSlot})`}
          value={slotValue}
          onChange={e => setSlotValue(e.target.value)}
        />
        <button
          className="unit-toggle"
          onClick={onLookupSlot}
          disabled={
            slotValue === '' ||
            Number(slotValue) < minSlot ||
            Number(slotValue) > maxSlot
          }
        >
          Look-up
        </button>
      </div>
    </div>
  );
}
