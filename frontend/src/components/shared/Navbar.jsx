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
      ? 'text-[#355F2E] rounded-lg py-2 px-4 transition-all duration-300'
      : ' py-2 px-4 relative text-gray-800 font-semibold after:block after:h-[2px] after:bg-gray-800 after:w-0 hover:after:w-full after:transition-all after:duration-300'; // Improved hover and active styling

  return (
    <div className="bg-[#FBF6E9] mx-auto w-11/12 shadow-lg top-5 sticky z-10 backdrop-blur rounded-full">
      <div className="flex justify-between mx-auto py-2 px-6 items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link to="/home" className='flex gap-2'>
            <img src="./src/assets/logo.png" class="h-8" alt="Flowbite Logo" className='rounded-full w-10' />
            <span className="text-[#115579] text-2xl font-semibold">ReUnite</span>
          </Link>
        </div>

        {/* Navbar Links */}
        <div className="flex items-center space-x-6 ">
          <ul className="hidden md:flex space-x-6 text-lg">
            <li className={`${isActive('/dashboard')} cursor-pointer text-[#115579]`} onClick={handleDash}>
              Dashboard
            </li>
            <li className={`${isActive('/complain')} cursor-pointer`} onClick={handleComplaint}>
              Post Complaint
            </li>
           
            <li className={`${isActive('/routemaps')} cursor-pointer`} onClick={handleroutes}>
              Report
            </li>
            <li className={`${isActive('/database')} cursor-pointer`} onClick={handleDatabase}>
              Missing List
            </li>
          </ul>

          {/* User Authentication */}
          {/* {!user ? (
            <div className="hidden md:block">
              <Button
                className="bg-[#A8CD89] text-black px-6 py-[23px] rounded-lg hover:bg-[#355F2E] hover:text-white transition-all duration-300"
                onClick={handleLogin}
              >
                Sign in
              </Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Button
                className="bg-[#A8CD89] text-black px-6 py-2 rounded-lg hover:bg-[#355F2E] hover:text-white transition-all duration-300"
                onClick={handleLogin}
              >
                LogOut
              </Button>
            </div>
          )} */}

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
