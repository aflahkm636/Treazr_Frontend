import React from 'react';

const ImageBanner = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1593462823378-72a879f4712d?q=80&w=2070&auto=format&fit=crop",
      title: "Miniature Marvels",
      subtitle: "Discover the world of detailed diecast collectibles.",
    },
    {
      image: "https://images.unsplash.com/photo-1598974357801-cbca1b0e9d30?q=80&w=2070&auto=format&fit=crop",
      title: "Heroes & Legends",
      subtitle: "Bring home your favorite characters as action figures.",
    },
    {
      image: "https://images.unsplash.com/photo-1561053128-c1138b2a3c7a?q=80&w=2070&auto=format&fit=crop",
      title: "Ink & Adventure",
      subtitle: "Dive into classic stories with vintage comic books.",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000); // Increased interval for a more relaxed feel

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-4xl h-[500px] rounded-2xl shadow-2xl overflow-hidden group">
      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full relative">
            {/* Image with Ken Burns Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-[7000ms] ease-linear group-hover:scale-110"
                    style={{ transform: currentIndex === index ? 'scale(1.05)' : 'scale(1.2)' }}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
              <div className="overflow-hidden">
                  <h2
                    key={currentIndex} // Re-trigger animation on change
                    className="text-4xl md:text-6xl font-extrabold mb-2 animate-slide-up"
                    style={{ animationDelay: '0.3s' }}
                  >
                    {slide.title}
                  </h2>
              </div>
              <div className="overflow-hidden">
                 <p
                    key={currentIndex} // Re-trigger animation on change
                    className="text-lg md:text-xl font-light text-gray-200 animate-slide-up"
                    style={{ animationDelay: '0.5s' }}
                  >
                    {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Add a style tag for the animations */}
      <style>{`
        @keyframes slide-up {
            0% {
                transform: translateY(100%);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
        .animate-slide-up {
            animation: slide-up 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>
    </div>
  );
};

export default ImageBanner;

