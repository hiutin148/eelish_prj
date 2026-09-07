const links = [
  ['⌂', 'Dashboard', '#/'],
  ['▣', 'My decks', '#/decks'],
  ['◉', 'Practice', '#/practice'],
  ['✓', 'Tasks', '#/tasks'],
  ['◒', 'Progress', '#/progress'],
  ['⚙', 'Settings', '#/settings'],
]
export function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="nav-label">Workspace</p>
      <nav className="nav-list">
        {links.map(([icon, label, href]) => (
          <a
            className={`nav-link ${location.hash === href ? 'active' : ''}`}
            href={href}
            key={href}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
