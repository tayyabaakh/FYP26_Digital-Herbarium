import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-4">
        <div className="grid grid-cols-3 gap-1"> {/* Mock Grid Icon */}
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-800 rounded-sm"></div>
          ))}
        </div>
        <div className="flex items-center border-l border-black pl-4 h-12">
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-light">Royal Botanic Gardens</span>
            <span className="text-3xl font-serif font-bold tracking-tight">Kew</span>
          </div>
          <div className="ml-4 border-l border-gray-300 pl-4 text-[#008080] font-medium leading-tight">
            Plants of the <br /> World Online
          </div>
        </div>
      </div>

      <nav className="flex items-center space-x-8 text-[#008080] font-semibold">
        <Link to="/" className="hover:underline">HOME</Link>
        <div className="flex items-center cursor-pointer">DATA <span className="ml-1 text-xs">▼</span></div>
        <div className="flex items-center cursor-pointer">ABOUT <span className="ml-1 text-xs">▼</span></div>
        <div className="flex items-center cursor-pointer">MORE <span className="ml-1 text-xs">▼</span></div>
        <Link to="/contact" className="hover:underline text-black">CONTACT</Link>
      </nav>
    </header>
  );
};

export default Header;