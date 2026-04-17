import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'

const container = document.getElementById('root')
const initialCms = window.__INITIAL_CMS__ || null

const element = (
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <App RouterComponent={BrowserRouter} initialCms={initialCms} />
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>
)

if (container.hasChildNodes()) {
  hydrateRoot(container, element)
} else {
  createRoot(container).render(element)
}
