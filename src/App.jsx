import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import Home from "./pages/public/Home"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>A Propos - En construction</div>} />
              <Route path="/repertoire" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Repertoire - En construction</div>} />
              <Route path="/events" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Concerts - En construction</div>} />
              <Route path="/gallery" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Galerie - En construction</div>} />
              <Route path="/spirituality" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Spiritualite - En construction</div>} />
              <Route path="/blog" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Blog - En construction</div>} />
              <Route path="/contact" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Contact - En construction</div>} />
              <Route path="/login" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Login - En construction</div>} />
              <Route path="/admin" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Admin - En construction</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
