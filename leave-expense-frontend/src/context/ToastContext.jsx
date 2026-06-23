import { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast.jsx'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toastData, setToastData] = useState(null)

  const toast = useCallback((msg, type = 'success') => {
    setToastData({ msg, type, id: Date.now() })
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toastData && (
        <Toast
          key={toastData.id}
          msg={toastData.msg}
          type={toastData.type}
          onClose={() => setToastData(null)}
        />
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
