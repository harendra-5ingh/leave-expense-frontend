import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import styles from './Sidebar.module.css'

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
)
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)
const IconReceipt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 2v20l3-2 2 2 2-2 2 2 2-2 3 2V2l-3 2-2-2-2 2-2-2-2 2-3-2z"/>
    <path d="M9 7h6M9 11h6M9 15h4"/>
  </svg>
)
const IconTeam = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.active : ''}`
      }
    >
      <span className={styles.icon}>{icon}</span>
      {label}
    </NavLink>
  )
}

export default function Sidebar() {
  const { auth, logout } = useAuth()
  const role = auth?.role
  const initials = (auth?.fullName || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>LeaveDesk</div>
        <div className={styles.brandSub}>HR Management Portal</div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>Main</div>
        <NavItem to="/dashboard" icon={<IconHome />} label="Dashboard" />
        <NavItem to="/leaves" icon={<IconCalendar />} label="My Leaves" />
        <NavItem to="/expenses" icon={<IconReceipt />} label="My Expenses" />

        {(role === 'MANAGER' || role === 'ADMIN') && (
          <>
            <div className={styles.section}>Management</div>
            <NavItem to="/team-leaves" icon={<IconTeam />} label="Team Leaves" />
            <NavItem to="/team-expenses" icon={<IconTeam />} label="Team Expenses" />
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <div className={styles.section}>Admin</div>
            <NavItem to="/users" icon={<IconUsers />} label="All Users" />
          </>
        )}
      </nav>

      <div className={styles.footer}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{auth?.fullName}</div>
          <div className={styles.userRole}>{role}</div>
        </div>
        <button className={styles.logoutBtn} onClick={logout} title="Sign out">
          <IconLogout />
        </button>
      </div>
    </aside>
  )
}
