// src/App.jsx
import { useEffect, useState, useRef } from 'react';
import { useNetwork } from './context/NetworkContext.jsx';
import BlockDetails from './components/BlockDetails.jsx';
import TxTable from './components/TxTable.jsx';
import BalanceLookup from './components/BalanceLookup.jsx';
import './App.css';

export default function App() {
  const { connection } = useNetwork();

  const [liveSlot, setLiveSlot] = useState(null);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [block, setBlock] = useState(null);
  const [transactions, setTxs] = useState([]);
  const [running, setRunning] = useState(true);
  const [firstSlot, setFirstSlot] = useState(0);
  const intervalRef = useRef(null);

  // 1) Prima slot disponibil
  useEffect(() => {
    (async () => {
      try {
        const first = await connection.getFirstAvailableBlock();
        setFirstSlot(first);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [connection]);

  // 2) Polling pentru slot curent
  useEffect(() => {
    const tick = async () => {
      try {
        const latest = await connection.getSlot();
        setLiveSlot(latest);
        if (running) setCurrentSlot(latest);
      } catch (err) {
        console.error(err);
      }
    };
    tick();
    intervalRef.current = setInterval(tick, 250);
    return () => clearInterval(intervalRef.current);
  }, [connection, running]);

  // 3) Când se schimbă currentSlot, aducem bloc și tranzacții
  useEffect(() => {
    if (currentSlot == null) return;
    (async () => {
      try {
        const blkRaw = await connection.getBlock(currentSlot, {
          maxSupportedTransactionVersion: 0,
          transactionDetails: 'full',
          rewards: false,
        });
        if (!blkRaw) return;
        setBlock({ ...blkRaw, slot: currentSlot });
        setTxs(blkRaw.transactions);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [connection, currentSlot]);

  // Navigare manuală
  const goPrevious = () => {
    if (!running && currentSlot !== null && currentSlot > firstSlot) {
      setCurrentSlot(prev => prev - 1);
    }
  };
  const goNext = () => {
    if (!running && liveSlot !== null && currentSlot !== null && currentSlot < liveSlot) {
      setCurrentSlot(prev => prev + 1);
    }
  };

  // Lookup pe slot anume
  const [searchSlot, setSearchSlot] = useState('');
  const handleLookup = () => {
    const s = Number(searchSlot);
    if (isNaN(s) || s < firstSlot || (liveSlot !== null && s > liveSlot)) {
      return; // sau afișezi eroare în UI
    }
    setRunning(false);
    setCurrentSlot(s);
  };

  const tip = liveSlot ?? 0;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title text-2xl font-semibold mb-4 text-green-300 text-center font-mono">Solana Explorer</h1>
        <BlockDetails block={block} />

        <div className="balance-run">
          <BalanceLookup
            slotValue={searchSlot}
            setSlotValue={setSearchSlot}
            minSlot={firstSlot}
            maxSlot={tip}
            onLookupSlot={handleLookup}
          />

          <button onClick={goPrevious} className="unit-toggle font-mono" disabled={running || (currentSlot ?? 0) <= firstSlot}> {"<"} </button>
          <button onClick={() => setRunning(r => !r)} className="unit-toggle">
            {running ? 'Pause' : 'Resume'}
          </button>
          <button onClick={goNext} className="unit-toggle font-mono" disabled={running || (currentSlot ?? 0) >= (liveSlot ?? 0)}> {">"} </button>
        </div>
      </header>

      <main className="app-content">
        <div className="table-wrapper">
          <TxTable transactions={transactions} />
        </div>
      </main>
    </div>
  );
}