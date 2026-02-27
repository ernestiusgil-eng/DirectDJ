
import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 48 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Headphones + Location Pin Mockup */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8a00" />
              <stop offset="50%" stopColor="#da1b60" />
              <stop offset="100%" stopColor="#2b57ff" />
            </linearGradient>
          </defs>
          {/* Pin shape */}
          <path d="M50 95C50 95 85 60 85 35C85 15.67 69.33 0 50 0C30.67 0 15 15.67 15 35C15 60 50 95 50 95Z" fill="url(#logoGrad)" />
          {/* Headphones arcs */}
          <path d="M30 35C30 24 39 15 50 15C61 15 70 24 70 35" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <rect x="25" y="35" width="10" height="15" rx="3" fill="white" />
          <rect x="65" y="35" width="10" height="15" rx="3" fill="white" />
          {/* Play button */}
          <path d="M45 30L60 38L45 46V30Z" fill="white" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-extrabold tracking-tight text-white">Direct<span className="text-sky-400">DJ</span></span>
      </div>
    </div>
  );
};
