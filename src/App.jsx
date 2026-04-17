import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { CmsProvider } from './cms/CmsContext'
import { useCms } from './cms/CmsContext'
import Navbar from './components/Navbar'
import HeroBanner from './components/HeroBanner'
import WatFernaSection from './components/WatFernaSection'
import ClientLogosSection from './components/ClientLogosSection'
import WatOnsAndersMaakt from './components/WatOnsAndersMaakt'
import StatsSection from './components/StatsSection'
import OnzeSectorenSection from './components/OnzeSectorenSection'
import UwProjectSection from './components/UwProjectSection'
import ProjectenSlider from './components/ProjectenSlider'
import FaqSection from './components/FaqSection'
import Footer from './components/Footer'
import OverOnsPage from './pages/OverOnsPage'
import ContactPage from './pages/ContactPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import DienstenPage from './pages/DienstenPage'
import DienstDetailPage from './pages/DienstDetailPage'
import SectorenPage from './pages/SectorenPage'
import ManagedContentPage from './pages/ManagedContentPage'
import RouteSeo from './seo/RouteSeo'
import ThemeStyles from './theme/ThemeStyles'

const AdminPage = lazy(() => import('./pages/AdminPage'))

function AdminRoute() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#141616', color: '#fff', fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Admin laden...
        </div>
      }
    >
      <AdminPage />
    </Suspense>
  )
}

function HomePage() {
  return (
    <>
      <HeroBanner />
      <WatFernaSection />
      <ClientLogosSection />
      <WatOnsAndersMaakt />
      <StatsSection />
      <OnzeSectorenSection />
      <ProjectenSlider />
      <UwProjectSection />
      <FaqSection />
    </>
  )
}

function PublicLayout() {
  return (
    <>
      <RouteSeo />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

function AppSkeleton() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <style>{`
        @keyframes fw-skeleton-pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
      <div
        style={{
          minHeight: '100vh',
          background: isAdmin ? '#f2f3f5' : '#ffffff',
          animation: 'fw-skeleton-pulse 1.6s ease-in-out infinite',
        }}
      >
        {isAdmin ? (
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <div style={{ width: '240px', background: '#141616' }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: '72px', background: '#ffffff', borderBottom: '1px solid #ebebeb' }} />
              <div style={{ padding: '28px 32px' }}>
                <div style={{ height: '22px', width: '220px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }} />
                <div style={{ height: '12px', width: '380px', background: '#eceef1', borderRadius: '999px', marginBottom: '28px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '18px', marginBottom: '24px' }}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} style={{ height: '108px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }} />
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '20px' }}>
                  <div style={{ height: '320px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }} />
                  <div style={{ height: '320px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ height: '78px', borderBottom: '1px solid #f1f1f1', background: '#ffffff' }} />
            <div style={{ background: '#141616', padding: '80px 24px' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ height: '56px', width: '48%', background: 'rgba(255,255,255,0.10)', borderRadius: '10px', marginBottom: '14px' }} />
                <div style={{ height: '56px', width: '42%', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', marginBottom: '28px' }} />
                <div style={{ height: '16px', width: '54%', background: 'rgba(255,255,255,0.10)', borderRadius: '999px', marginBottom: '12px' }} />
                <div style={{ height: '16px', width: '46%', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', marginBottom: '36px' }} />
                <div style={{ height: '48px', width: '220px', background: 'rgba(255,255,255,0.10)', borderRadius: '999px' }} />
              </div>
            </div>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px' }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} style={{ height: '220px', background: '#f5f5f5', borderRadius: '12px' }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function AppContent() {
  const { loading } = useCms()

  if (loading) {
    return <AppSkeleton />
  }

  return <AppRoutes />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/over-ons" element={<OverOnsPage />} />
        <Route path="/diensten" element={<DienstenPage />} />
        <Route path="/diensten/:slug" element={<DienstDetailPage />} />
        <Route path="/sectoren" element={<SectorenPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<ManagedContentPage />} />
        <Route path="/algemene-voorwaarden" element={<ManagedContentPage />} />
      </Route>
      <Route path="/admin/*" element={<AdminRoute />} />
    </Routes>
  )
}

function App({ RouterComponent = BrowserRouter, routerProps = {}, initialCms = null }) {
  return (
    <CmsProvider initialCms={initialCms}>
      <RouterComponent {...routerProps}>
        <ThemeStyles />
        <AppContent />
      </RouterComponent>
    </CmsProvider>
  )
}

export default App
