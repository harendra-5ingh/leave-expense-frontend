import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { apiFetch } from '../api/client.js'
import StatusBadge from '../components/StatusBadge.jsx'
import Modal from '../components/Modal.jsx'
import styles from './DataPage.module.css'

const CATEGORIES = ['TRAVEL', 'FOOD', 'ACCOMMODATION', 'OFFICE_SUPPLIES', 'CLIENT_ENTERTAINMENT', 'OTHER']

export default function ExpenseClaims() {
  const { auth } = useAuth()
  const toast = useToast()
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ category: 'TRAVEL', amount: '', description: '', expenseDate: '' })
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const load = () =>
    apiFetch('/expense-claims/me', {}, auth.token).then(setList).catch(() => {})

  useEffect(() => { load() }, [])

  async function submit() {
    if (!form.amount) { toast('Please enter an amount', 'error'); return }
    setLoading(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (!payload.expenseDate) delete payload.expenseDate
      await apiFetch('/expense-claims', { method: 'POST', body: JSON.stringify(payload) }, auth.token)
      toast('Expense claim submitted!', 'success')
      setShowModal(false)
      setForm({ category: 'TRAVEL', amount: '', description: '', expenseDate: '' })
      load()
    } catch (e) {
      toast(e.message, 'error')
    }
    setLoading(false)
  }

  const approvedTotal = list
    .filter(e => e.status === 'APPROVED')
    .reduce((s, e) => s + Number(e.amount), 0)

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>My Expense Claims</h2>
          <p className={styles.sub}>
            Approved total: <b>₹{approvedTotal.toFixed(2)}</b>
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
          + New Claim
        </button>
      </div>

      <div className={styles.card}>
        {list.length === 0 ? (
          <div className={styles.empty}>No expense claims yet. Submit your first one!</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {list.map(e => (
                <tr key={e.id}>
                  <td className={styles.muted}>{e.id}</td>
                  <td><b>{e.category}</b></td>
                  <td>₹{Number(e.amount).toFixed(2)}</td>
                  <td>{e.expenseDate || '—'}</td>
                  <td className={styles.truncate}>{e.description || '—'}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td className={styles.muted}>{e.createdAt?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal
          title="New Expense Claim"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className={styles.btnGhost} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={submit} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Claim'}
              </button>
            </>
          }
        >
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Amount (₹)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={set('amount')}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Expense Date</label>
            <input type="date" value={form.expenseDate} onChange={set('expenseDate')} />
          </div>
          <div className={styles.field}>
            <label>Description (optional)</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="What was this expense for?"
            />
          </div>
        </Modal>
      )}
    </div>
  )
}
