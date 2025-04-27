import React from "react";

const barbers = [
  {
    name: "Luca",
    description: "Esperto in tagli classici e barba con panno caldo.",
    image: "/assets/barber1.jpg",
  },
  {
    name: "Marco",
    description: "Specializzato in sfumature moderne e look personalizzati.",
    image: "/assets/barber2.jpg",
  },
  {
    name: "Alessandro",
    description: "Precisione assoluta nei dettagli e trattamenti luxury.",
    image: "/assets/barber3.jpg",
  },
];

const Barbers = () => {
  return (
    <div className="w-screen h-screen bg-[#f6f0e6] flex flex-col justify-start items-center overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#2D1B13] mt-12 mb-8">
        Prenota con uno dei nostri barbieri
      </h1>

      <div className="w-full max-w-7xl px-6 flex-grow flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {barbers.map((barber, index) => (
            <div
              key={index}
              className="bg-white shadow-md border border-[#2D1B13]/20 rounded-xl overflow-hidden text-center hover:shadow-lg transition w-full"
            >
              <img
                src={barber.image}
                alt={barber.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2D1B13]">
                  {barber.name}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{barber.description}</p>
                <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition">
                  Prenota con {barber.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Barbers;