import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './dark-mode.css'
import { App } from './App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`, { scope: import.meta.env.BASE_URL })
  })
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
