import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-950 z-[9999] flex flex-col justify-center items-center gap-6 p-4">
      
      {/* Animated Core Spinner */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer Glowing Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin" />
        
        {/* Inner Counter-Rotating Ring */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-green-500/40 animate-spin [animation-duration:1.5s] direction-reverse" />
        
        {/* Soft Center Pulse Ambient Glow */}
        <div className="w-6 h-6 rounded-full bg-emerald-500/30 blur-sm animate-pulse" />
      </div>

      {/* Typography Brand Subtext Block */}
      <div className="text-center space-y-2 animate-pulse [animation-duration:2s]">
        <h2 className="text-white font-black tracking-[0.25em] text-sm sm:text-base uppercase">
          KUH
        </h2>
        <p className="text-emerald-400/70 font-medium tracking-widest text-[10px] uppercase">
          Loading Herbarium Database...
        </p>
      </div>

      {/* Minimal Structural Loading Bar Bottom Indication */}
      <div className="w-24 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-green-500 to-emerald-400 w-1/2 rounded-full animate-[loading-bar_1.8s_infinite_ease-in-out]" />
      </div>

      {/* Inline Custom CSS Injection for Keyframe Animations */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 60%; }
          100% { transform: translateX(350%); width: 30%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;