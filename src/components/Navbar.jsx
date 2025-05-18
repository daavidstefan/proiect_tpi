// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';
import { useNetwork } from '../context/NetworkContext.jsx';
import navbarLogo from '../assets/navbar_logo.png';

export default function Navbar() {
  const { network, toggleNetwork } = useNetwork();

  return (
    <nav className="
      fixed inset-x-0 top-0 h-15
      bg-gradient-to-r from-[#00ffa3] to-black
      border-b border-[#00ffa3] z-50
      flex items-center justify-between px-6 py-9
    ">
      <div className="flex items-center space-x-4">
        {/* logo - click navighează spre Home */}
        <NavLink to="/" className="flex items-center">
          <img
            src={navbarLogo}
            alt="MySOL logo"
            className="h-30 w-auto"
          />
        </NavLink>

        {/* switch rețea */}
        <label className="relative inline-block w-28 h-8 cursor-pointer">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={network === 'mainnet'}
            onChange={toggleNetwork}
          />
          {/* track */}
          <span className="
            block absolute inset-0
            bg-gray-700 rounded-full
            border border-black
          " />
          {/* thumb */}
          <span className="
            absolute top-1 left-1
            w-14 h-6
            bg-[#00ffa3] rounded-full
            border border-black
            z-10 transform transition-all
            peer-checked:translate-x-[48px]
            flex items-center justify-center
          ">
            <span className="text-xs font-medium text-black select-none font-mono">
              {network === 'mainnet' ? 'mainnet' : 'devnet'}
            </span>
          </span>
        </label>
      </div>

      {/* meniul din dreapta */}
      <div className="flex items-center space-x-6 text-gray-100 font-mono">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'underline text-green-300' : 'hover:text-green-300'
          }
        >
          Validators
        </NavLink>
        <NavLink
          to="/explorer"
          className={({ isActive }) =>
            isActive ? 'underline text-green-300' : 'hover:text-green-300'
          }
        >
          Explorer
        </NavLink>
      </div>
    </nav>
  );
}
