"use client";

import { useState, useEffect } from "react";

export default function DevBanner() {
  const [dots, setDots] = useState(".");
  const [timeLeft, setTimeLeft] = useState({});
 
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Countdown logic (fixed target date)
  useEffect(() => {
    const targetDate = new Date("2025-10-24T23:59:59");

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-4">
     
     
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-center drop-shadow-lg">
        WebApp Page Under Development
      </h1>

      {/* Sub Text */}
      <p className="text-lg sm:text-xl md:text-2xl text-center mb-6">
        Coming Soon{dots}
      </p>

      {/* Countdown */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-center">
        {["days", "hours", "minutes", "seconds"].map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white/20 backdrop-blur-md px-4 py-3 md:px-5 md:py-4 rounded-xl shadow-lg min-w-[70px] sm:min-w-[90px]"
          >
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              {timeLeft[unit] !== undefined ? timeLeft[unit] : "0"}
            </span>
            <span className="uppercase text-xs sm:text-sm md:text-base">
              {unit}
            </span>
          </div>
        ))}
      </div>

      {/* Animated bars */}
      <div className="flex mt-12 space-x-3">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="block w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></span>
        ))}
      </div>
    </div>
  );
}
