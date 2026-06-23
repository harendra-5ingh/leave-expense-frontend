import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'
import styles from './Layout.module.css'

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/leaves':        'My Leaves',
  '/expenses':      'My Expenses',
  '/team-leaves':   'Team Leaves',
  '/team-expenses': 'Team Expenses',
  '/users':         'All Users',
}

const ROLE_COLORS = {
  ADMIN:    { bg: '#ede9fe', color: '#5b21b6' },
  MANAGER:  { bg: '#dbeafe', color: '#1e40af' },
  EMPLOYEE: { bg: '#d1fae5', color: '#065f46' },
}

export default function Layout() {
  const { auth } = useAuth()
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'LeaveDesk'
  const roleStyle = ROLE_COLORS[auth?.role] || ROLE_COLORS.EMPLOYEE

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.title}>{title}</span>
          <span
            className={styles.roleBadge}
            style={{ background: roleStyle.bg, color: roleStyle.color }}
          >
            {auth?.role}
          </span>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
