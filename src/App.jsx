import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { CmsProvider } from './cms/CmsContext'
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
        <AppRoutes />
      </RouterComponent>
    </CmsProvider>
  )
}

export default App
