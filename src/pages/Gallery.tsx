import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  { src: "/assets/gallery1.jpg", alt: "Gallery 1" },
  { src: "/assets/gallery2.jpg", alt: "Gallery 2" },
  { src: "/assets/gallery3.jpg", alt: "Gallery 3" },
  { src: "/assets/gallery4.jpg", alt: "Gallery 4" },
  { src: "/assets/gallery5.jpg", alt: "Gallery 5" },
];

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  const getImageClass = (index: number) => {
    if (index === activeIndex)
      return "w-[500px] h-[350px] border-2 border-amber-600 shadow-lg hover:shadow-2xl";
    if (
      index === (activeIndex + 1) % images.length ||
      index === (activeIndex - 1 + images.length) % images.length
    )
      return "w-[300px] h-[200px] blur-sm opacity-40 scale-90";
    return "hidden";
  };

  return (
    <>
      <section className="relative py-20 px-4 text-center bg-[#f6f0e6]">
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-[#2D1B13] mb-12">
            Galleria d'Arte del Barbiere
          </h2>

          <div className="relative flex justify-center items-center">
            {/* Left Arrow */}
            <button
              onClick={prev}
              className="absolute left-4 z-10 bg-white text-black rounded-full p-3 shadow hover:scale-110 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Carousel container */}
            <div className="w-full max-w-6xl flex justify-center overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`,
                  width: `${images.length * 100}%`,
                }}
              >
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex justify-center items-center w-full"
                    style={{ transition: "all 0.5s ease-in-out" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className={`
                        object-cover rounded-xl transition-all duration-500
                        ${getImageClass(index)}
                      `}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={next}
              className="absolute right-4 z-10 bg-white text-black rounded-full p-3 shadow hover:scale-110 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Elegant subtle divider */}
      <div className="w-full flex justify-center items-center mb-[-1px]">
        <div className="h-[1px] w-[160px] bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
      </div>
    </>
  );
}

export default Gallery;