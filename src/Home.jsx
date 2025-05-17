// src/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNetwork } from './context/NetworkContext.jsx';

export default function Home() {
  const { connection, network } = useNetwork();
  const [validators, setValidators] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { current, delinquent } = await connection.getVoteAccounts();
        if (!mounted) return;
        setValidators([...current, ...delinquent]);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Error fetching validators');
      }
    })();
    return () => { mounted = false };
  }, [connection]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
      <p>Error loading validators: {error}</p>
    </div>
  );
  if (!validators.length) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-green-300">
      <p>Loading validators…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-green-300">
        Validators on {network.charAt(0).toUpperCase() + network.slice(1)}
      </h2>

      <div className="table-wrapper card">
        <table>
          <thead>
            <tr>
              <th>Vote Pubkey</th>
              <th>Commission</th>
              <th>Active Stake</th>
            </tr>
          </thead>
          <tbody>
            {validators.map(v => (
              <tr key={v.votePubkey} className="clickable-row">
                <td>{v.votePubkey}</td>
                <td>{v.commission}%</td>
                <td>{(v.activatedStake / 1e9).toLocaleString()} SOL</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
