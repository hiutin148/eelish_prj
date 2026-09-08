import { useContext } from 'react'
import { AuthContext } from '../../context/authContextValue'
import { Link } from 'react-router-dom'
export function Header() {
  const context = useContext(AuthContext)
  const user = context?.user
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">e</span>Eelish
      </Link>
      <div className="user-chip">
        <span>{user?.name ?? 'Guest'}</span>
        <span className="avatar">{user?.name?.[0] ?? 'G'}</span>
      </div>
    </header>
  )
}
