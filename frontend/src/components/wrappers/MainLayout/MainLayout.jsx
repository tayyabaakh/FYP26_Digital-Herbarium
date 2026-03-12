import { Outlet } from 'react-router-dom';
import Header from '../../commons/Header/Header';
import Footer from '../../commons/Footer/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        {/* This is where your different pages will load */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;