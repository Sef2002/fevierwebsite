import React from "react"
import { motion } from "framer-motion"

const services = [
  {
    title: "Barba",
    description: "Precisione millimetrica, stile inconfondibile.",
    image: "assets/feiverbarbercuttingscissor.png",
  },
  {
    title: "Taglio",
    description: "Tagli su misura per ogni personalità.",
    image: "assets/feviercut.png",
  },
  {
    title: "Sfumatura",
    description: "Transizioni perfette, look iconico.",
    image: "assets/feiderfade.png",
  },
  {
    title: "Rituale",
    description: "Esperienza sensoriale completa per uomo.",
    image: "assets/fevierpremium.png",
  },
  {
    title: "Luxury",
    description: "Servizi premium per un tocco esclusivo.",
    image: "assets/feiverluxury.png",
  },
  {
    title: "Bambini",
    description: "Tagli pensati per i più piccoli con stile e comfort.",
    image: "assets/feiverkids.png",
  },
]

const ServicesSection = () => {
  return (
    <div className="relative w-full py-24 px-6 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('assets/feiversfondo.png')" }}>
      
      {/* Overlay for softening effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

      {/* Content layered above the overlay */}
      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <img
            src="assets/Feiver logo.png"
            alt="divider icon"
            className="w-8 h-8"
          />
        </div>
        <h2 className="text-4xl font-bold text-yellow-500 text-center mb-2">
          I NOSTRI SERVIZI
        </h2>
        <p className="text-center max-w-2xl mx-auto text-sm text-white mb-12">
          Eleganza, tradizione e tecnica. Scopri l'anima del nostro lavoro.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.3, zIndex: 10 }}
              transition={{ type: "tween", duration: 0.15, ease: "linear" }}
              className="relative rounded-lg overflow-hidden group shadow-md transition-transform origin-center"
              style={{ zIndex: 0 }}
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-72 object-cover"
              />
              <div className="absolute bottom-0 w-full bg-black/60 p-4 text-center">
                <h3 className="text-lg font-bold text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServicesSection