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
    <div className="block-details card">
      <h2 className="block-title">Bloc #{slot}</h2>
      <div className="block-info">
        <div className="block-info-item">
          <span className="block-label">Hash:</span>
          <span className="block-value">{blockhash}</span>
        </div>
        <div className="block-info-item">
          <span className="block-label">Previous:</span>
          <span className="block-value">{previousBlockhash}</span>
        </div>
        <div className="block-info-item">
          <span className="block-label">Time:</span>
          <span className="block-value">
            {blockTime
              ? new Date(blockTime * 1000).toLocaleString()
              : '–'}
          </span>
        </div>
        <div className="block-info-item">
          <span className="block-label">Tx count:</span>
          <span className="block-value">{transactions.length}</span>
        </div>
      </div>
    </div>
  );
}
