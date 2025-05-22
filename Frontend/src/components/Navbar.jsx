import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import UserService from "../services/User.service"

const baseRoutes = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  // { path: "/products", name: "Products" },
  { path: "/cart", name: "Cart" },
]

const authRoutes = [
  { path: "/my-transactions", name: "My Transactions" },
  { path: "/profile", name: "Profile" },
]

const nonAuthRoutes = [
  { path: "/auth", name: "Login" },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const getRoutes = () => {
    return [
      ...baseRoutes,
      ...(isAuthenticated ? authRoutes : nonAuthRoutes)
    ]
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    const checkAuth = () => {
      setIsAuthenticated(UserService.isLoggedIn())
    }
    
    window.addEventListener('scroll', handleScroll)
    
    checkAuth()
    
    const authInterval = setInterval(checkAuth, 5000)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(authInterval)
    }
  }, [])

  return (
    <nav className={`navbar py-3 md:py-4 px-4 md:px-8 lg:px-12 flex items-center justify-between fixed top-0 left-0 right-0 w-full z-30 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      <div className="text-2xl font-bold text-orange-600 tracking-wide flex items-center gap-2 transition-transform duration-300 hover:scale-105">
        <span className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-orange-600 to-orange-500 rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-lg transition-all duration-300 hover:shadow-orange-300 hover:shadow-md">E</span>
        <span className="hidden sm:inline relative group">
          -Shop
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-500 group-hover:w-full"></span>
        </span>
      </div>
      
      <button
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 hover:bg-orange-50"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block h-0.5 w-6 bg-orange-600 mb-1.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block h-0.5 w-6 bg-orange-600 mb-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block h-0.5 w-6 bg-orange-600 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      <ul className="hidden lg:flex gap-6 lg:gap-10 items-center">
        {getRoutes().map(({ path, name }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `text-lg px-4 py-2 transition-all duration-300 font-semibold relative overflow-hidden ${
                  isActive
                    ? 'text-orange-600'
                    : 'text-gray-700 hover:text-orange-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{name}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                  } origin-left`}></span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md transition-all duration-300 shadow-lg ${
        menuOpen 
          ? 'max-h-screen py-4 opacity-100' 
          : 'max-h-0 py-0 opacity-0 pointer-events-none'
      } overflow-hidden z-10`}>        {/* Tablet-specific menu (md screens) */}
        <div className="hidden md:flex lg:hidden justify-center pb-2">
          <ul className="flex flex-wrap justify-center gap-2 px-4">
            {getRoutes().map(({ path, name }) => (
              <li key={path} className="flex-shrink-0">
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `block text-base px-6 py-2.5 rounded-full transition-all duration-300 font-medium ${
                      isActive
                        ? 'bg-orange-50 text-orange-600 shadow-sm'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        
        <ul className="flex md:hidden flex-col gap-2 px-6">
          {getRoutes().map(({ path, name }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `block text-base px-4 py-3 transition-all duration-300 font-semibold relative overflow-hidden ${
                    isActive
                      ? 'text-orange-600'
                      : 'text-gray-700 hover:text-orange-700'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{name}</span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'
                    } origin-left`}></span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar