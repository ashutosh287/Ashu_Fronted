// MainLayout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import {Navbar , Footer} from './AllComponents'


const MainLayout = () => {
  const { pathname } = useLocation();

  // pages where navbar & footer should be hidden
  const hideLayoutOn = ["/register", "/UserLogin", "/signup", "/login"];
  const hideLayout = hideLayoutOn.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {!hideLayout && <Navbar />}
      <main className="min-h-[80vh]">
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default MainLayout;

