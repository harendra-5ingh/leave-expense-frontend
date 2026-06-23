import styles from './StatusBadge.module.css'

const CLASS_MAP = {
  PENDING:   styles.pending,
  APPROVED:  styles.approved,
  REJECTED:  styles.rejected,
  ESCALATED: styles.escalated,
}

export default function StatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${CLASS_MAP[status] || ''}`}>
      {status}
    </span>
  )
}
