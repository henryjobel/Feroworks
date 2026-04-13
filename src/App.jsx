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
import AdminPage from './pages/AdminPage'

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
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  return (
    <CmsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/over-ons" element={<OverOnsPage />} />
            <Route path="/diensten" element={<DienstenPage />} />
            <Route path="/diensten/:id" element={<DienstDetailPage />} />
            <Route path="/sectoren" element={<SectorenPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </CmsProvider>
  )
}

export default App
