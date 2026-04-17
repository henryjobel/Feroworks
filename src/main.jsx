import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

const container = document.getElementById('root')
const initialCms = window.__INITIAL_CMS__ || null

const element = (
  <StrictMode>
    <AuthProvider>
      <App RouterComponent={BrowserRouter} initialCms={initialCms} />
    </AuthProvider>
  </StrictMode>
)

if (container.hasChildNodes()) {
  hydrateRoot(container, element)
} else {
  createRoot(container).render(element)
}
