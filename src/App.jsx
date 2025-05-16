import { useEffect, useState, useRef } from 'react';
import { connection } from './assets/solana';
import BlockDetails   from './components/BlockDetails.jsx';
import TxTable        from './components/TxTable.jsx';
import BalanceLookup  from './components/BalanceLookup.jsx';
import './App.css';

export default function App() {
  // slot-uri
  const [liveSlot, setLiveSlot]     = useState(null);  // ultima valoare de pe reţea
  const [currentSlot, setCurrentSlot]= useState(null);  // ce afişăm în UI
  
  // bloc + tranzacţii
  const [block, setBlock]      = useState(null);
  const [transactions, setTxs] = useState([]);
  
  // run / pause
  const [running, setRunning]  = useState(true);
  
  // prima limită (devnet prune)
  const [firstSlot, setFirstSlot]= useState(0);
  
  const intervalRef = useRef(null);

  // 1) aflăm primul slot disponibil la mount
  useEffect(() => {
    (async () => {
      try {
        const first = await connection.getFirstAvailableBlock();
        setFirstSlot(first);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // 2) polling permanent pentru liveSlot
  useEffect(() => {
    const tick = async () => {
      try {
        const latest = await connection.getSlot();
        setLiveSlot(latest);
        if (running) {
          // dacă suntem în run, sincronizăm UI  
          setCurrentSlot(latest);
        }
      } catch (err) {
        console.error(err);
      }
    };
    tick();  
    intervalRef.current = setInterval(tick, 250);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  // 3) de fiecare dată când se schimbă currentSlot, aducem block+txs
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
  }, [currentSlot]);

  // săgeţi
  const goPrevious = () => {
    if (running) return;
    if (currentSlot > firstSlot) {
      setCurrentSlot(cs => cs - 1);
    }
  };

  const goNext = () => {
    if (running) return;
    if (liveSlot != null && currentSlot < liveSlot) {
      setCurrentSlot(cs => cs + 1);
    }
  };

  // lookup thru BalanceLookup
  const [searchSlot, setSearchSlot] = useState('');
  const handleLookup = () => {
    const s = Number(searchSlot);
    if (isNaN(s) || s < firstSlot || liveSlot == null || s > liveSlot) return;
    setRunning(false);
    setCurrentSlot(s);
  };

  // for input clamp
  const tip = liveSlot ?? 0;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Solana Explorer</h1>
        <BlockDetails block={block} />

        <div className="balance-run">
          <BalanceLookup
            // balance lookup stays unchanged
            slotValue={searchSlot}
            setSlotValue={setSearchSlot}
            minSlot={firstSlot}
            maxSlot={tip}
            onLookupSlot={handleLookup}
          />

          <button
            title="Go back one slot"
            className="unit-toggle"
            onClick={goPrevious}
            disabled={running || currentSlot <= firstSlot}
          >
            ←
          </button>

          <button
            title="Resume/Pause live displaying of the slots"
            className="unit-toggle"
            onClick={() => setRunning(r => !r)}
          >
            {running ? 'Pause' : 'Resume'}
          </button>

          <button
            title="Go forward one slot"
            className="unit-toggle"
            onClick={goNext}
            disabled={running || currentSlot >= liveSlot}
          >
            →
          </button>
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
