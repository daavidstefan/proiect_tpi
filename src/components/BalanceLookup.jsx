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
  const [addr, setAddr]         = useState('');
  const [bal, setBal]           = useState(null);
  const [balError, setBalError] = useState('');
  const [lookupError, setLookupError] = useState('');

  // check wallet balance
  async function onCheck() {
    try {
      const pk  = new PublicKey(addr);
      const lam = await connection.getBalance(pk);
      const sol = (lam / 1e9).toFixed(9);
      setBal(sol);
      setBalError('');
    } catch {
      setBal(null);
      setBalError('Invalid address');
    }
  }

  // slot‐number lookup with error messages
  function handleLookup() {
    const s = Number(slotValue);
    if (slotValue === '' || isNaN(s)) {
      setLookupError('Enter a valid slot number.');
      return;
    }
    if (s < 0 || s > maxSlot) {
      setLookupError('No number belongs to that slot.');
      return;
    }
    if (s < minSlot) {
      setLookupError('No data stored for that slot.');
      return;
    }
    setLookupError('');
    onLookupSlot();
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
        <button className="run-pause-btn" onClick={onCheck}>
          Check balance
        </button>
      </div>

      {balError ? (
        <p className="lookup-result">{balError}</p>
      ) : bal !== null ? (
        <p className="lookup-result">Balance: {bal} SOL</p>
      ) : null}

      {/* slot‐number lookup only */}
      <div className="lookup-controls">
        <input
          className="input-public-key"
          type="text"
          min={0}
          max={maxSlot}
          placeholder={`Enter slot # (min. ${minSlot})`}
          value={slotValue}
          onChange={e => {
            setSlotValue(e.target.value);
            setLookupError('');
          }}
        />
        <button className="run-pause-btn" onClick={handleLookup}>
          Look-up
        </button>
      </div>

      {lookupError && (
        <p className="lookup-result">{lookupError}</p>
      )}
    </div>
  );
}
