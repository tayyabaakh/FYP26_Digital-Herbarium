const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="hover:underline text-gray-400">Terms and conditions</a>
          <a href="#" className="hover:underline text-gray-400">Privacy</a>
          <a href="#" className="hover:underline text-gray-400">Cookies</a>
          <a href="#" className="hover:underline text-gray-400">Accessibility</a>
          <a href="#" className="hover:underline text-gray-400">Modern slavery</a>
        </div>
        <div>
          © Board of Trustees of the Royal Botanic Gardens, Kew
        </div>
      </div>
      <div className="bg-black py-4 text-center">
        <a href="https://kew.org" target="_blank" className="font-bold hover:underline">Visit kew.org</a>
      </div>
    </footer>
  );
};

export default Footer;