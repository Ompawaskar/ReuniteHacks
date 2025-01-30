import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { AlignJustify, Home, ShoppingCart, Package } from 'lucide-react';

const Navbar = () => {
  const [menu, setMenu] = React.useState(false);
  const location = useLocation(); // Get the current route

  const toggle = () => {
    setMenu(!menu);
  };

  // Function to determine active and hover styles
  const isActive = (path) =>
    location.pathname === path
      ? 'text-[#355F2E] rounded-lg py-2 px-4 transition-all duration-300'
      : 'py-2 px-4 relative text-gray-800 font-semibold after:block after:h-[2px] after:bg-gray-800 after:w-0 hover:after:w-full after:transition-all after:duration-300';

  return (
    <div className="bg-[#FBF6E9] mx-auto w-11/12 shadow-lg top-5 sticky z-10 backdrop-blur rounded-full">
      <div className="flex justify-between mx-auto py-2 px-6 items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex gap-2">
            <img
              src="../src/assets/logo.png"
              className="h-8 rounded-full w-10"
              alt="Flowbite Logo"
            />
            <span className="text-[#115579] text-2xl font-semibold">ReUnite</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-lg">
          <NavLink
            to="/dashboard"
            className={isActive('/dashboard')}
          >
            {/* <Home className="h-5 w-5" /> */}
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/incident-reports"
            className={isActive('/dashboard/incident-reports')}
          >
            {/* <ShoppingCart className="h-5 w-5" /> */}
            Incident Reports
          </NavLink>
          <NavLink
            to="/dashboard/table2"
            className={isActive('/dashboard/table2')}
          >
            {/* <Package className="h-5 w-5" /> */}
            Tables
          </NavLink>
        </div>

        {/* Authentication */}
        <div className="flex items-center space-x-6">
          <SignedOut>
            <SignInButton className="bg-[#A8CD89] text-black px-6 py-2 rounded-lg hover:bg-[#355F2E] hover:text-white transition-all duration-300" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* Mobile Menu Toggle */}
          <AlignJustify
            className="md:hidden text-[#115579] cursor-pointer"
            onClick={toggle}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {menu && (
        <div className="md:hidden bg-white p-4 shadow-lg rounded-lg mt-2">
          <NavLink
            to="/dashboard"
            className={isActive('/dashboard')}
            onClick={toggle}
          >
            {/* <Home className="h-5 w-5" /> */}
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/incident-reports"
            className={isActive('/dashboard/incident-reports')}
            onClick={toggle}
          >
            {/* <ShoppingCart className="h-5 w-5" /> */}
            Incident Reports
          </NavLink>
          <NavLink
            to="/dashboard/table2"
            className={isActive('/dashboard/table2')}
            onClick={toggle}
          >
            {/* <Package className="h-5 w-5" /> */}
            Tables
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;