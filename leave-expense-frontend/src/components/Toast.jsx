import { useEffect } from 'react'
import styles from './Toast.module.css'

export default function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`${styles.toast} ${styles[type] || ''}`}>
      {msg}
    </div>
  )
}
