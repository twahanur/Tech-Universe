import React from 'react';
import YouTube from 'react-youtube';
import { assets } from '../../assets/assets'; // Adjust path if needed

const VideoModal = ({ videoId, onClose }) => {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 z-10"
        >
          <img src={assets.cross_icon} alt="Close" className="w-4 h-4" />
        </button>
        
        {/* The only change is in the line below */}
        <div className="aspect-video"> 
          <YouTube videoId={videoId} opts={opts} className="w-full h-full absolute" />
        </div>

      </div>
    </div>
  );
};

export default VideoModal;