// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 h-16 bg-gray-800 z-50 flex items-center justify-between">
      {/* Titlul spre stânga */}
      <h1 className="text-xl font-bold text-green-400 pl-6">
        GoSOL
      </h1>

      {/* Link-urile spre dreapta */}
      <div className="flex items-center space-x-6 pr-6 text-gray-100">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'underline text-green-300' : 'hover:text-green-300'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/explorer"
          className={({ isActive }) =>
            isActive ? 'underline text-green-300' : 'hover:text-green-300'
          }
        >
          Explore the blockchain
        </NavLink>
      </div>
    </nav>
  )
}
