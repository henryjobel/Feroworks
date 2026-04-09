import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroBanner from './components/HeroBanner'
import WatFernaSection from './components/WatFernaSection'
import ClientLogosSection from './components/ClientLogosSection'

function HomePage() {
  return (
    <>
      <HeroBanner />
      <WatFernaSection />
      <ClientLogosSection />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/over-ons" element={<div>Over Ons</div>} />
        <Route path="/diensten" element={<div>Diensten</div>} />
        <Route path="/sectoren" element={<div>Sectoren</div>} />
        <Route path="/blog" element={<div>Blog</div>} />
        <Route path="/contact" element={<div>Contact</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
