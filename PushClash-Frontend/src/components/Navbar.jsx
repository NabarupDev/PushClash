import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [githubDropdown, setGithubDropdown] = useState(false);
  const [leetcodeDropdown, setLeetcodeDropdown] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleGithubDropdown = () => {
    setGithubDropdown(!githubDropdown);
    if (leetcodeDropdown) setLeetcodeDropdown(false);
  };

  const toggleLeetcodeDropdown = () => {
    setLeetcodeDropdown(!leetcodeDropdown);
    if (githubDropdown) setGithubDropdown(false);
  };

  // Close dropdowns when clicking outside navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
        setGithubDropdown(false);
        setLeetcodeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-center px-4 py-4">
      <nav ref={navRef} className="bg-gray-800 shadow-lg rounded-lg w-full max-w-5xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
                  to="/portfolio" 
                  className={({ isActive }) => 
                    isActive ? "text-white px-3 py-2 rounded-md font-medium" : "text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium"
                  }
                >
                  Portfolio
                </NavLink>
                
                {/* Github Dropdown */}
                <div className="relative group">
                  <button 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
                    onClick={toggleGithubDropdown}
                    onMouseEnter={() => setGithubDropdown(true)}
                  >
                    Github
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div 
                    className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 ${githubDropdown ? 'block' : 'hidden'} group-hover:block z-10`}
                    onMouseLeave={() => setGithubDropdown(false)}
                  >
                    <div className="py-1">
                      <NavLink 
                        to="/roast" 
                        className={({ isActive }) => 
                          isActive ? "text-white block px-4 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-600 hover:text-white block px-4 py-2 text-sm font-medium"
                        }
                      >
                        Github Roast
                      </NavLink>
                      <NavLink 
                        to="/battle" 
                        className={({ isActive }) => 
                          isActive ? "text-white block px-4 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-600 hover:text-white block px-4 py-2 text-sm font-medium"
                        }
                      >
                        Github Battle
                      </NavLink>
                    </div>
                  </div>
                </div>

                {/* LeetCode Dropdown */}
                <div className="relative group">
                  <button 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
                    onClick={toggleLeetcodeDropdown}
                    onMouseEnter={() => setLeetcodeDropdown(true)}
                  >
                    LeetCode
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div 
                    className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 ${leetcodeDropdown ? 'block' : 'hidden'} group-hover:block z-10`}
                    onMouseLeave={() => setLeetcodeDropdown(false)}
                  >
                    <div className="py-1">
                      <NavLink 
                        to="/leetcode-roast" 
                        className={({ isActive }) => 
                          isActive ? "text-white block px-4 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-600 hover:text-white block px-4 py-2 text-sm font-medium"
                        }
                      >
                        LeetCode Roast
                      </NavLink>
                      <NavLink 
                        to="/leetcode-battle" 
                        className={({ isActive }) => 
                          isActive ? "text-white block px-4 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-600 hover:text-white block px-4 py-2 text-sm font-medium"
                        }
                      >
                        LeetCode Battle
                      </NavLink>
                    </div>
                  </div>
                </div>
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
                isActive ? "text-white block px-3 py-2 rounded-md textbase font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md textbase font-medium"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/portfolio"
              onClick={toggleMenu} 
              className={({ isActive }) => 
                isActive ? "text-white block px-3 py-2 rounded-md textbase font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md textbase font-medium"
              }
            >
              Portfolio
            </NavLink>
            
            {/* Mobile Github Dropdown */}
            <div>
              <button 
                onClick={toggleGithubDropdown}
                className="text-gray-300 hover:text-white flex justify-between items-center w-full px-3 py-2 rounded-md textbase font-medium"
              >
                <span>Github</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={githubDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                </svg>
              </button>
              <div className={`pl-4 ${githubDropdown ? 'block' : 'hidden'} space-y-1 pt-1`}>
                <NavLink 
                  to="/roast"
                  onClick={toggleMenu} 
                  className={({ isActive }) => 
                    isActive ? "text-white block px-3 py-2 rounded-md textbase font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md textbase font-medium"
                  }
                >
                  Github Roast
                </NavLink>
                <NavLink 
                  to="/battle"
                  onClick={toggleMenu} 
                  className={({ isActive }) => 
                    isActive ? "text-white block px-3 py-2 rounded-md textbase font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md textbase font-medium"
                  }
                >
                  Github Battle
                </NavLink>
              </div>
            </div>

            {/* Mobile LeetCode Dropdown */}
            <div>
              <button 
                onClick={toggleLeetcodeDropdown}
                className="text-gray-300 hover:text-white flex justify-between items-center w-full px-3 py-2 rounded-md textbase font-medium"
              >
                <span>LeetCode</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={leetcodeDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                </svg>
              </button>
              <div className={`pl-4 ${leetcodeDropdown ? 'block' : 'hidden'} space-y-1 pt-1`}>
                <NavLink 
                  to="/leetcode-roast"
                  onClick={toggleMenu} 
                  className={({ isActive }) => 
                    isActive ? "text-white block px-3 py-2 rounded-md textbase font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md textbase font-medium"
                  }
                >
                  LeetCode Roast
                </NavLink>
                <NavLink 
                  to="/leetcode-battle"
                  onClick={toggleMenu} 
                  className={({ isActive }) => 
                    isActive ? "text-white block px-3 py-2 rounded-md textbase font-medium" : "text-gray-300 hover:text-white block px-3 py-2 rounded-md textbase font-medium"
                  }
                >
                  LeetCode Battle
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;