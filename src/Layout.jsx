// src/Layout.jsx
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

export default function Layout() {
  return (
    <>
      {/* Navbar lipit de marginea de sus, full-width */}
      <Navbar />

      {/* Conținutul route-urilor începe sub navbar */}
      <div className="mt-16">  
        <Outlet />
      </div>
    </>
  )
}
