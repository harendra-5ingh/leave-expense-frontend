import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { apiFetch } from '../api/client.js'
import StatusBadge from '../components/StatusBadge.jsx'
import styles from './DataPage.module.css'

export default function TeamRequests({ type }) {
  const { auth } = useAuth()
  const toast = useToast()
  const [list, setList] = useState([])
  const [comments, setComments] = useState({})
  const isLeave = type === 'leave'
  const basePath = isLeave ? '/leave-requests' : '/expense-claims'
  const label = isLeave ? 'Leave' : 'Expense'

  const load = () => {
    const ep = auth.role === 'ADMIN'
      ? basePath
      : `${basePath}/pending-for-team`
    apiFetch(ep, {}, auth.token).then(setList).catch(() => {})
  }

  useEffect(() => { load() }, [type])

  async function act(id, action) {
    try {
      await apiFetch(
        `${basePath}/${id}/${action}`,
        { method: 'PATCH', body: JSON.stringify({ comment: comments[id] || '' }) },
        auth.token
      )
      toast(`Request ${action}d successfully`, 'success')
      load()
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  const pending = list.filter(r => r.status === 'PENDING' || r.status === 'ESCALATED')
  const reviewed = list.filter(r => r.status !== 'PENDING' && r.status !== 'ESCALATED')

  const renderTable = (rows, showActions) => (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Employee</th>
          {isLeave ? (
            <><th>Type</th><th>From</th><th>To</th><th>Reason</th></>
          ) : (
            <><th>Category</th><th>Amount</th><th>Date</th><th>Description</th></>
          )}
          <th>Status</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td className={styles.muted}>{r.id}</td>
            <td><b>{r.userFullName}</b></td>
            {isLeave ? (
              <>
                <td>{r.leaveType}</td>
                <td>{r.startDate}</td>
                <td>{r.endDate}</td>
                <td className={styles.truncate}>{r.reason || '—'}</td>
              </>
            ) : (
              <>
                <td>{r.category}</td>
                <td>₹{Number(r.amount).toFixed(2)}</td>
                <td>{r.expenseDate || '—'}</td>
                <td className={styles.truncate}>{r.description || '—'}</td>
              </>
            )}
            <td><StatusBadge status={r.status} /></td>
            {showActions && (
              <td>
                <div className={styles.actionRow}>
                  <input
                    className={styles.actionInput}
                    placeholder="Comment…"
                    value={comments[r.id] || ''}
                    onChange={e =>
                      setComments(c => ({ ...c, [r.id]: e.target.value }))
                    }
                  />
                  <button
                    className={styles.btnApprove}
                    onClick={() => act(r.id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.btnReject}
                    onClick={() => act(r.id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Team {label} Requests</h2>
          <p className={styles.sub}>Review and take action on your team's requests</p>
        </div>
      </div>

      <div className={styles.card}>
        <div style={{ padding: '12px 24px 8px' }}>
          <div className={styles.sectionTitle}>
            Pending &amp; Escalated ({pending.length})
          </div>
        </div>
        {pending.length === 0 ? (
          <div className={styles.empty}>No pending requests — all clear! 🎉</div>
        ) : renderTable(pending, true)}
      </div>

      {reviewed.length > 0 && (
        <div className={styles.card}>
          <div style={{ padding: '12px 24px 8px' }}>
            <div className={styles.sectionTitle}>Reviewed ({reviewed.length})</div>
          </div>
          {renderTable(reviewed, false)}
        </div>
      )}
    </div>
  )
}
