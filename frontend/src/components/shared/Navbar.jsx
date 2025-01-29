import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { User2, LogOut } from 'lucide-react';
import { AlignJustify } from 'lucide-react';
import Menu from './Menu';

const Navbar = () => {
  const user = false;
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [menu, setMenu] = React.useState(false);

  let toggle = () => {
    setMenu(!menu);
  };

  const handleLogin = () => {
    navigate('/login');
  };
  const handleSignup = () => {
    navigate('/signup');
  };
  const handleHome = () => {
    navigate('/');
  };
  const handleDash = () => {
    navigate('/dashboard');
  };
  const handleComplaint = () => {
    navigate('/complain');
  };
  const handleDatabase = () => {
    navigate('/database');
  };
  const handleComm = () => {
    navigate('/incidents');
  };
  const handleroutes = () => {
    navigate('/routemaps');
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-[#115579] text-white rounded-lg py-2 px-4 transition-all duration-300'
      : 'hover:bg-[#115579] hover:text-white rounded-lg py-2 px-4 transition-all duration-300'; // Improved hover and active styling

  return (
    <div className="bg-[#E6E6E6] shadow-lg">
      <div className="flex justify-between w-full max-w-[1200px] mx-auto py-4 px-6 items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link to="/home" className='flex gap-2'>
            <img src="./src/assets/logo.png" class="h-8" alt="Flowbite Logo" className='rounded-full w-10' />
            <span className="text-[#115579] text-2xl font-semibold">ReUnite</span>
          </Link>
        </div>

        {/* Navbar Links */}
        <div className="flex items-center space-x-6">
          <ul className="hidden md:flex space-x-6">
            <li className={`${isActive('/dashboard')} cursor-pointer`} onClick={handleDash}>
              Dashboard
            </li>
            <li className={`${isActive('/complain')} cursor-pointer`} onClick={handleComplaint}>
              Post a Complaint
            </li>
            <li className={`${isActive('/incidents')} cursor-pointer`} onClick={handleComm}>
              Community Forum
            </li>
            <li className={`${isActive('/routemaps')} cursor-pointer`} onClick={handleroutes}>
              Routes
            </li>
            <li className={`${isActive('/database')} cursor-pointer`} onClick={handleDatabase}>
              Database
            </li>
          </ul>

          {/* User Authentication */}
          {!user ? (
            <div className="hidden md:block">
              <Button
                className="bg-[#115579] text-white px-6 py-2 rounded-lg hover:bg-[#0e4d6c] transition-all duration-300"
                onClick={handleLogin}
              >
                Sign in
              </Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Button
                className="bg-[#115579] text-white px-6 py-2 rounded-lg hover:bg-[#0e4d6c] transition-all duration-300"
                onClick={handleLogin}
              >
                LogOut
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <AlignJustify className="md:hidden text-[#115579] cursor-pointer" onClick={toggle} />
        </div>
      </div>

      {/* Mobile Menu */}
      {menu && <Menu />}
    </div>
  );
};

export default Navbar;
