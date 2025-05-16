// TxTable.jsx
import React, { useState } from 'react';
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  StakeProgram,
  VoteProgram
} from '@solana/web3.js';

export default function TxTable({ transactions = [] }) {
  const [showSOLFee, setShowSOLFee] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState(null);

  const typeOptions = ['ALL', 'Transfer', 'Create Account', 'Staking', 'Voting'];

  // filtrează doar tx-urile valide
  const validTxs = Array.isArray(transactions)
    ? transactions.filter(tx =>
        tx?.transaction?.signatures?.length > 0 &&
        tx.transaction.message?.accountKeys?.length >= 2 &&
        tx.meta?.preBalances?.length >= 2 &&
        tx.meta?.postBalances?.length >= 2
      )
    : [];

  // procesează fiecare tx pentru coloane
  const processedTxs = validTxs.map(txObj => {
    const { transaction, meta } = txObj;
    const sig = transaction.signatures[0] || '—';
    const keys = transaction.message.accountKeys.map(k => k.toBase58());
    const fromFull = keys[0];
    const toFull = keys[1];
    const solDelta = (meta.postBalances[1] - meta.preBalances[1]) / LAMPORTS_PER_SOL;
    const solAmount = solDelta.toFixed(9);
    const feeValue = meta.fee;

    let typeLabel = 'Unknown';
    // încearcă să extragă tipul direct din parsed.type
    transaction.message.instructions.forEach(inst => {
      if (inst.parsed && inst.parsed.type) {
        typeLabel = inst.parsed.type
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, s => s.toUpperCase());
      }
    });
    // fallback-uri speciale
    if (typeLabel === 'Unknown' &&
        transaction.message.instructions.some(inst => inst.programIdIndex != null &&
          transaction.message.accountKeys[inst.programIdIndex].equals(StakeProgram.programId)
        )
    ) typeLabel = 'Staking';
    if (typeLabel === 'Unknown' &&
        transaction.message.instructions.some(inst => inst.programIdIndex != null &&
          transaction.message.accountKeys[inst.programIdIndex].equals(VoteProgram.programId)
        )
    ) typeLabel = 'Voting';
    if (typeLabel === 'Unknown' && solDelta > 0) {
      typeLabel = 'Transfer';
    }
    if (typeLabel === 'Unknown' &&
        transaction.message.instructions.some(inst => inst.programIdIndex != null &&
          transaction.message.accountKeys[inst.programIdIndex].equals(SystemProgram.programId)
        )
    ) typeLabel = 'Create Account';

    return { sig, fromFull, toFull, solAmount, feeValue, typeLabel, raw: txObj };
  });

  // aplică filtrul ales
  const displayedTxs =
    filterType === 'ALL'
      ? processedTxs
      : processedTxs.filter(tx => tx.typeLabel === filterType);

  // funcţie care ciclă prin opţiuni
  const cycleFilter = () => {
    const cur = typeOptions.indexOf(filterType);
    const next = (cur + 1) % typeOptions.length;
    setFilterType(typeOptions[next]);
  };

  return (
    <>
      <div className="table-wrapper card" style={{ overflow: 'visible', position: 'relative' }}>
        <table>
          <thead>
            <tr>
              <th className="col-type" style={{ position: 'relative', overflow: 'visible' }}>
                TYPE&nbsp;
                <button
                  className="run-pause-btn"
                  onClick={cycleFilter}
                  title="Click to cycle through types"
                  style={{ position: 'relative', zIndex: 1000 }}
                >
                  {filterType}
                </button>
              </th>
              <th className="col-signature">Signature</th>
              <th className="col-from">From</th>
              <th className="col-to">To</th>
              <th className="col-amount">SOL</th>
              <th className="col-fee" style={{ position: 'relative', overflow: 'visible' }}>
                FEE&nbsp;
                <button
                  className="run-pause-btn"
                  onClick={() => setShowSOLFee(!showSOLFee)}
                  style={{ position: 'relative', zIndex: 1000 }}
                  title="Display the fee in SOL/Lamports"
                >
                  {showSOLFee ? 'SOL' : 'Lamports'}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedTxs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
                  Nu există tranzacții de afișat.
                </td>
              </tr>
            ) : (
              displayedTxs.map((tx, idx) => (
                <tr
                  key={`${tx.sig}-${idx}`}
                  className="clickable-row"
                  onClick={() => setSelectedTx(tx)}
                >
                  <td className="col-type">{tx.typeLabel}</td>
                  <td className="col-signature">{tx.sig.slice(0, 8)}…</td>
                  <td className="col-from">{tx.fromFull.slice(0, 8)}…</td>
                  <td className="col-to">{tx.toFull.slice(0, 8)}…</td>
                  <td className="col-amount">{tx.solAmount}</td>
                  <td className="col-fee">
                    {showSOLFee
                      ? (tx.feeValue / LAMPORTS_PER_SOL).toFixed(9)
                      : tx.feeValue.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Transaction Details</h3>
            <div className="tx-details">
              <p><strong>Type:</strong> {selectedTx.typeLabel}</p>
              <p><strong>Signature:</strong> {selectedTx.sig}</p>
              <p><strong>From:</strong> {selectedTx.fromFull}</p>
              <p><strong>To:</strong> {selectedTx.toFull}</p>
              <p><strong>SOL Mutat:</strong> {selectedTx.solAmount}</p>
              <p>
                <strong>Fee:</strong>{' '}
                {showSOLFee
                  ? `${(selectedTx.feeValue / LAMPORTS_PER_SOL).toFixed(9)} SOL`
                  : `${selectedTx.feeValue.toLocaleString()} lamports`}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {selectedTx.raw.meta.err ? 'Failed' : 'Success'}
              </p>
              <p>
                <strong>Compute Units:</strong>{' '}
                {selectedTx.raw.meta.computeUnitsConsumed}/200000
              </p>
            </div>
            <button className="modal-close" onClick={() => setSelectedTx(null)}>
              Închide
            </button>
          </div>
        </div>
      )}
    </>
  );
}
