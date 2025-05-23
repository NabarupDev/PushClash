import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Battle from './pages/Battle'
import Roast from './pages/Roast'
import Portfolio from './pages/Portfolio'
import LeetCode from './pages/LeetCode'
import LeetCodeBattle from './pages/LeetCodeBattle'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Navbar />
        <main className="flex-grow py-6">
          <div className="page-transition">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/battle" element={<Battle />} />
              <Route path="/roast" element={<Roast />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/leetcode" element={<LeetCode />} />
              <Route path="/leetcode-battle" element={<LeetCodeBattle />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
