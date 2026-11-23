import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0b1612] text-emerald-50 border-t border-emerald-900/40 pt-16 pb-12 px-6 md:px-20 font-display">
      {/* Import Material Symbols locally so icons render correctly */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
        
        {/* Section 1: Logo / About */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/60 border border-emerald-700/50 flex items-center justify-center text-emerald-300 shadow-sm">
              <span className="material-symbols-outlined text-lg">eco</span>
            </div>
            <span className="text-xl font-bold tracking-[0.25em] text-white">KUH</span>
          </div>
          <p className="text-emerald-100/70 text-xs sm:text-sm leading-relaxed max-w-[280px]">
            Advancing the understanding of Karachi's flora through digital excellence and botanical preservation.
          </p>
        </div>

        {/* Section 2: Contact Info */}
        <div className="flex flex-col gap-5">
          <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Contact Us</h5>
          <ul className="flex flex-col gap-3.5 text-xs sm:text-sm text-emerald-100/80 font-medium">
            <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-base text-emerald-500 group-hover:scale-110 transition-transform">mail</span>
              <span>cpc@uok.edu.pk</span>
            </li>
            <li className="flex items-center gap-3 group">
              <span className="material-symbols-outlined text-base text-emerald-500">call</span>
              <span>+92 21 99261300 ext: 2557</span>
            </li>
            <li className="flex items-start gap-3 group">
              <span className="material-symbols-outlined text-base text-emerald-500 mt-0.5">location_on</span>
              <span>Main University Rd, Karachi</span>
            </li>
          </ul>
        </div>

        {/* Section 3: External Links */}
        <div className="flex flex-col gap-5">
          <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-400">External Links</h5>
          <ul className="flex flex-col gap-3.5 text-xs sm:text-sm text-emerald-100/80 font-medium">
          
            <li>
              <a 
                href="https://www.uok.edu.pk/institute-cpc"
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Centre for Plant Conservation</span>
                <span className="material-symbols-outlined text-xs opacity-60">open_in_new</span>
              </a>
            </li>
          </ul>
        </div>

    

      </div>

      {/* Bottom Copyright Strip */}
      <div className="max-w-[1200px] mx-auto border-t border-emerald-900/60 mt-14 pt-8 text-[11px] tracking-wider text-emerald-100/40 font-medium flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 KUH | Powered by Muneer Khan</p>
        <div className="flex gap-6">
          <a className="hover:text-emerald-200 transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-emerald-200 transition-colors" href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;