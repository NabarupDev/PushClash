import React, { useState, useRef, useEffect } from 'react';
import dummyImage from '../assets/dummy.webp';
import loadingGif from '../assets/mock.gif';
import Typewriter from 'typewriter-effect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeetCode = () => {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(dummyImage);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoasting, setIsRoasting] = useState(false);
  const [roastResults, setRoastResults] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (roastResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [roastResults]);

  const startRoasting = async () => {
    if (!username.trim()) {
      toast.error('Please enter a LeetCode username');
      return;
    }

    setIsRoasting(true);
    setRoastResults(null);

    try {
      const apiBaseUrl = import.meta.env.VITE_ROAST_BASE_URL || 'http://localhost:3000';
      
      //console.log('Using API URL:', apiBaseUrl); // For debugging
      
      const response = await fetch(`${apiBaseUrl}/api/leetcode-roast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Roast failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      //console.log('Roast response:', data); // For debugging
      setRoastResults(data);
      
      if (data.user && data.user.avatarUrl) {
        setProfileImage(data.user.avatarUrl);
      }

    } catch (error) {
      console.error('Roast error:', error);
      toast.error(`Failed to generate LeetCode roast: ${error.message}`);
    } finally {
      setIsRoasting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error("Please enter a LeetCode username");
      return;
    }
    
    startRoasting();
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-blue-400">
          Roast a LeetCode Profile
        </h1>

        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2 sm:mb-3 relative">
              <div className={`absolute inset-0 rounded-full border-4 ${username ? 'border-blue-500' : 'border-gray-700'} overflow-hidden transition-all duration-300 ${isLoading ? 'animate-pulse' : ''}`}>
                <img
                  src={profileImage}
                  alt={username || "LeetCode User"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {roastResults && (
              <span className="text-blue-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg">{roastResults.user?.name || username}</span>
            )}
          </div>
        </div>

        <div className="mb-6 sm:mb-8 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -top-2 left-2 sm:left-4 px-1 z-10 text-blue-400 text-xs sm:text-sm font-medium bg-gray-900">
              leetcode
            </div>
            <div className="rounded-lg border-2 border-blue-400 shadow-lg transition-all duration-300 hover:shadow-blue-500/30">
              <div className="flex items-center px-2 sm:px-4 py-2 sm:py-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="LeetCode username 🧠"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400 focus:placeholder-blue-300 transition-colors text-xs sm:text-sm md:text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                {username && (
                  <button 
                    type="button" 
                    onClick={() => setUsername('')}
                    className="ml-1 sm:ml-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex justify-center">
          <button
            type="submit"
            disabled={isRoasting}
            className={`bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition duration-300 flex items-center text-sm sm:text-base ${
              isRoasting 
                ? 'opacity-75 cursor-not-allowed bg-gray-600' 
                : 'hover:from-blue-700 hover:to-cyan-700 cursor-pointer'
            }`}
          >
            {isRoasting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Roasting Profile...
              </>
            ) : (
              'Roast LeetCode Profile! 🔥'
            )}
          </button>
        </form>

        <div className="mt-8 sm:mt-12">
          {!roastResults && !isRoasting && (
            <div className="flex justify-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-[200px] md:h-[200px] overflow-hidden rounded-lg">
                <img 
                  src={loadingGif} 
                  alt="LeetCode Roast Preview" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
          {roastResults && (
            <div 
              ref={resultsRef}
              className="border-2 border-blue-500/30 rounded-lg p-3 sm:p-4 bg-gray-900/50 shadow-xl animate-fadeIn max-w-3xl mx-auto"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-400 text-center">Roast Results</h2>
              
              {/* LeetCode Stats Section */}
              {roastResults.leetcodeStats && (
                <div className="mb-5 p-3 bg-gray-800/70 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-blue-300">LeetCode Stats</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-gray-700/60 p-2 rounded text-center">
                      <div className="text-xs text-gray-400">Total Solved</div>
                      <div className="text-xl font-bold text-white">{roastResults.leetcodeStats.totalSolved}</div>
                    </div>
                    <div className="bg-green-700/30 p-2 rounded text-center">
                      <div className="text-xs text-gray-400">Easy</div>
                      <div className="text-xl font-bold text-green-400">{roastResults.leetcodeStats.easySolved}</div>
                    </div>
                    <div className="bg-yellow-700/30 p-2 rounded text-center">
                      <div className="text-xs text-gray-400">Medium</div>
                      <div className="text-xl font-bold text-yellow-400">{roastResults.leetcodeStats.mediumSolved}</div>
                    </div>
                    <div className="bg-red-700/30 p-2 rounded text-center">
                      <div className="text-xs text-gray-400">Hard</div>
                      <div className="text-xl font-bold text-red-400">{roastResults.leetcodeStats.hardSolved}</div>
                    </div>
                    <div className="bg-blue-700/30 p-2 rounded text-center col-span-2 sm:col-span-1">
                      <div className="text-xs text-gray-400">Ranking</div>
                      <div className="text-xl font-bold text-blue-400">#{roastResults.leetcodeStats.ranking}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="prose prose-invert max-w-none prose-xs sm:prose-sm text-white">
                <Typewriter
                  options={{
                    cursor: '',
                    loop: false,
                    delay: 30,
                    autoStart: true,
                  }}
                  onInit={(typewriter) => {
                    const roastText = roastResults.roastResult || "No roast content available";
                    const processedText = roastText.replace(/\*(.*?)\*/g, '$1');
                    
                    typewriter.typeString(processedText)
                      .start();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeetCode;
