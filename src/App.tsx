import { useEffect, useState } from 'react'
import './App.css'
import { Footer } from './components/layout/footer'
import { Header } from './components/layout/header'
import { useAuth } from './features/auth/use-auth'
import { useRoute } from './hooks/use-route'
import AppRoutes from './routes/app-routes'

function App() {
  const isDemoMode = import.meta.env.MODE === 'demo' && import.meta.env.VITE_DEMO_MODE === 'true'
  const route = useRoute()
  const auth = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('nzk-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  // Automatically close mobile menu when navigating to another route
  useEffect(() => {
    setMenuOpen(false)
  }, [route])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('nzk-theme', theme)
    } catch {
      // The theme still applies for this session when storage is unavailable.
    }
  }, [theme])

  return (
    <div className="app-shell">
      {isDemoMode && <div className="demo-notice" role="status">Client demo · Isolated sample data · Email delivery disabled</div>}
      <Header route={route} auth={auth} menuOpen={menuOpen} setMenuOpen={setMenuOpen} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main>
        <AppRoutes route={route} auth={auth} />
      </main>
      <Footer />
    </div>
  )
}

export default App
