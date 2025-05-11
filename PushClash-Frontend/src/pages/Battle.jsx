import React, { useState, useRef, useEffect } from 'react';
import dummyImage from '../assets/dummy.webp';
import loadingGif from '../assets/mock.gif';
import Typewriter from 'typewriter-effect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Battle = () => {
    const [username1, setUsername1] = useState('');
    const [username2, setUsername2] = useState('');
    const [profileImage1, setProfileImage1] = useState(dummyImage);
    const [profileImage2, setProfileImage2] = useState(dummyImage);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [battleResults, setBattleResults] = useState(null);
    const [isBattling, setIsBattling] = useState(false);
    const resultsRef = useRef(null); 

    useEffect(() => {
        if (battleResults && resultsRef.current) {
            resultsRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [battleResults]);

    const fetchProfileImage = async (username, setProfileImage, setIsLoading) => {
        if (!username) return;

        setIsLoading(true);
        try {
            const apiBaseUrl = import.meta.env.PROFILE_IMAGE_API_BASE_URL || 'https://pushclash.onrender.com';
            const response = await fetch(`${apiBaseUrl}/github/profile-image/${username}`);

            if (response.ok) {
                const data = await response.json();
                setProfileImage(data.imageUrl);
            } else {
                setProfileImage(dummyImage);
            }
        } catch (error) {
            //console.error("Error fetching profile image:", error);
            setProfileImage(dummyImage);
        } finally {
            setIsLoading(false);
        }
    };

    const startBattle = async () => {
        if (!username1.trim() || !username2.trim()) {
            toast.error('Please enter both usernames');
            return;
        }

        setIsBattling(true);
        setBattleResults(null);

        try {
            const apiBaseUrl = import.meta.env.ROAST_BASE_URL || 'https://pushclash.onrender.com';
            
            const response = await fetch(`${apiBaseUrl}/api/battle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username1,
                    username2
                })
            });

            if (!response.ok) {
                throw new Error(`Battle failed: ${response.statusText}`);
            }

            const data = await response.json();
            setBattleResults(data);
            
            setProfileImage1(data.user1.avatarUrl);
            setProfileImage2(data.user2.avatarUrl);
            

        } catch (error) {
            //console.error("Error during battle:", error);
            toast.error('Failed to generate battle results. Please try again.');
        } finally {
            setIsBattling(false);
        }
    };

    const handleUsernameChange = (value, setUsername) => {
        setUsername(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!username1.trim() || !username2.trim()) {
            toast.error("Please enter both usernames");
            return;
        }
        
        if (username1.trim().toLowerCase() === username2.trim().toLowerCase()) {
            toast.warning("Are you comparing yourself with yourself? 🤔");
            setUsername2(''); // Clear the second input
            return;
        }
        
        fetchProfileImage(username1, setProfileImage1, setIsLoading1);
        fetchProfileImage(username2, setProfileImage2, setIsLoading2);
        
        startBattle();
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-12">
            <ToastContainer position="top-right" autoClose={5000} theme="dark" />
            <div className="w-full max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-yellow-400">
                    Battle of the Profiles
                </h1>

                <div className="flex justify-center items-center space-x-2 sm:space-x-8 mb-6 sm:mb-8">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2 sm:mb-3 relative">
                            <div className={`absolute inset-0 rounded-full border-4 ${username1 ? 'border-blue-500' : 'border-gray-700'} overflow-hidden transition-all duration-300 ${isLoading1 ? 'animate-pulse' : ''}`}>
                                <img
                                    src={profileImage1}
                                    alt={username1 || "Player 1"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {battleResults && (
                            <span className="text-blue-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg">{battleResults.user1.name}</span>
                        )}
                    </div>

                    <div className="bg-yellow-500 text-black font-bold text-base sm:text-xl rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                        <span className="transform translate-y-px">VS</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2 sm:mb-3 relative">
                            <div className={`absolute inset-0 rounded-full border-4 ${username2 ? 'border-purple-500' : 'border-gray-700'} overflow-hidden transition-all duration-300 ${isLoading2 ? 'animate-pulse' : ''}`}>
                                <img
                                    src={profileImage2}
                                    alt={username2 || "Player 2"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {battleResults && (
                            <span className="text-purple-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg">{battleResults.user2.name}</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center space-x-2 sm:space-x-6 mb-6 sm:mb-8">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute -top-2 left-2 sm:left-4 px-1 z-10 text-blue-400 text-xs sm:text-sm font-medium bg-gray-900">
                                github
                            </div>
                            <div className="rounded-lg border-2 border-blue-400 shadow-lg transition-all duration-300 hover:shadow-blue-500/30">
                                <div className="flex items-center px-2 sm:px-4 py-2 sm:py-3">
                                    <input
                                        type="text"
                                        value={username1}
                                        onChange={(e) => handleUsernameChange(e.target.value, setUsername1)}
                                        placeholder="user1🦊"
                                        className="w-full bg-transparent outline-none text-white placeholder-gray-400 focus:placeholder-blue-300 transition-colors text-xs sm:text-sm md:text-base"
                                    />
                                    {username1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => setUsername1('')}
                                            className="ml-1 sm:ml-2 text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute -top-2 left-2 sm:left-4 px-1 z-10 text-purple-400 text-xs sm:text-sm font-medium bg-gray-900">
                                github
                            </div>
                            <div className="rounded-lg border-2 border-purple-400 shadow-lg transition-all duration-300 hover:shadow-purple-500/30">
                                <div className="flex items-center px-2 sm:px-4 py-2 sm:py-3">
                                    <input
                                        type="text"
                                        value={username2}
                                        onChange={(e) => handleUsernameChange(e.target.value, setUsername2)}
                                        placeholder="user2🦊"
                                        className="w-full bg-transparent outline-none text-white placeholder-gray-400 focus:placeholder-purple-300 transition-colors text-xs sm:text-sm md:text-base"
                                    />
                                    {username2 && (
                                        <button 
                                            type="button" 
                                            onClick={() => setUsername2('')}
                                            className="ml-1 sm:ml-2 text-gray-400 hover:text-purple-400 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isBattling}
                        className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition duration-300 text-sm sm:text-base ${isBattling ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isBattling ? 'Battling...' : 'Battle🔥'}
                    </button>
                </form>

                <div className="mt-8 sm:mt-12">
                    {!battleResults && (
                        <div className="flex justify-center">
                            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-[200px] md:h-[200px] overflow-hidden rounded-lg">
                                <img 
                                    src={loadingGif} 
                                    alt="GitHub Battle Preview" 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    )}
                    
                    {battleResults && (
                        <div 
                            ref={resultsRef}
                            className="border-2 border-yellow-500/30 rounded-lg p-3 sm:p-4 bg-gray-900/50 shadow-xl animate-fadeIn max-w-3xl mx-auto"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-yellow-400 text-center">Battle Results</h2>
                            <div className="prose prose-invert max-w-none prose-xs sm:prose-sm text-white">
                                <Typewriter
                                    options={{
                                        cursor: '',
                                        loop: false,
                                        delay: 30,
                                        autoStart: true,
                                    }}
                                    onInit={(typewriter) => {
                                        // Process the text to remove asterisks
                                        const processedText = battleResults.battleResults.replace(/\*(.*?)\*/g, '$1');
                                        
                                        typewriter.typeString(processedText)
                                            .callFunction(() => {
                                                //console.log('Battle results typing completed');
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

export default Battle;
