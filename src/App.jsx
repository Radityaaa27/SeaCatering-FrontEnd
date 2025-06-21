import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const location = useLocation()
  const hideNavbar = ['/login','/register'].includes(location.pathname)
  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!hideNavbar && <footer className="footer">
        <p>© 2025 SEA Catering. All rights reserved.</p>
      </footer>}
    </div>
  )
}

export default App