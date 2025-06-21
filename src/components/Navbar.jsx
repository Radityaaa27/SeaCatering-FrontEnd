import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)

  // Check auth status saat komponen mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      localStorage.removeItem('token')
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <motion.div 
          className="logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <NavLink to="/">SEA Catering</NavLink>
        </motion.div>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {['Home', 'Menu', 'Subscription', 'Contact Us'].map((item, index) => (
            <motion.li
              key={item}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NavLink 
                to={item === 'Home' ? '/' : item.toLowerCase().replace(' ', '-')}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </NavLink>
            </motion.li>
          ))}

          {user ? (
            <motion.li
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="user-menu"
            >
              <div className="nav-link user-profile">
                <FiUser className="icon" />
                {user.name}
                <div className="dropdown">
                  <button onClick={handleLogout} className="logout-btn">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            </motion.li>
          ) : (
            <motion.li
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <NavLink 
                to="/login"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
            </motion.li>
          )}
        </ul>
      </div>
    </nav>
  )
}