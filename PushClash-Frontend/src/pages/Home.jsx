import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import loadingGif from '../assets/mock.gif';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ping the server to wake it up on page load
    const pingServer = async () => {
      try {
        await fetch("https://pushclash.onrender.com/api/wake", {
          method: "GET",
        });
        //console.log("Server pinged on page load");
      } catch (error) {
        //console.error("Error pinging server:", error);
      }
    };

    // Call the ping function
    pingServer();
    
    // Simulate loading time and handle page content loading
    const handleLoad = () => {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      anchorLinks.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
          <DotLottieReact
            src="https://lottie.host/0c81d8de-b0e3-43c6-92f5-0b0471d7fc89/N8w2kwG37d.lottie"
            autoplay
            loop
            className="w-full h-full"
          />
          <p className="text-white text-center mt-4 text-lg sm:text-xl md:text-2xl font-medium animate-pulse">
            Loading PushClash...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[90%] sm:max-w-[85%] md:max-w-[80%]">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-transparent bg-clip-text">
                PushClash
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              The ultimate tool to analyze, compare, and playfully roast GitHub profiles and portfolios
            </p>
            <div className="flex flex-row justify-center gap-3 sm:gap-4">
              <Link to="/roast" className="inline-flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                <span>Roast a Profile</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <a href="#features" className="inline-flex items-center justify-center whitespace-nowrap bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                <span>Learn More</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
          <div className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-red-500 rounded-full opacity-20 blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-yellow-500 rounded-full opacity-20 blur-3xl top-40 right-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-green-500 rounded-full opacity-20 blur-3xl bottom-0 left-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 sm:py-12 md:py-16 bg-gray-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[90%] sm:max-w-[85%] md:max-w-[80%]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 text-center">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
              Choose Your Roasting Adventure
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-gray-900 border border-red-500/30 rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
              <div className="rounded-full bg-red-500/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05c-.867 0-1.607.356-1.99.89-.383.533-.607 1.23-.607 2.06 0 .822.224 1.52.608 2.053.082.115.224.275.393.445.238.24.533.48.87.705.904.575 2.098.967 3.476 1.097-.9.541-1.516 1.097-2.086 1.563A7.141 7.141 0 013 14.305c-.231.132-.454.240-.679.32A7 7 0 1017 8a1 1 0 00-1.316-.949c-.477.114-.89.293-1.332.497-.305.141-.608.293-.906.449-1.254.668-2.382 1.438-3.385 2.334-.202.18-.348.307-.438.39-.27.243-.377.58-.293.902.153.578.557 1.023 1.068 1.316 1.09.625 2.225.907 3.398.907.433 0 .865-.043 1.293-.114 1.732-.293 3.305-1.074 4.443-2.282.415-.44.695-.92.847-1.434.148-.507.15-1.065.008-1.645-.022-.095-.04-.19-.057-.28-.303.254-.643.53-1.012.815-.592.463-1.262.9-1.957 1.268L17 8a7 7 0 10-5.057-2.19c.166-.014.332-.02.5-.02"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-bold mb-2 sm:mb-3 text-red-400">Roast a GitHub Profile</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 md:mb-6">
                Discover humorous insights about any GitHub profile. Our AI analyzes repositories, commit patterns, and coding habits to generate a personalized roast.
              </p>
              <Link to="/roast" className="text-red-400 font-medium hover:text-red-300 flex items-center text-sm sm:text-base">
                Try Profile Roaster
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
              <div className="rounded-full bg-yellow-500/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-bold mb-2 sm:mb-3 text-yellow-400">Battle GitHub Profiles</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 md:mb-6">
                Put two GitHub users head-to-head in an epic coding showdown. Compare stats, contributions, and skills to determine the ultimate developer champion.
              </p>
              <Link to="/battle" className="text-yellow-400 font-medium hover:text-yellow-300 flex items-center text-sm sm:text-base">
                Start a Battle
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-gray-900 border border-green-500/30 rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="rounded-full bg-green-500/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.903-4.447a1 1 0 00-1.032 0l-4.903 4.447A1 1 0 014 16V4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-bold mb-2 sm:mb-3 text-green-400">Analyze Portfolio Website</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 md:mb-6">
                Get professional insights and fun feedback on your portfolio website. Our AI evaluates design, content, and user experience to help you improve.
              </p>
              <Link to="/portfolio" className="text-green-400 font-medium hover:text-green-300 flex items-center text-sm sm:text-base">
                Analyze Your Portfolio
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - improved responsiveness */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[90%] sm:max-w-[85%] md:max-w-[80%]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              How It Works
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex flex-col space-y-6 sm:space-y-8">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-blue-500/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-400 font-bold text-sm sm:text-base">1</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-blue-400 mb-1 sm:mb-2">Enter GitHub Username or Portfolio URL</h3>
                    <p className="text-sm sm:text-base text-gray-300">
                      Simply input a GitHub username for roasting or portfolio analysis, or enter two usernames for an epic battle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-purple-500/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 font-bold text-sm sm:text-base">2</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-purple-400 mb-1 sm:mb-2">Our AI Analyzes Everything</h3>
                    <p className="text-sm sm:text-base text-gray-300">
                      Our advanced AI engine examines repositories, commit history, coding patterns, and portfolio design elements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-pink-500/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-pink-400 font-bold text-sm sm:text-base">3</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-pink-400 mb-1 sm:mb-2">Get Your Results</h3>
                    <p className="text-sm sm:text-base text-gray-300">
                      Receive a detailed, entertaining analysis that provides both humor and valuable insights to help you improve.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20">
                <img src={loadingGif} alt="Demo" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">Ready to get started?</h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-sm sm:max-w-lg md:max-w-2xl mx-auto">
            Choose your adventure and discover insights about GitHub profiles and portfolios with a touch of humor.
          </p>
          <div className="flex flex-row flex-wrap justify-center items-center gap-3 sm:gap-4">
            <Link to="/roast" className="inline-flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-5 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base w-auto">
              <span>Roast a Profile</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link to="/battle" className="inline-flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-5 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base w-auto">
              <span>Battle Profiles</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link to="/portfolio" className="inline-flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-5 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base w-auto">
              <span>Analyze Portfolio</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
