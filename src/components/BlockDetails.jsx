export default function BlockDetails({ block }) {
  if (!block) return <p>Se încarcă blocul…</p>;

  const {
    slot,
    blockhash,
    previousBlockhash,
    blockTime,
    transactions
  } = block;

  return (
    <div className="border p-4 rounded bg-gray-800 text-white">
      <h2>Bloc #{slot}</h2>
      <p><strong>Hash:</strong> {blockhash}</p>
      <p><strong>Previous:</strong> {previousBlockhash}</p>
      <p><strong>Time:</strong> {blockTime ? new Date(blockTime * 1000).toLocaleString() : '–'}</p>
      <p><strong>Tx count:</strong> {transactions.length}</p>
    </div>
  );
}
