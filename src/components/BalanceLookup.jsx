// src/components/BalanceLookup.jsx
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useNetwork } from "../context/NetworkContext.jsx";

export default function BalanceLookup({
  onLookupSlot,
  slotValue,
  setSlotValue,
  minSlot,
  maxSlot
}) {
  const { connection } = useNetwork();
  const [addr, setAddr] = useState('');
  const [bal, setBal] = useState(null);
  const [balError, setBalError] = useState('');
  const [lookupError, setLookupError] = useState('');

  async function onCheckBalance() {
    try {
      const pk = new PublicKey(addr);
      const lamports = await connection.getBalance(pk);
      setBal((lamports / 1e9).toFixed(9));
      setBalError('');
    } catch {
      setBal(null);
      setBalError('Invalid address');
    }
  }

  function handleLookup() {
    const s = Number(slotValue);
    if (isNaN(s)) {
      setLookupError('Enter a valid slot number.');
      return;
    }
    if (s < minSlot) {
      setLookupError(`Slot too low (min ${minSlot}).`);
      return;
    }
    if (maxSlot != null && s > maxSlot) {
      setLookupError(`Slot too high (max ${maxSlot}).`);
      return;
    }
    setLookupError('');
    onLookupSlot(s);
  }

  return (
    <div className="balance-lookup">
      <div className="lookup-controls">
        <input
          type="text"
          placeholder="Enter your public key"
          value={addr}
          onChange={e => setAddr(e.target.value)}
          className="input-public-key"
        />
        <button onClick={onCheckBalance} className="run-pause-btn">
          Check balance
        </button>
      </div>
      {balError && <p className="lookup-result">{balError}</p>}
      {bal != null && !balError && (
        <p className="lookup-result">Balance: {bal} SOL</p>
      )}

      <div className="lookup-controls">
        <input
          type="number"
          min={minSlot}
          max={maxSlot}
          placeholder={`Enter slot # (min ${minSlot})`}
          value={slotValue}
          onChange={e => {
            setSlotValue(e.target.value);
            setLookupError('');
          }}
          className="input-public-key"
        />
        <button onClick={handleLookup} className="run-pause-btn">
          Look-up
        </button>
      </div>
      {lookupError && <p className="lookup-result">{lookupError}</p>}
    </div>
  );
}
