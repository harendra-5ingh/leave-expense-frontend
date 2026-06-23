import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch } from '../api/client.js'
import StatusBadge from '../components/StatusBadge.jsx'
import styles from './Dashboard.module.css'

function StatCard({ label, value, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statVal} style={color ? { color } : {}}>
        {value}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const { auth } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    apiFetch('/leave-requests/me', {}, auth.token).then(setLeaves).catch(() => {})
    apiFetch('/expense-claims/me', {}, auth.token).then(setExpenses).catch(() => {})
  }, [auth.token])

  const count = (arr, status) => arr.filter(x => x.status === status).length

  return (
    <div>
      <div className={styles.header}>
        <h2>Welcome back, {auth.fullName.split(' ')[0]} 👋</h2>
        <p className={styles.sub}>Here's a summary of your activity</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Leaves" value={leaves.length} />
        <StatCard label="Leaves Pending" value={count(leaves, 'PENDING')} color="#d97706" />
        <StatCard label="Leaves Approved" value={count(leaves, 'APPROVED')} color="#16a34a" />
        <StatCard label="Total Expenses" value={expenses.length} />
        <StatCard label="Expenses Pending" value={count(expenses, 'PENDING')} color="#d97706" />
        <StatCard label="Expenses Approved" value={count(expenses, 'APPROVED')} color="#16a34a" />
      </div>

      <div className={styles.tables}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Leave Requests</h3>
          {leaves.length === 0 ? (
            <div className={styles.empty}>No leave requests yet</div>
          ) : (
            <table>
              <thead>
                <tr><th>Type</th><th>From</th><th>To</th><th>Status</th></tr>
              </thead>
              <tbody>
                {leaves.slice(0, 5).map(l => (
                  <tr key={l.id}>
                    <td><b>{l.leaveType}</b></td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td><StatusBadge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Expense Claims</h3>
          {expenses.length === 0 ? (
            <div className={styles.empty}>No expense claims yet</div>
          ) : (
            <table>
              <thead>
                <tr><th>Category</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {expenses.slice(0, 5).map(e => (
                  <tr key={e.id}>
                    <td><b>{e.category}</b></td>
                    <td>₹{Number(e.amount).toFixed(2)}</td>
                    <td><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
