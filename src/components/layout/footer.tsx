import { Link } from '../ui/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>NewZealankans Marketplace</strong>
        <p>Clean, approved classifieds for New Zealand communities.</p>
      </div>
      <div className="footer-links">
        <Link to="/post-ad">Start a listing</Link>
        <Link to="/search">Browse categories</Link>
        <Link to="/contact">Help and contact</Link>
        <Link to="/login">Login</Link>
      </div>
    </footer>
  )
}
