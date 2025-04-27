import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ServicesSection from "./pages/Services";
import Gallery from "./pages/Gallery";
import Footer from "./pages/Footer";
import BookService from "./pages/BookService";
import Success from "./pages/Success";

const App = () => {
  return (
    <div className="font-sans">
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
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
};

export default App;