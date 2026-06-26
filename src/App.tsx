import { useEffect, useState } from 'react'
import './App.css'
import { Footer } from './components/layout/footer'
import { Header } from './components/layout/header'
import { useAuth } from './features/auth/use-auth'
import { useRoute } from './hooks/use-route'
import AppRoutes from './routes/app-routes'

function App() {
  const route = useRoute()
  const auth = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  // Automatically close mobile menu when navigating to another route
  useEffect(() => {
    setMenuOpen(false)
  }, [route])

  return (
    <div className="app-shell">
      <Header route={route} auth={auth} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <AppRoutes route={route} auth={auth} />
      </main>
      <Footer />
    </div>
  )
}

export default App
