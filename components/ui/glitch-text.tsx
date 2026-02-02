"use client";

import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <h1
        className={`
          text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider
          bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500
          bg-clip-text text-transparent
          transition-all duration-200
          ${glitchActive ? "glitch-active" : ""}
        `}
        data-text={text}
      >
        {text}
      </h1>
      <style jsx>{`
        h1 {
          position: relative;
          text-shadow: 
            0 0 10px rgba(0, 255, 255, 0.5),
            0 0 20px rgba(0, 255, 255, 0.3),
            0 0 30px rgba(0, 255, 255, 0.2);
        }

        h1::before,
        h1::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0;
        }

        h1.glitch-active::before {
          animation: glitch-1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
          color: #00ffff;
          z-index: -1;
        }

        h1.glitch-active::after {
          animation: glitch-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
          color: #ff00ff;
          z-index: -2;
        }

        @keyframes glitch-1 {
          0% {
            transform: translate(0);
            opacity: 0;
          }
          20% {
            transform: translate(-2px, 2px);
            opacity: 1;
          }
          40% {
            transform: translate(-2px, -2px);
            opacity: 1;
          }
          60% {
            transform: translate(2px, 2px);
            opacity: 1;
          }
          80% {
            transform: translate(2px, -2px);
            opacity: 1;
          }
          100% {
            transform: translate(0);
            opacity: 0;
          }
        }

        @keyframes glitch-2 {
          0% {
            transform: translate(0);
            opacity: 0;
          }
          20% {
            transform: translate(2px, -2px);
            opacity: 1;
          }
          40% {
            transform: translate(2px, 2px);
            opacity: 1;
          }
          60% {
            transform: translate(-2px, -2px);
            opacity: 1;
          }
          80% {
            transform: translate(-2px, 2px);
            opacity: 1;
          }
          100% {
            transform: translate(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
