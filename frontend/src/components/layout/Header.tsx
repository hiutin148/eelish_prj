import { useContext } from 'react'
import { AuthContext } from '../../context/authContextValue'
export function Header() {
  const context = useContext(AuthContext)
  const user = context?.user
  return (
    <header className="topbar">
      <a className="brand" href="#/">
        <span className="brand-mark">e</span>Eelish
      </a>
      <div className="user-chip">
        <span>{user?.name ?? 'Guest'}</span>
        <span className="avatar">{user?.name?.[0] ?? 'G'}</span>
      </div>
    </header>
  )
}
