import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { assets } from '../../assets/assets'; // Adjust the import path to your assets file
import VideoModal from './VideoModal';

// Helper component for the statistics
const StatItem = ({ value, label, subLabel }) => (
  <div>
    <p className="text-3xl sm:text-4xl font-bold text-teal-600">{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
    {subLabel && <p className="text-xs text-gray-400">{subLabel}</p>}
  </div>
);

// Main component
const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Replace with your YouTube Video ID
  const YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ';

  return (
    <>
      <section className="relative bg-amber-50 py-20 sm:py-24 lg:py-32">
        {/* Wavy background shape at the top */}
        <div className="absolute top-0 left-0 w-full h-20 sm:h-32" style={{ transform: 'translateY(-100%)' }}>
          <svg className="w-full h-full text-amber-50" preserveAspectRatio="none" viewBox="0 0 1440 120">
            <path d="M0,120 C288,30 1152,180 1440,60 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-gray-500 tracking-wider">( ABOUT US )</p>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
              Watch Our Demo Video
            </h2>
          </div>

          {/* Video Thumbnail Section */}
          <div className="relative max-w-4xl mx-auto mt-12 sm:mt-16">
            <div className="relative rounded-2xl shadow-2xl overflow-hidden">
              <img src={assets.course_4} alt="Video Thumbnail" className="w-full h-auto" />
              <div
                onClick={() => setIsModalOpen(true)}
                className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center cursor-pointer group"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center">
                    <img src={assets.play_icon} alt="Play Video" className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Dots */}
            <div className="absolute -top-4 -right-4 sm:-right-8 lg:-right-16 hidden lg:block" aria-hidden="true">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats and CTA Section */}
          <div className=" mx-auto mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Text and CTA */}
            <div className="text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Trusted By The 20,000+ Happy Students and Online Users Since 2024
              </h3>
              <button className="mt-8 inline-flex items-center gap-3 px-8 py-3 bg-teal-700 text-white font-semibold rounded-full hover:bg-teal-800 transition-colors duration-300 shadow-lg">
                JOIN OUR COMMUNITY
                <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4" />
              </button>
            </div>
            {/* Right Column: Stats Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 text-center lg:text-left">
              <StatItem value="10.2K" label="Student Enrolled" />
              <StatItem value="32.5K" label="Class Completed" />
              <StatItem value="450+" label="Top Instructors" />
              <StatItem value="4.8" label="Review by Google" />
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && <VideoModal videoId={YOUTUBE_VIDEO_ID} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default AboutUs;