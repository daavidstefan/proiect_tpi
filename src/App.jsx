import { useEffect, useState, useRef } from 'react';
import { connection } from './assets/solana';
import BlockDetails   from './components/BlockDetails.jsx';
import TxTable        from './components/TxTable.jsx';
import BalanceLookup  from './components/BalanceLookup.jsx';
import './App.css';

export default function App() {
  const [history, setHistory]           = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [block, setBlock]               = useState(null);
  const [transactions, setTxs]          = useState([]);
  const [running, setRunning]           = useState(true);
  const [searchSlot, setSearchSlot]     = useState('');
  const [firstSlot, setFirstSlot]       = useState(0);       // <-- nou

  const intervalRef = useRef(null);
  const runningRef  = useRef(running);

  useEffect(() => { runningRef.current = running; }, [running]);

  // 1) la mount, aflăm primul slot disponibil
  useEffect(() => {
    (async () => {
      try {
        const first = await connection.getFirstAvailableBlock();
        setFirstSlot(first);
      } catch (err) {
        console.error('getFirstAvailableBlock error:', err);
      }
    })();
  }, []);

  // 2) polling permanent pentru istoric
  useEffect(() => {
    const tick = async () => {
      try {
        const latest = await connection.getSlot();
        setHistory(prev => {
          if (prev[prev.length - 1] !== latest) {
            const next = [...prev, latest];
            if (runningRef.current) {
              setCurrentIndex(next.length - 1);
            }
            return next;
          }
          return prev;
        });
      } catch (err) {
        console.error('getSlot error:', err);
      }
    };
    tick();
    intervalRef.current = setInterval(tick, 250);
    return () => clearInterval(intervalRef.current);
  }, []);

  // 3) când unpause, sărim la vârful istoriei
  useEffect(() => {
    if (running && history.length > 0) {
      setCurrentIndex(history.length - 1);
    }
  }, [running, history]);

  // 4) fetch block+txs la schimbarea currentIndex
  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= history.length) return;
    const slotNum = history[currentIndex];
    (async () => {
      try {
        const blkRaw = await connection.getBlock(slotNum, {
          maxSupportedTransactionVersion: 0,
          transactionDetails: 'full',
          rewards: false,
        });
        if (!blkRaw) return;
        setBlock({ ...blkRaw, slot: slotNum });
        setTxs(blkRaw.transactions);
      } catch (err) {
        console.error('loadBlock error:', err);
      }
    })();
  }, [currentIndex, history]);

  const goPrevious = () => {
    if (running) return;
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    } else if (history[0] > 0) {
      const prevSlot = history[0] - 1;
      setHistory(h => [prevSlot, ...h]);
      setCurrentIndex(0);
    }
  };

  const goNext = () => {
    if (running) return;
    if (currentIndex < history.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  // 5) lookup handler cu noua limită
  const handleLookup = () => {
    const s   = Number(searchSlot);
    const tip = history.length ? history[history.length - 1] : 0;
    if (isNaN(s) || s < firstSlot || s > tip) return;

    setRunning(false);
    const idx = history.indexOf(s);
    if (idx !== -1) {
      setCurrentIndex(idx);
    } else {
      setHistory(prev => {
        const next = [...prev, s].sort((a, b) => a - b);
        setCurrentIndex(next.indexOf(s));
        return next;
      });
    }
  };

  const tip = history.length ? history[history.length - 1] : 0;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Solana Explorer</h1>
        <BlockDetails block={block} />

        <div className="balance-run">
          <BalanceLookup />

          <button
            className="nav-btn"
            onClick={goPrevious}
            disabled={ running || (currentIndex <= 0 && history[0] <= firstSlot) }
          >
            ←
          </button>

          <button
            className="run-pause-btn"
            onClick={() => setRunning(r => !r)}
          >
            {running ? 'Pause' : 'Run'}
          </button>

          <button
            className="nav-btn"
            onClick={goNext}
            disabled={ running || currentIndex >= history.length - 1 }
          >
            →
          </button>

          {/* ── Search bar cu prima limită din rețea ── */}
          <div className="block-search">
            <input
              type="number"
              min={firstSlot}
              max={tip}
              placeholder={`Enter slot # (min. ${firstSlot}) please!`}
              value={searchSlot}
              onChange={e => setSearchSlot(e.target.value)}
            />
            <button
              className="lookup-btn"
              onClick={handleLookup}
              disabled={
                searchSlot === '' ||
                Number(searchSlot) < firstSlot ||
                Number(searchSlot) > tip
              }
            >
              Look-up
            </button>
          </div>
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
