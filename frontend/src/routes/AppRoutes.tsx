import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { Footer } from '../components/layout/Footer'
import { Home } from '../pages/Home'
import { About } from '../pages/About'
import { NotFound } from '../pages/NotFound'
import '../App.css'

export function AppRoutes() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const page = route === '#/' ? <Home /> : route === '#/about' ? <About /> : <NotFound />
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="page-content">{page}</main>
      </div>
      <Footer />
    </div>
  )
}
