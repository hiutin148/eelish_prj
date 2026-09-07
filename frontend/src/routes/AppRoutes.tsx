import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { Footer } from '../components/layout/Footer'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import '../App.css'
import { Decks } from '../pages/Decks'
import { Practice } from '../pages/Practice'
import { Tasks } from '../pages/Tasks'
import { Progress } from '../pages/Progress'
import { Settings } from '../pages/Settings'

export function AppRoutes() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const page = (() => {
    switch (route) {
      case '#/':
        return <Home />
      case '#/decks':
        return <Decks />
      case '#/practice':
        return <Practice />
      case '#/tasks':
        return <Tasks />
      case '#/progress':
        return <Progress />
      case '#/settings':
        return <Settings />
      default:
        return <NotFound />
    }
  })()
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
