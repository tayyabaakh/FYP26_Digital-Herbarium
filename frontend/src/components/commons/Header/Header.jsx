// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import herbariumlogo from '../../../assets/logo.png';
// import herbariumlogo from '../../../assets/kuh_logo.png';
import herbariumlogo from '../../../assets/finallogo.png';



// export default Header;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Plants database', path: '/listing' },
    { name: 'Faculty and Staff', path: '/faculty-and-staff' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 sm:px-10 md:px-20 bg-white/30 backdrop-blur-[40px] backdrop-brightness-[0.7] border-b border-white/10 h-20">

        {/* 1. Logo Section */}
        <Link to="/home" className=" flex items-center group shrink-0 py-2  ">
          <img
            src={herbariumlogo}
            alt="Flora-Digitalis Icon"
            className="h-10 sm:h-12 md:h-16 w-auto object-contain object-left  scale-[2.0] duration-300"
          />
        </Link>

        {/* 2. Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold tracking-wider text-white/90">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`hover:text-green-400 uppercase pb-1 transition-all duration-200 border-b-2 ${isActive ? 'border-green-400 text-green-400' : 'border-transparent'
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Action Area (Desktop Portal) */}
        <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-white/20 text-sm font-black tracking-widest">
          <Link to="/login" className="text-white hover:text-green-400 transition-colors">PORTAL</Link>
        </div>

        {/* 4. Hamburger Trigger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 z-[110] text-white focus:outline-none bg-white/10 rounded-xl hover:bg-white/20 transition-all"
          aria-label="Toggle navigation menu"
        >
          <span className={`h-0.5 w-6 bg-white rounded-full transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-white rounded-full transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* 5. Mobile Dimmed Backdrop Overlay */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* 6. Clean Right-Side Sliding Drawer Panel */}
      {/* 6. Clean Right-Side Sliding Drawer Panel (Light Theme Edition) */}
      <div className={`fixed top-0 right-0 bottom-0 w-[280px] sm:w-[340px] bg-white/90 backdrop-blur-2xl border-l border-black/5 z-[95] p-8 pt-28 flex flex-col justify-between transition-transform duration-300 ease-out lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>

        {/* Drawer Links Stack */}
        <nav className="flex flex-col gap-4">
          <p className="text-[11px] font-black tracking-widest text-gray-400 uppercase mb-2 px-2">
            Navigation
          </p>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-bold uppercase tracking-wide transition-all duration-200 py-3 px-4 rounded-xl flex items-center justify-between group ${isActive
                    ? 'bg-green-600/10 text-green-700 font-black shadow-sm shadow-green-600/5'
                    : 'text-gray-800 hover:bg-black/5 hover:text-green-600'
                  }`}
              >
                {item.name}
                <span className={`material-icons-outlined text-sm opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 ${isActive ? 'opacity-100 translate-x-0 text-green-700' : 'text-green-600'
                  }`}>
                  east
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer Action (Portal Link) */}
        <div className="flex flex-col gap-4 mt-auto border-t border-black/5 pt-6">
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-center font-black tracking-widest text-sm shadow-lg shadow-green-700/20 transition-all active:scale-[0.98]"
          >
            PORTAL LOGIN
          </Link>
        </div>

      </div>
    </>
  );
};

export default Header;