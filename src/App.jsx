import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import Home from "./pages/public/Home"
import About from "./pages/public/About"
import Repertoire from "./pages/public/Repertoire"
import Concerts from "./pages/public/Concerts"
import Galerie from "./pages/public/Galerie"
import Spiritualite from "./pages/public/Spiritualite"
import Blog from "./pages/public/Blog"
import Contact from "./pages/public/Contact"
import Login from "./pages/public/Login"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/repertoire" element={<Repertoire />} />
              <Route path="/events" element={<Concerts />} />
              <Route path="/gallery" element={<Galerie />} />
              <Route path="/spirituality" element={<Spiritualite />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<div style={{ padding: "80px 20px 20px 20px", textAlign: "center" }}>Administration - En construction</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
