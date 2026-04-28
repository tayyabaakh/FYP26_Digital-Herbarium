import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Plants database', path: '/listing' },
    { name: 'Faculty and Staff', path: '/faculty-and-staff' },
    // { name: 'Plant Contributor ', path: '/plant-contributor' },
    // { name: 'Guidelines', path: '/guidelines' },

    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },

    

  ];

  return (
  <header className="fixed top-0  left-0 right-0 z-[100] flex items-center justify-between px-12 py-6 bg-white/30 backdrop-blur-[40px] backdrop-brightness-[0.7] border-b border-none">
  {/* 1. Logo Section (Left) */}
  <Link to="/home" className="flex flex-col items-center group">
    <span className="text-[10px] tracking-[0.3em] font-black uppercase mt-1 text-white">
      ForestSchool
    </span>
  </Link>

  {/* 2. Navigation & Actions (Right) */}
  <div className="flex items-end gap-5">
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`text-[11px] font-bold uppercase transition-all duration-300 relative group ${
              isActive ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {item.name}
            {/* Modern Underline Indicator */}
            <span
              className={`absolute -bottom-2 left-0 h-[2px] bg-white transition-all duration-500 ${
                isActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            ></span>
          </Link>
        );
      })}
    </nav>

    {/* Vertical Divider */}
    <div className="h-6 w-[1px] bg-white/20"></div>

    {/* Profile/Portal Icon */}
    <button className="flex items-center gap-3 group">
      <span className="text-[10px] tracking-[0.2em] font-black uppercase text-white/60 group-hover:text-white transition-colors">
        Portal
      </span>
    </button>
  </div>
</header>
  );
};

export default Header;