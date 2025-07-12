import React, { useEffect, useRef, useState } from 'react';
import SearchBar from "./SearchBar";

const carouselImages = [
  "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
  "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
  "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
  "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        ),
      5000 // Change slide every 5 seconds
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const goToNextSlide = () => {
    const isLastSlide = currentIndex === carouselImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToPrevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? carouselImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Carousel Track - This will move */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselImages.map((imgSrc, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <img src={imgSrc} className="w-full h-full object-cover" alt={`Hero slide ${index + 1}`} />
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-20">
        <button
          onClick={goToPrevSlide}
          className="btn btn-circle bg-white bg-opacity-20 border-none text-white hover:bg-opacity-40 transition-colors duration-200"
          aria-label="Go to previous slide"
        >
          ❮
        </button>
        <button
          onClick={goToNextSlide}
          className="btn btn-circle bg-white bg-opacity-20 border-none text-white hover:bg-opacity-40 transition-colors duration-200"
          aria-label="Go to next slide"
        >
          ❯
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 md:px-10 lg:px-20 z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-shadow-md text-center">
          Unlock your potential with courses built to{" "}
          <span className="text-blue-300">ignite your passion.</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-center text-shadow-sm">
          Learn from top instructors, explore real-world projects, and join a
          global community — all designed to guide you toward success 🚀
        </p>
        <SearchBar />
      </div>
    </div>
  );
};

export default Hero;