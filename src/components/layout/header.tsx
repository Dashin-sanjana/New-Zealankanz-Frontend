import { Link } from '../ui/link'
import newzealankanzLogo from '../../assets/newzealankanz-logo-transparent.png'

interface HeaderProps {
  route: string
  auth: any
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Header({ route, auth, menuOpen, setMenuOpen, theme, onToggleTheme }: HeaderProps) {
  const navItems = [
    ['Marketplace', '/search'],
    ['Property', '/category/property'],
    ['Motors', '/category/motor'],
    ['Jobs', '/category/jobs'],
    ['Services', '/category/services'],
  ]

  const [pathname] = (route || '/').split('?')
  const isActive = (to: string) => {
    if (to === '/search') {
      return pathname === '/search'
    }
    return pathname === to || pathname.startsWith(to)
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="NewZealankans Marketplace home" onClick={() => setMenuOpen(false)}>
        <img className="brand-logo" src={newzealankanzLogo} alt="NewZealankans" />
      </Link>
      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? 'Close' : 'Menu'}
      </button>
      <nav id="site-navigation" className={menuOpen ? 'nav open' : 'nav'}>
        {navItems.map(([label, to]) => (
          <Link
            key={`${label}-${to}`}
            to={to}
            className={isActive(to) ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        {auth.user?.role === 'ADMIN' && (
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
        )}
        {/* Mobile-only auth actions — visible when menu is open on small screens */}
        <div className="mobile-nav-actions">
          <button type="button" className="theme-toggle" aria-pressed={theme === 'dark'} onClick={onToggleTheme}>
            {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          </button>
          {auth.user ? (
            <>
              <Link to="/post-ad" className="sell-button" onClick={() => setMenuOpen(false)}>Start a listing</Link>
              <Link to="/dashboard" className="ghost-button" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button type="button" className="text-button" onClick={() => { setMenuOpen(false); auth.logout() }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/post-ad" className="sell-button" onClick={() => setMenuOpen(false)}>Start a listing</Link>
              <Link to="/login" className="text-button" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="primary-button" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </nav>
      <div className="header-actions">
        <button type="button" className="theme-toggle" aria-pressed={theme === 'dark'} onClick={onToggleTheme}>
          {theme === 'dark' ? 'Light theme' : 'Dark theme'}
        </button>
        {auth.user ? (
          <>
            <Link to="/post-ad" className="sell-button">
              Start a listing
            </Link>
            <Link to="/dashboard" className="ghost-button">
              Dashboard
            </Link>
            <button type="button" className="text-button" onClick={auth.logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/post-ad" className="sell-button">
              Start a listing
            </Link>
            <Link to="/login" className="text-button">
              Login
            </Link>
            <Link to="/register" className="primary-button">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
