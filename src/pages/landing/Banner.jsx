import React from "react";
import { useNavigate } from "react-router-dom";

function Banner() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[55vh] sm:min-h-[70vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950 overflow-hidden mb-8">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Background Image */}
      <img
        src="https://i.pinimg.com/736x/1c/47/33/1c4733a320b6797408c0491aa8b8dabc.jpg"
        alt="Treazr Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 py-20">
        <div className="space-y-8 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mt-6">
            Treasure Hunt Starts{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Here
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Discover the world's most sought-after collectibles. From vintage diecast to rare comics — every piece tells a story.
          </p>

          <div className="pt-6">
            <button
              onClick={() => navigate("/products")}
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full border border-cyan-500/50 backdrop-blur-sm hover:from-cyan-600/40 hover:to-purple-600/40 text-cyan-300 font-semibold transition-all duration-300"
            >
              Explore Now →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
