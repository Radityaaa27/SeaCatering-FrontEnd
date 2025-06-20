import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2025 SEA Catering. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App