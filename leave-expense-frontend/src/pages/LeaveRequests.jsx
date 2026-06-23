import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { apiFetch } from '../api/client.js'
import StatusBadge from '../components/StatusBadge.jsx'
import Modal from '../components/Modal.jsx'
import styles from './DataPage.module.css'

const LEAVE_TYPES = ['SICK', 'CASUAL', 'EARNED', 'UNPAID', 'MATERNITY', 'PATERNITY']

export default function LeaveRequests() {
  const { auth } = useAuth()
  const toast = useToast()
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ leaveType: 'SICK', startDate: '', endDate: '', reason: '' })
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const load = () =>
    apiFetch('/leave-requests/me', {}, auth.token).then(setList).catch(() => {})

  useEffect(() => { load() }, [])

  async function submit() {
    if (!form.startDate || !form.endDate) {
      toast('Please fill start and end dates', 'error')
      return
    }
    setLoading(true)
    try {
      await apiFetch('/leave-requests', { method: 'POST', body: JSON.stringify(form) }, auth.token)
      toast('Leave request submitted!', 'success')
      setShowModal(false)
      setForm({ leaveType: 'SICK', startDate: '', endDate: '', reason: '' })
      load()
    } catch (e) {
      toast(e.message, 'error')
    }
    setLoading(false)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>My Leave Requests</h2>
          <p className={styles.sub}>Track and manage your leaves</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
          + New Request
        </button>
      </div>

      <div className={styles.card}>
        {list.length === 0 ? (
          <div className={styles.empty}>No leave requests yet. Submit your first one!</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {list.map(l => (
                <tr key={l.id}>
                  <td className={styles.muted}>{l.id}</td>
                  <td><b>{l.leaveType}</b></td>
                  <td>{l.startDate}</td>
                  <td>{l.endDate}</td>
                  <td className={styles.truncate}>{l.reason || '—'}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td className={styles.muted}>{l.createdAt?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal
          title="New Leave Request"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className={styles.btnGhost} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={submit} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Request'}
              </button>
            </>
          }
        >
          <div className={styles.field}>
            <label>Leave Type</label>
            <select value={form.leaveType} onChange={set('leaveType')}>
              {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Start Date</label>
              <input type="date" value={form.startDate} onChange={set('startDate')} />
            </div>
            <div className={styles.field}>
              <label>End Date</label>
              <input type="date" value={form.endDate} onChange={set('endDate')} />
            </div>
          </div>
          <div className={styles.field}>
            <label>Reason (optional)</label>
            <textarea
              value={form.reason}
              onChange={set('reason')}
              placeholder="Brief reason for leave…"
            />
          </div>
        </Modal>
      )}
    </div>
  )
}
