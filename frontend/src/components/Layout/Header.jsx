import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/UserContext';
import Icon from '../../Images/Icon.png';
import { SiBitdefender } from 'react-icons/si';
import { TbUserSquareRounded, TbLogout2 } from 'react-icons/tb';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: '',
    });
    localStorage.removeItem('auth');
    toast.success('Logout Successfully');
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isUser = JSON.parse(localStorage.getItem('auth'));

  return (
    <nav className="fixed top-0 left-2 right-2 z-50 bg-slate-500 bg-opacity-40 backdrop-blur-lg rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex text-white font-bold text-xl">
              <SiBitdefender size={40} />
              <img
                src={Icon}
                className="w-100 h-10 mr-2 bg-transparent"
                alt="Logo"
              />
            </NavLink>
            {/* Render links when not in mobile view */}
          </div>
          {!isMobile ? (
            isUser ? (
              <div className=" flex justify-between items-center space-x-4 text-white">
                <NavLink
                  to="/"
                  className="hover:bg-gray-700 hover:shadow-sm hover:shadow-teal-400 px-3 py-2 flex items-center rounded-md text-md font-semibold "
                >
                  <TbUserSquareRounded
                    className="pr-2 text-teal-400"
                    size={30}
                  />
                  {isUser?.user?.name}
                </NavLink>
                <NavLink
                  to="/dashboard/account-page"
                  className="flex items-center hover:shadow-sm hover:shadow-green-400 hover:bg-gray-700 px-3 py-2 rounded-md text-md font-semibold"
                >
                  <LiaMoneyCheckAltSolid
                    className="pr-2 text-green-400"
                    size={30}
                  />
                  Accounts
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={handleLogout}
                  className="flex items-center hover:shadow-sm hover:shadow-red-400 hover:bg-gray-700 px-3 py-2 rounded-md text-md font-semibold"
                >
                  <TbLogout2 className="pr-2 text-red-400" size={30} />
                  Logout
                </NavLink>
              </div>
            ) : (
              <div className=" flex justify-between items-center space-x-4 text-white">
                <NavLink
                  to="/register"
                  className="hover:text-sky-400 hover:shadow-sm hover:shadow-sky-300 bg-slate-600 px-3 py-2 flex items-center rounded-md text-md font-semibold "
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="flex items-center hover:text-sky-400 px-3 py-2 rounded-md text-md font-semibold"
                >
                  Login
                </NavLink>
              </div>
            )
          ) : (
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleNavbar}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                {isOpen ? <MdClose size={24} /> : <GiHamburgerMenu size={24} />}
              </button>
            </div>
          )}
        </div>

        {/* Responsive menu */}
        {isOpen &&
          (isUser ? (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <hr />
                <NavLink
                  to="/"
                  className="text-white hover:bg-slate-700 flex items-center px-3 py-2 rounded-md text-base font-medium"
                >
                  <TbUserSquareRounded
                    className="pr-2 text-teal-400"
                    size={30}
                  />
                  {isUser?.user?.name}
                </NavLink>
                <NavLink
                  to="/dashboard/account-page"
                  className="text-white hover:bg-slate-700 flex items-center px-3 py-2 rounded-md text-base font-medium"
                >
                  <LiaMoneyCheckAltSolid
                    className="pr-2 text-green-400"
                    size={30}
                  />
                  Accounts
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={handleLogout}
                  className="text-white hover:bg-slate-700 flex items-center px-3 py-2 rounded-md text-base font-medium"
                >
                  <TbLogout2 className="pr-2 text-red-400" size={30} />
                  Logout
                </NavLink>
              </div>
            </div>
          ) : (
            <div className=" px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink
                to="/register"
                className="text-white hover:bg-slate-700 flex items-center px-3 py-2 rounded-md text-base font-medium "
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="text-white hover:bg-slate-700 flex items-center px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </NavLink>
            </div>
          ))}
      </div>
    </nav>
  );
};

export default Header;
