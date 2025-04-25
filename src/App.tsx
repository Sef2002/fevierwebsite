// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ServicesSection from "./pages/Services";
import Gallery from "./pages/Gallery";
import Footer from "./pages/Footer";
import BookService from "./pages/BookService";

const App = () => {
  return (
    <div className="font-sans">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <ServicesSection />
                <Gallery />
                <Footer />
              </>
            }
          />
          <Route path="/book" element={<BookService />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;