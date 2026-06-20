import { Banner } from '../marketplace/banner'
import { Link } from '../ui/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-banner-slot">
        <Banner placement="FOOTER" />
      </div>
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>NewZealankans Marketplace</strong>
          <p>Clean, approved classifieds for New Zealand communities.</p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <strong>Browse</strong>
            <Link to="/search">All listings</Link>
            <Link to="/category/property">Property</Link>
            <Link to="/category/motor">Motors</Link>
            <Link to="/category/jobs">Jobs</Link>
            <Link to="/category/services">Services</Link>
          </div>
          <div className="footer-col">
            <strong>Account</strong>
            <Link to="/post-ad">Post an ad</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/my-ads">My ads</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/settings">Settings</Link>
          </div>
          <div className="footer-col">
            <strong>Company</strong>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact us</Link>
            <Link to="/terms">Terms of service</Link>
            <Link to="/privacy">Privacy policy</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <small>© {currentYear} NewZealankans Marketplace. All rights reserved.</small>
      </div>
    </footer>
  )
}
