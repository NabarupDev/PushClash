import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center mr-2">
                <img src={logo} alt="PushClash Logo" className="h-9 w-9 rounded-full" />
              </div>
              <NavLink to="/" className="text-white text-xl font-bold">
                PushClash
              </NavLink>
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center">
            <div className="flex space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive ? "text-white px-3 py-2 rounded-md font-medium" : "text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium"
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/battle" 
                className={({ isActive }) => 
                  isActive ? "text-white px-3 py-2 rounded-md font-medium" : "text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium"
                }
              >
                Battle
              </NavLink>
              <NavLink 
                to="/roast" 
                className={({ isActive }) => 
                  isActive ? "text-white px-3 py-2 rounded-md font-medium" : "text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium"
                }
              >
                Roast
              </NavLink>
              <NavLink 
                to="/portfolio" 
                className={({ isActive }) => 
                  isActive ? "text-white px-3 py-2 rounded-md font-medium" : "text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium"
                }
              >
                Portfolio
              </NavLink>
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink 
            to="/"
            onClick={toggleMenu} 
            className={({ isActive }) => 
              isActive ? "text-white block px-3 py-2 rounded-md text-base font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/battle"
            onClick={toggleMenu} 
            className={({ isActive }) => 
              isActive ? "text-white block px-3 py-2 rounded-md text-base font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            }
          >
            Battle
          </NavLink>
          <NavLink 
            to="/roast"
            onClick={toggleMenu} 
            className={({ isActive }) => 
              isActive ? "text-white block px-3 py-2 rounded-md text-base font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            }
          >
            Roast
          </NavLink>
          <NavLink 
            to="/portfolio"
            onClick={toggleMenu} 
            className={({ isActive }) => 
              isActive ? "text-white block px-3 py-2 rounded-md text-base font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            }
          >
            Portfolio
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;