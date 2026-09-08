import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { Footer } from '../components/layout/Footer'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import '../App.css'
import { Decks } from '../pages/Decks'
import { Practice } from '../pages/Practice'
import { Progress } from '../pages/Progress'
import { Settings } from '../pages/Settings'
import { Grammar } from '../pages/Grammar'
import { Exams } from '../pages/Exams'
import { Flashcards } from '../pages/Flashcards'
import { Route, Routes } from 'react-router-dom'

export function AppRoutes() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/decks" element={<Decks />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}
