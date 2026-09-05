const links = [
  ['⌂', 'Dashboard', '#/'],
  ['▣', 'My decks', '#/decks'],
  ['✓', 'Tasks', '#/tasks'],
  ['⚙', 'Settings', '#/about'],
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
      <p className="nav-label">Support</p>
      <nav className="nav-list">
        <a className="nav-link" href="#/about">
          <span className="nav-icon">?</span>About Eelish
        </a>
      </nav>
    </aside>
  )
}
