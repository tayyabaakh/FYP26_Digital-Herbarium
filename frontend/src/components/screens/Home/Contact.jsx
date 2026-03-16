import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#0a0c0a] text-white font-sans relative overflow-hidden flex items-center justify-center px-6">
      
      {/* 1. The "Blurry BG" Elements */}
      <div className="absolute inset-0 z-0">
        {/* Soft radial glow instead of solid green */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-800/10 blur-[150px] rounded-full"></div>
      </div>

      {/* 2. The Main Glass Container */}
      <main className="relative z-10 w-full max-w-5xl backdrop-blur-[100px] bg-white/[0.03] border border-white/10 rounded-[40px] p-8 md:p-16 shadow-2xl flex flex-col md:flex-row gap-16">
        
        {/* Left Side: Information */}
        <div className="flex-1 space-y-10">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">
              Contact <span className="text-white/20">Us</span>
            </h1>
            <div className="h-1 w-12 bg-white/20 rounded-full"></div>
          </div>

          <div className="space-y-8">
            {/* Web Page Section */}
            <div className="group">
              <h3 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-3">Web page</h3>
              <ul className="text-white/80 space-y-2 text-sm italic">
                <li className="hover:text-white transition-colors cursor-pointer">www.karuniherb.pk</li>
                <li className="hover:text-white transition-colors cursor-pointer break-all">uok.edu.pk/research_institutes/cpc/</li>
              </ul>
            </div>

            {/* Phone Section */}
            <div>
              <h3 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Phone</h3>
              <p className="text-white font-bold text-xl tracking-tight">+99261300-7 <span className="opacity-30">ext: 2557</span></p>
            </div>

            {/* Email Section */}
            <div>
              <h3 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Email address</h3>
              <p className="text-white font-bold text-lg hover:underline decoration-white/20 underline-offset-8">cpc@uok.edu.pk</p>
            </div>
          </div>

          {/* Minimalist Socials */}
          <div className="flex gap-4 pt-6">
            <div className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
              <span className="material-icons-outlined text-sm">public</span>
            </div>
            <div className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
              <span className="material-icons-outlined text-sm">share</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Form */}
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="group">
               <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
              />
            </div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
            />
            <textarea 
              rows="5" 
              placeholder="Message" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white/40 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 resize-none"
            ></textarea>
          </div>
          
          <button className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
            Send Message
          </button>
        </div>
      </main>

      {/* Brand Watermark */}
      <div className="absolute bottom-10 right-10 opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[12vw] font-black leading-none uppercase">Contact</h2>
      </div>
    </div>
  );
};

export default Contact;