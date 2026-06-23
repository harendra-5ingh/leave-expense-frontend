import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { apiFetch } from '../api/client.js'
import styles from './AuthPage.module.css'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', department: '', role: 'EMPLOYEE',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  async function submit() {
    setError('')
    setLoading(true)
    try {
      let data
      if (mode === 'login') {
        data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
      } else {
        const payload = {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
        }
        if (form.department) payload.department = form.department
        data = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      login(data)
      toast('Welcome, ' + data.fullName + '!', 'success')
      navigate('/dashboard')
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter') submit()
  }

  function switchMode(m) {
    setMode(m)
    setError('')
    setForm({ email: '', password: '', fullName: '', department: '', role: 'EMPLOYEE' })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logo}>LeaveDesk</div>
        <div className={styles.sub}>
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {mode === 'register' && (
          <>
            <div className={styles.field}>
              <label>Full Name</label>
              <input
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="John Doe"
                onKeyDown={handleKey}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Department</label>
                <input
                  value={form.department}
                  onChange={set('department')}
                  placeholder="Engineering"
                  onKeyDown={handleKey}
                />
              </div>
              <div className={styles.field}>
                <label>Role</label>
                <select value={form.role} onChange={set('role')}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@company.com"
            onKeyDown={handleKey}
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            onKeyDown={handleKey}
          />
        </div>

        <button className={styles.btnPrimary} onClick={submit} disabled={loading}>
          {loading
            ? 'Please wait…'
            : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <div className={styles.toggle}>
          {mode === 'login' ? (
            <>No account?{' '}
              <span onClick={() => switchMode('register')}>Register</span>
            </>
          ) : (
            <>Have an account?{' '}
              <span onClick={() => switchMode('login')}>Sign in</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
