import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { FiMenu, FiX, FiLogOut, FiSettings, FiUser } from 'react-icons/fi'

export default function Navbar({ user: propUser }) {
  const location = useLocation()
  const isSettingsPage = location.pathname === '/settings'
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(propUser || null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch user data and listen for updates
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
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

    // Listen for profile update events
    const handleProfileUpdate = () => {
      fetchUser()
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/logout', {
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

// Ganti fungsi getProfilePicture menjadi:
const getProfilePicture = () => {
  // Cek di localStorage terlebih dahulu
  const localProfilePic = localStorage.getItem('profilePicture');
  
  if (localProfilePic) {
    // Jika gambar disimpan sebagai base64
    if (localProfilePic.startsWith('data:image')) {
      return localProfilePic;
    }
    // Jika hanya nama file
    return `http://127.0.0.1:8000/storage/${localProfilePic}`;
  }
  
  return user?.profile_picture 
    ? `http://127.0.0.1:8000/storage/${user.profile_picture}`
    : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
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
            isSettingsPage ? null : (
              <motion.li
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="user-menu"
                ref={dropdownRef}
              >
                <div className="profilecontainer" onClick={toggleDropdown}>
                  <div className="profilepicture">
                    <img 
                      src={getProfilePicture()} 
                      alt={user.name} 
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`
                      }}
                    />
                  </div>
                  <div className={`dropdown ${dropdownOpen ? 'show' : ''}`}>
                    <div className="dropdown-header">
                      <div className="dropdown-picture">
                        <img 
                          src={getProfilePicture()} 
                          alt={user.name}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`
                          }}
                        />
                      </div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-username">{user.name}</span>
                        <span className="dropdown-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <NavLink 
                      to="/settings" 
                      className="dropdown-item"
                      onClick={() => {
                        setIsOpen(false)
                        setDropdownOpen(false)
                      }}
                    >
                      <FiSettings className="dropdown-icon" />
                      <span>Settings</span>
                    </NavLink>
                    <button onClick={handleLogout} className="dropdown-item">
                      <FiLogOut className="dropdown-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </motion.li>
            )
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