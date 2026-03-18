const Footer = () => {
  return (
         <footer className="bg-black backdrop-blur-xl border-t border-white/5 py-16 px-6 md:px-20 ">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white">eco</span>
              <span className="text-xl text-white font-bold uppercase tracking-[0.3em]">KUH</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-[300px]">
              Advancing the understanding of Karachi's flora through digital excellence and botanical preservation.
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            <h5 className="text-sm font-bold text-white uppercase tracking-widest">Contact</h5>
            <ul className="flex flex-col gap-4 text-sm text-white/60 font-medium">
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-base">mail</span>
                <span>cpc@uok.edu.pk</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base">call</span>
                <span>+99261300-7 ext: 2557</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Main University Rd, Karachi</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h5 className="text-sm font-black text-white uppercase tracking-widest">Newsletter</h5>
            <div className="flex gap-2">
              <input className="bg-white/5 border border-white rounded-full px-5 py-3 text-xs w-full outline-none focus:ring-1 focus:ring-white text-white transition-all" placeholder="Your email" type="email"/>
              <button className="bg-white text-black p-3 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto border-t border-white/5 mt-16 pt-8 text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 KUH | Powered by Muneer Khan</p>
          <div className="flex gap-8">
            <a className="hover:text-white transition-colors" href="#">Privacy</a>
            <a className="hover:text-white transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>
  );
};

export default Footer;