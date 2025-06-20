import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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
        </ul>
      </div>
    </nav>
  )
}