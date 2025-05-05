export default function TxTable({ transactions = [] }) {
  // Dacă n-am primit încă array sau e gol
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return <p>Se încarcă tranzacțiile…</p>;
  }

  // Păstrăm doar tx-urile care au semnătură, chei și balanțe
  const validTxs = transactions.filter(tx =>
    tx?.transaction?.signatures?.length > 0 &&
    tx.transaction.message?.accountKeys?.length >= 2 &&
    tx.meta?.preBalances?.length >= 2 &&
    tx.meta?.postBalances?.length >= 2
  );

  if (validTxs.length === 0) {
    return <p>Nu există tranzacții valide de afișat.</p>;
  }

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          <th>Signature</th>
          <th>From</th>
          <th>To</th>
          <th>SOL</th>
          <th>Fee</th>
        </tr>
      </thead>
      <tbody>
        {validTxs.map((txObj, idx) => {
          const { transaction, meta } = txObj;
          // optional chaining & fallback-uri
          const sig = transaction.signatures[0] ?? '—';
          const keys = transaction.message.accountKeys;
          const from = keys[0]?.toBase58?.().slice(0,6) ?? '—';
          const to   = keys[1]?.toBase58?.().slice(0,6) ?? '—';
          const sol  = typeof meta.postBalances[1] === 'number' && typeof meta.preBalances[1] === 'number'
            ? ((meta.postBalances[1] - meta.preBalances[1]) / 1e9).toFixed(9)
            : '0';
          const fee  = meta.fee ?? '—';

          return (
            <tr key={`${sig}-${idx}`} className="border-t">
              <td className="px-2 py-1">{sig.slice(0, 8)}…</td>
              <td className="px-2 py-1">{from}…</td>
              <td className="px-2 py-1">{to}…</td>
              <td className="px-2 py-1">{sol}</td>
              <td className="px-2 py-1">{fee}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
