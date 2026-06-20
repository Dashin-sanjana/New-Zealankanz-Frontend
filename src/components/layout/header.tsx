import { Link } from '../ui/link'

export function Header({ auth, menuOpen, setMenuOpen }) {
  const navItems = [
    ['Categories', '/search'],
    ['Watchlist', '/dashboard'],
    ['Favourites', '/dashboard'],
  ]

  return (
    <header className="site-header">
      <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark">NZ</span>
        <span>
          <strong>NewZealankans</strong>
          <small>Marketplace</small>
        </span>
      </Link>
      <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)}>
        Menu
      </button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {navItems.map(([label, to]) => (
          <Link key={`${label}-${to}`} to={to} onClick={() => setMenuOpen(false)}>
            {label}
          </Link>
        ))}
        {auth.user?.role === 'ADMIN' && (
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
        )}
      </nav>
      <div className="header-actions">
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
