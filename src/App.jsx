import { useEffect, useState } from 'react';
import { connection } from './assets/solana';
import BlockDetails   from './components/BlockDetails.jsx';
import TxTable        from './components/TxTable.jsx';
import BalanceLookup  from './components/BalanceLookup.jsx';
import './App.css';

export default function App() {
  const [slot, setSlot]        = useState(null);
  const [block, setBlock]      = useState(null);
  const [transactions, setTxs] = useState([]);

  // 1) La mount și la fiecare 250ms, ia ultimul slot
  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const latest = await connection.getSlot();
        setSlot(latest);
      } catch (err) {
        console.error('getSlot error:', err);
      }
    };
    fetchSlot();
    const interval = setInterval(fetchSlot, 250);
    return () => clearInterval(interval);
  }, []);

  // 2) De fiecare dată când slot-ul se schimbă, preia blocul și tranzacțiile sale
  useEffect(() => {
    if (slot == null) return;
    const loadBlock = async () => {
      try {
        const blkRaw = await connection.getBlock(slot, {
          maxSupportedTransactionVersion: 0,
          transactionDetails: 'full',
          rewards: false,
        });
        if (!blkRaw) return;
        setBlock({ ...blkRaw, slot });
        setTxs(blkRaw.transactions);
      } catch (err) {
        console.error('loadBlock error:', err);
      }
    };
    loadBlock();
  }, [slot]);

  return (
    <div className="app-container">
      {/* HEADER FIX */}
      <header className="app-header">
        <h1 className="app-title">Solana Explorer</h1>
        <BlockDetails block={block} />
        <BalanceLookup />
      </header>

      {/* MAIN CONTENT: doar TABELUL face scroll */}
      <main className="app-content">
        <div className="table-wrapper">
          <TxTable transactions={transactions} />
        </div>
      </main>
    </div>
  );
}
