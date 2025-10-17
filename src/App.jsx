import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<div className="container mx-auto px-4 py-20">A Propos - En construction</div>} />
              <Route path="/repertoire" element={<div className="container mx-auto px-4 py-20">Repertoire - En construction</div>} />
              <Route path="/events" element={<div className="container mx-auto px-4 py-20">Concerts - En construction</div>} />
              <Route path="/gallery" element={<div className="container mx-auto px-4 py-20">Galerie - En construction</div>} />
              <Route path="/spirituality" element={<div className="container mx-auto px-4 py-20">Spiritualite - En construction</div>} />
              <Route path="/blog" element={<div className="container mx-auto px-4 py-20">Blog - En construction</div>} />
              <Route path="/contact" element={<div className="container mx-auto px-4 py-20">Contact - En construction</div>} />
              <Route path="/login" element={<div className="container mx-auto px-4 py-20">Login - En construction</div>} />
              <Route path="/admin" element={<div className="container mx-auto px-4 py-20">Admin - En construction</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
