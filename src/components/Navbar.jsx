import { NavLink } from 'react-router-dom';
import { useNetwork } from "../context/NetworkContext.jsx";

export default function Navbar() {
  const { network, toggleNetwork } = useNetwork();

  return (
    <nav className="fixed inset-x-0 top-0 h-16 bg-gray-800 z-50 flex items-center justify-between">
      <div className="flex items-center pl-6 space-x-4">
        <h1 className="text-xl font-bold text-green-400">GoSOL</h1>
        <button
          onClick={toggleNetwork}
          className={`px-3 py-1 rounded-full border select-none \
            ${network === 'mainnet'
              ? 'bg-green-900 border-green-400 text-green-300 hover:bg-green-800'
              : 'bg-blue-900 border-blue-400 text-blue-300 hover:bg-blue-800'
            }`}
        >
          {network.toUpperCase()}
        </button>
      </div>

      <div className="flex items-center space-x-6 pr-6 text-gray-100">
        <NavLink to="/" end className={({ isActive }) =>
          isActive ? 'underline text-green-300' : 'hover:text-green-300'
        }>
          Home
        </NavLink>
        <NavLink to="/explorer" className={({ isActive }) =>
          isActive ? 'underline text-green-300' : 'hover:text-green-300'
        }>
          Explore the blockchain
        </NavLink>
      </div>
    </nav>
  );
}