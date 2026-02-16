import React from 'react';
import d1 from '../assets/img/d1.png'
import d2 from '../assets/img/d2.png'
import d3 from '../assets/img/d3.png'
import d4 from '../assets/img/d4.png'
import d5 from '../assets/img/d5.png'
import d6 from '../assets/img/d6.png'
import d7 from '../assets/img/d7.png'
import d8 from '../assets/img/d8.png'
import d9 from '../assets/img/d9.png'
import d10 from '../assets/img/d10.png'
import d11 from '../assets/img/d11.png'
import d12 from '../assets/img/d12.png'
import d13 from '../assets/img/d13.png'
import d14 from '../assets/img/d14.png'
import d15 from '../assets/img/d15.png'
import d16 from '../assets/img/d16.png'
import d17 from '../assets/img/d17.png'
import d18 from '../assets/img/d18.png'
import d19 from '../assets/img/d19.png'
import d20 from '../assets/img/d20.png'
import d21 from '../assets/img/d21.png'
import d22 from '../assets/img/d22.png'
import d23 from '../assets/img/d23.png'
import d24 from '../assets/img/d24.png'
import d25 from '../assets/img/d25.png'
import d26 from '../assets/img/d26.png'
import d27 from '../assets/img/d27.png'
import d28 from '../assets/img/d28.png'
import d29 from '../assets/img/d29.png'
import d30 from '../assets/img/d30.png'  
//  cvd
import d31 from '../assets/img/d31.png'
import d32 from '../assets/img/d32.png'
import d34 from '../assets/img/d34.png'
import d35 from '../assets/img/d35.png'
import d36 from '../assets/img/d36.png'
import d37 from '../assets/img/d37.png'
import d38 from '../assets/img/d38.png'
import d39 from '../assets/img/d39.png'
import d40 from '../assets/img/d40.png'
import d41 from '../assets/img/d41.png'
import d42 from '../assets/img/d42.png'
import d43 from '../assets/img/d43.png'
import d44 from '../assets/img/d44.png'
import d45 from '../assets/img/d45.png'
import d46 from '../assets/img/d46.png'
import d47 from '../assets/img/d47.png'
import d48 from '../assets/img/d48.png'
import d49 from '../assets/img/d49.png'
import d50 from '../assets/img/d50.png'

export default function GamesGrid() {
  const games = [
    { src: d1, name: "20-20 Teenpatti C" },
    { src: d2, name: "20-20 Teenpatti VIP1" },
    { src: d3, name: "Bollywood Casino 2" },
    { src: d4, name: "Beach Roulette" },
    { src: d5, name: "Dolidana" },
    { src: d6, name: "Golden Roulette" },
  { src: d7, name: "Matka" },
    { src: d8, name: "MOGAMBO" },
    { src: d9, name: "ROULETTE" },
  { src: d10, name: " TEENPATTI JOKER 20" },
    { src: d11, name: "POISON TEENPATTI 1 DAY" },
    { src: d12, name: "POISON TEENPATTI 20" },
  { src: d13, name: "UNIQUE TEENPATTI" },
    { src: d14, name: "UNLIMITED JOKER 20" },
    { src: d15, name: "UNLIMITED JOKER 1 DAY " },
    { src: d16, name: "VIP TEENPATTI 1DAY" },
    { src: d17, name: "UNIQUE ROULETTE" },
    { src: d18, name: "SUPER OVER" },
    { src: d19, name: "GOAL" },
    { src: d20, name: "ANDAR BAHAR" },
    { src: d21, name: "GOAL " },
    { src: d22, name: "ANDAR BAHAR" },
    { src: d23, name: "LUCKY 15" },{ src: d24, name: "SUPER OVER 2" },
    { src: d25, name: "QUEEN TOP OPEN " },
       { src: d26, name: "JACK TOP OPEN " },
    { src: d27, name: "DOUBLE SICBO" },
            { src: d31, name: "SICBO" },
    { src: d34, name: " TEENPATTI 3.0" },

    // { src: d28, name: "VIP TEENPATTI" },{ src: d29, name: "VIP TEENPATTI" },
    { src: d30, name: "SICBO" },
    { src: d32, name: "BALL BY BALL" },
    { src: d35, name: " TEENPATTI 1 DAY" },
    { src: d36, name: " TEENPATTI 20 20 " },
  { src: d37, name: "TEENPATTI TEST" },
    { src: d38, name: "OPEN TEENPATTI" },
    { src: d39, name: "POKER 1 DAY" },
  { src: d40, name: "POKER 1 DAY" },
   { src: d41, name: "POKER 6 PLAYER" },
    { src: d42, name: "BACCARAT" },
    { src: d43, name: "ONLINE BACCARAT" },
    { src: d44, name: "20 20 DRAGEN TIGER " },
    { src: d45, name: "20 20 DRAGEN TIGER1" },
    { src: d46, name: "20 20 DRAGEN TIGER2" },
  { src: d47, name: "32 CARDS-A" },
    { src: d48, name: "32 CARDS -B" },
    { src: d49, name: "ANDAR BAHAR" },
  { src: d50, name: "ANDAR BAHAR-2" },
    // ... add remaining games here
    // You can continue the list with all 60+ items
  ];


  return (
    <div className="w-full flex flex-col h-[calc(100vh-250px)] lg:h-auto">
      {/* Title/Header for the section if needed */}
      <div className="bg-gray-800 text-white px-4 py-1 text-sm font-bold">
        CASINO GAMES
      </div>

      {/* SCROLLABLE CONTAINER 
          h-[calc(100vh-300px)] ensures it fits within the mobile viewport 
          without making the whole body scroll.
      */}
      <div className="flex-1 overflow-y-auto p-1 bg-gray-200 custom-scrollbar">
        <div className="
          grid 
          grid-cols-2          /* 2 columns on mobile = 4 cards visible in a small area */
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          xl:grid-cols-10     /* 10 columns on large screens */
          gap-1
        ">
          {games.map((game, index) => (
            <a
              key={index}
              href="#"
              className="group block overflow-hidden bg-gray-800 transition-all duration-200 shadow-sm"
            >
              <div className="aspect-square relative">
                <img
                  src={game.src}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <div className="p-1 text-center bg-gradient-to-b from-[#2fa4d8] via-[#0b6fa8] to-[#063f63]">
                <p className="text-white text-[10px] sm:text-xs font-semibold truncate">
                  {game.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}