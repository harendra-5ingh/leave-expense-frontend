import styles from './Modal.module.css'

export default function Modal({ title, onClose, children, footer }) {
  return (
    <div
      className={styles.backdrop}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.title}>{title}</div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )
}
