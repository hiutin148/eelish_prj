import { NavLink } from 'react-router-dom'

const links = [
  ['⌂', 'Dashboard', '/'],
  ['▣', 'My decks', '/decks'],
  ['◉', 'Practice', '/practice'],
  ['▤', 'Flashcards', '/flashcards'],
  ['文', 'Grammar', '/grammar'],
  ['▤', 'Exams', '/exams'],
  ['◒', 'Progress', '/progress'],
  ['⚙', 'Settings', '/settings'],
]
export function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="nav-label">Workspace</p>
      <nav className="nav-list">
        {links.map(([icon, label, href]) => (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to={href}
            end={href === '/'}
            key={href}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
