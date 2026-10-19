import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        {/* Toaster uses CSS variables so toast colors adapt to the active theme */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-brand-card)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-brand-border)',
            },
            success: {
              iconTheme: { primary: '#f97316', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
