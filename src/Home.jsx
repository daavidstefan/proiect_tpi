// src/Home.jsx
import React, { useEffect, useState } from 'react'
import { Connection, clusterApiUrl } from '@solana/web3.js'

export default function Home() {
  const [validators, setValidators] = useState(null)  // null = încă nu am date
  const [error, setError]         = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        // Conectare la Devnet
        const conn = new Connection(clusterApiUrl('devnet'))
        // Aducem validatorii
        const { current, delinquent } = await conn.getVoteAccounts()
        console.log('Devnet validators:', current.length, delinquent.length)
        setValidators([...current, ...delinquent])
      } catch (e) {
        console.error('Fetch error:', e)
        setError(e.message || 'Unknown error')
      }
    })()
  }, [])

  // Când încă nu avem răspuns
  if (validators === null && error === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-green-300">
        <p>Loading validators…</p>
      </div>
    )
  }

  // Dacă a dat eroare
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <p>Error loading validators: {error}</p>
      </div>
    )
  }

  // Dacă nicio eroare și avem listă (chiar și goală)
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-green-300">
        Validators on Devnet
      </h2>

      {validators.length === 0 ? (
        <p>No validators found on Devnet at the moment.</p>
      ) : (
        <table className="w-full bg-gray-800 rounded overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Identity</th>
              <th className="px-4 py-2 text-left">Vote Key</th>
              <th className="px-4 py-2 text-center">Commission</th>
              <th className="px-4 py-2 text-right">Stake (SOL)</th>
            </tr>
          </thead>
          <tbody>
            {validators.map((v, i) => {
              const stake = (v.activatedStake / 1e9).toFixed(2)
              return (
                <tr key={v.votePubkey} className={i % 2 ? 'bg-gray-700' : 'bg-gray-800'}>
                  <td className="px-4 py-2 font-mono text-sm">
                    {v.identityPubkey}
                  </td>
                  <td className="px-4 py-2 font-mono text-sm">
                    {v.votePubkey}
                  </td>
                  <td className="px-4 py-2 text-center">{v.commission}%</td>
                  <td className="px-4 py-2 text-right">{stake}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
