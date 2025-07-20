import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';

const AppNavbar = () => {
  const [openNav, setOpenNav] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const navList = user ? (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <li className="p-1 font-normal">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium ${isActive ? 'text-blue-400 bg-blue-900 bg-opacity-30 shadow-md' : 'text-gray-300 hover:text-blue-300 hover:bg-gray-700'}`
          }
        >
          Home
        </NavLink>
      </li>
      <li className="p-1 font-normal">
        <NavLink
          to="/games"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium ${isActive ? 'text-blue-400 bg-blue-900 bg-opacity-30 shadow-md' : 'text-gray-300 hover:text-blue-300 hover:bg-gray-700'}`
          }
        >
          Games
        </NavLink>
      </li>
      <li className="p-1 font-normal">
        <NavLink
          to="/publishers"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium ${isActive ? 'text-blue-400 bg-blue-900 bg-opacity-30 shadow-md' : 'text-gray-300 hover:text-blue-300 hover:bg-gray-700'}`
          }
        >
          Publishers
        </NavLink>
      </li>
      <li className="p-1 font-normal">
        <NavLink
          to="/genres"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium ${isActive ? 'text-blue-400 bg-blue-900 bg-opacity-30 shadow-md' : 'text-gray-300 hover:text-blue-300 hover:bg-gray-700'}`
          }
        >
          Genres
        </NavLink>
      </li>
      <li className="p-1 font-normal">
        <NavLink
          to="/latest-news"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium ${isActive ? 'text-blue-400 bg-blue-900 bg-opacity-30 shadow-md' : 'text-gray-300 hover:text-blue-300 hover:bg-gray-700'}`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Latest News
        </NavLink>
      </li>
    </ul>
  ) : null;

  return (
    <nav className="sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
      <div className="flex items-center justify-between text-white">
        <NavLink
          to="/home"
          className="mr-4 cursor-pointer py-1.5 font-bold text-2xl text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          GAME ON
        </NavLink>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            {user ? (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/user"
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </NavLink>
                <span className="text-gray-200 text-sm hidden md:block font-medium">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="hidden lg:inline-block text-gray-300 hover:text-red-400 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="hidden lg:inline-block text-gray-300 hover:text-blue-300 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  className="hidden lg:inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
          <button
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {openNav && (
        <div className="lg:hidden bg-gray-800 bg-opacity-95 rounded-lg mt-4 p-4 shadow-xl border border-gray-700">
          {navList}
          <div className="flex flex-col gap-2 mt-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2 px-4">
                  <NavLink
                    to="/user"
                    className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 cursor-pointer shadow-lg"
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </NavLink>
                  <span className="text-gray-200 text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-center py-2 px-4 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="w-full text-center py-2 px-4 text-gray-300 hover:text-blue-300 hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  className="w-full text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppNavbar;