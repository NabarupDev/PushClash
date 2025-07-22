import React, { useState, useRef, useEffect } from 'react';
import dummyImage from '../assets/dummy.webp';
import loadingGif from '../assets/mock.gif';
import Typewriter from 'typewriter-effect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Portfolio = () => {
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [profileImage, setProfileImage] = useState(dummyImage);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoasting, setIsRoasting] = useState(false);
  const [portfolioResults, setPortfolioResults] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const resultsRef = useRef(null);

  useEffect(() => {
    if (portfolioResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [portfolioResults]);

  const validateUrl = (url) => {
    if (!url.trim()) {
      toast.error("Please enter a portfolio URL");
      return false;
    }
    // Check if the URL starts with http:// or https://
    if (!url.match(/^https?:\/\//i)) {
      toast.error("Please enter a complete URL starting with https://");
      return false;
    }
    
    try {
      const parsedUrl = new URL(url);
      
      // Check if it's a localhost URL
      if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') {
        toast.error("Please enter a public website URL, not localhost");
        return false;
      }
      
      // Check if it's using HTTPS
      if (parsedUrl.protocol !== 'https:') {
        toast.warning("For security, please use an HTTPS URL");
        return false;
      }
      
      return true;
    } catch (e) {
      toast.error("Please enter a valid URL");
      return false;
    }
  };

  const fetchPortfolioImage = async (url) => {
    if (!url) return;

    setIsLoading(true);
    try {
      if (!validateUrl(url)) {
        setProfileImage(dummyImage);
        setIsLoading(false);
        return;
      }

      const apiBaseUrl = import.meta.env.PROFILE_IMAGE_API_BASE_URL || 'http://localhost:3000';

      // Fetch website icon
      const response = await fetch(`${apiBaseUrl}/api/portfolio/icon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.primaryIcon) {
          setProfileImage(data.primaryIcon);
        } else {
          setProfileImage(dummyImage);
          toast.info("Couldn't find an icon for this website, using default image");
        }
      } else {
        setProfileImage(dummyImage);
        toast.warning("Error fetching website icon");
      }
    } catch (error) {
      setProfileImage(dummyImage);
      toast.error("Error processing your request");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePortfolio = async () => {
    if (!validateUrl(portfolioUrl)) {
      return;
    }

    setIsRoasting(true);
    setPortfolioResults(null);

    try {
      const apiBaseUrl = import.meta.env.VITE_ROAST_BASE_URL || 'http://localhost:3000';
      
      setLoadingMessage("Analyzing website content...");
      const scrapeResponse = await fetch(`${apiBaseUrl}/api/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: portfolioUrl })
      });
      
      if (!scrapeResponse.ok) {
        throw new Error(`Failed to analyze website: ${scrapeResponse.statusText}`);
      }
      
      const scrapeData = await scrapeResponse.json();
      
      if (!scrapeData.success) {
        throw new Error(scrapeData.message || "Failed to scrape website");
      }
      
      setLoadingMessage("Generating portfolio roast...");
      const roastResponse = await fetch(`${apiBaseUrl}/api/portfolio/roast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: portfolioUrl,
          scrapeData: scrapeData.data
        })
      });
      
      if (!roastResponse.ok) {
        throw new Error(`Failed to generate roast: ${roastResponse.statusText}`);
      }
      
      const roastData = await roastResponse.json();
      
      setPortfolioResults({
        portfolio: {
          url: portfolioUrl,
          domain: new URL(portfolioUrl).hostname,
          icon: profileImage !== dummyImage ? profileImage : null,
          metrics: scrapeData.data.metrics,
        },
        portfolioResult: roastData.roast
      });
      
      if (profileImage === dummyImage && scrapeData.data.icons && scrapeData.data.icons.length > 0) {
        setProfileImage(scrapeData.data.icons[0].href);
      }

    } catch (error) {
      //console.error("Error analyzing portfolio:", error);
      toast.error(`Failed to analyze portfolio: ${error.message}`);
    } finally {
      setIsRoasting(false);
      setLoadingMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateUrl(portfolioUrl)) {
      return;
    }
    
    fetchPortfolioImage(portfolioUrl);
    analyzePortfolio();
  };

  const cleanText = (text) => {
    return text ? text.replace(/##/g, '') : '';
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-green-400">
          Portfolio Analysis
        </h1>

        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2 sm:mb-3 relative">
              <div className={`absolute inset-0 rounded-full border-4 ${portfolioUrl ? 'border-green-500' : 'border-gray-700'} overflow-hidden transition-all duration-300 ${isLoading ? 'animate-pulse' : ''}`}>
                <img
                  src={profileImage}
                  alt="Portfolio Website"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {portfolioResults && (
              <span className="text-green-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg">{portfolioResults.portfolio?.domain}</span>
            )}
          </div>
        </div>

        <div className="mb-6 sm:mb-8 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -top-2 left-2 sm:left-4 px-1 z-10 text-green-400 text-xs sm:text-sm font-medium bg-gray-900">
              portfolio url
            </div>
            <div className="rounded-lg border-2 border-green-400 shadow-lg transition-all duration-300 hover:shadow-green-500/30">
              <div className="flex items-center px-2 sm:px-4 py-2 sm:py-3">
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400 focus:placeholder-green-300 transition-colors text-xs sm:text-sm md:text-base"
                />
                {portfolioUrl && (
                  <button 
                    type="button" 
                    onClick={() => setPortfolioUrl('')}
                    className="ml-1 sm:ml-2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400 text-center">
            Enter the full URL of your portfolio website (including https://)
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex justify-center">
          <button
            type="submit"
            disabled={isRoasting}
            className={`bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition duration-300 flex items-center text-sm sm:text-base ${isRoasting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isRoasting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingMessage || "Analyzing..."}
              </>
            ) : (
              'Roast My Portfolio 🔥'
            )}
          </button>
        </form>

        <div className="mt-8 sm:mt-12">
          {!portfolioResults && !isRoasting && (
            <div className="flex justify-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-[200px] md:h-[200px] overflow-hidden rounded-lg">
                <img 
                  src={loadingGif} 
                  alt="Portfolio Analysis Preview" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
          {portfolioResults && (
            <div 
              ref={resultsRef}
              className="border-2 border-green-500/30 rounded-lg p-3 sm:p-4 bg-gray-900/50 shadow-xl animate-fadeIn max-w-3xl mx-auto"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-green-400 text-center">Your Roasted Portfolio</h2>
              <div className="prose prose-invert max-w-none prose-xs sm:prose-sm text-white">
                <Typewriter
                  options={{
                    cursor: '',
                    loop: false,
                    delay: 30,
                    autoStart: true,
                  }}
                  onInit={(typewriter) => {
                    const portfolioText = portfolioResults.portfolioResult || "No portfolio analysis available";
                    const processedText = cleanText(portfolioText.replace(/\*(.*?)\*/g, '$1'));
                    
                    typewriter.typeString(processedText)
                      .callFunction(() => {
                        // Portfolio typing completed
                      })
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

export default Portfolio;
