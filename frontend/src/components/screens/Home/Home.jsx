import React from 'react';
import { Link, useLocation } from 'react-router-dom';
const ForestSchool = () => {
  const location = useLocation();
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden min-h-screen">
      {/* 1. Added the direct link to the icon font just in case */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-bg {
          background-image: url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80);
          background-size: cover;
                     background-position: center;
                      backdrop-filter: blur(40px)  brightness(0.7);
        }
      
.blurred-side {
  backdrop-filter: blur(40px)  brightness(0.7);
  background-color: rgba(255, 255, 255, 0.3); /* This adds the white tint */
}
        .text-reveal {
          background: url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80);
          background-size: cover;
          background-position: center;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: brightness(0.7) contrast(1.2);
        }
        /* Ensure icons are forced to render on top */
        .material-icons-outlined {
          display: inline-block;
          vertical-align: middle;
          line-height: 1;
        }
      `}} />

      <main className="relative h-screen w-full hero-bg overflow-hidden">
        {/* --- NEW: Blurred Background Layer --- */}
        <div className="absolute inset-0 z-0 hero-bg scale-105 blur-[2px] brightness-[0.8]"></div>
        {/* Left Side Blur - Fixed at z-10 */}
        <div className="absolute inset-y-0 left-0 w-[42%] blurred-side  z-10 border-r border-white/10"></div>

        {/* Content Container - Fixed at z-20 to be ABOVE the blur */}
        <div className="relative z-20 h-full flex flex-col px-12 py-10">
          



          <div className="flex-1 flex flex-col justify-center relative">
            <div className="relative w-full max-w-2xl mx-auto mb-10">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-4  px-6 rounded-full  backdrop-blur-sm bg-white/50 text-black text-lg focus:outline-none focus:ring-gray-500 focus:ring-1  shadow-xl"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-kewTeal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </button>
            </div>
            <div className="max-w-7xl mx-auto w-full">
              <h1 className="text-[7rem] font-black leading-[0.9]  tracking-tighter justify-center flex items-center">
                <span className="text-reveal">DIGITAL </span>
                <span className="text-white drop-shadow-2xl"> HERBARIUM</span>
              </h1>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4">
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
          </div>

          <div className="flex mb-8">
            <div className="w-[42%]">
              <p className="text-white/70 max-w-sm text-md leading-relaxed mb-5">
                There Is A Moment In The Life Of Any Times You Want. That Is Time To Visit This Forest
              </p>
              <a className="inline-flex items-center gap-4 text-sm font-bold tracking-widest hover:gap-6 transition-all group" href="#">
                READ MORE
                {/* Added 'text-white' to ensure the color isn't inherited as transparent */}
                <span className="material-icons-outlined text-white">east</span>
              </a>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex gap-4">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/10">
                <img alt="Forest 1" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400" />
              </div>
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/10">
                <img alt="Forest 2" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400" />
              </div>
              <div className="w-28 h-28 rounded-3xl overflow-hidden border border-white/10 shadow-xl">
                <img alt="Forest 3" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400" />
              </div>
            </div>

            <div className="flex gap-3">
              <button className="w-14 h-14 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors">
                <span className="material-icons-outlined text-white">west</span>
              </button>
              <button className="w-14 h-14 rounded-3xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/20 transition-colors">
                <span className="material-icons-outlined text-white">east</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForestSchool;