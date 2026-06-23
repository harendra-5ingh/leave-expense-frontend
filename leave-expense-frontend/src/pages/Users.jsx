import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch } from '../api/client.js'
import styles from './DataPage.module.css'

const ROLE_CLASS = {
  ADMIN:    styles.tagAdmin,
  MANAGER:  styles.tagManager,
  EMPLOYEE: styles.tagEmployee,
}

export default function Users() {
  const { auth } = useAuth()
  const [list, setList] = useState([])

  useEffect(() => {
    apiFetch('/users', {}, auth.token).then(setList).catch(() => {})
  }, [])

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>All Users</h2>
          <p className={styles.sub}>
            {list.length} registered user{list.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className={styles.card}>
        {list.length === 0 ? (
          <div className={styles.empty}>No users found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u.id}>
                  <td className={styles.muted}>{u.id}</td>
                  <td><b>{u.fullName}</b></td>
                  <td className={styles.muted}>{u.email}</td>
                  <td>{u.department || '—'}</td>
                  <td>
                    <span className={`${styles.tagRole} ${ROLE_CLASS[u.role] || ''}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
