import React, { useState, useRef, useEffect } from 'react';
import dummyImage from '../assets/dummy.webp';
import loadingGif from '../assets/mock.gif';
import Typewriter from 'typewriter-effect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeetCodeBattle = () => {
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

    const startBattle = async () => {
        if (!username1.trim() || !username2.trim()) {
            toast.error('Please enter both usernames');
            return;
        }

        if (username1.trim().toLowerCase() === username2.trim().toLowerCase()) {
            toast.warning("Are you comparing yourself with yourself? 🤔");
            setUsername2(''); // Clear the second input
            return;
        }

        setIsBattling(true);
        setBattleResults(null);
        setIsLoading1(true);
        setIsLoading2(true);

        try {
            const apiBaseUrl = import.meta.env.VITE_ROAST_BASE_URL || 'https://pushclash.onrender.com';
            
            const response = await fetch(`${apiBaseUrl}/api/leetcode-battle`, {
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
            
            if (data.user1 && data.user1.avatarUrl) {
                setProfileImage1(data.user1.avatarUrl);
            }
            
            if (data.user2 && data.user2.avatarUrl) {
                setProfileImage2(data.user2.avatarUrl);
            }

        } catch (error) {
            toast.error('Failed to generate battle results. Please try again.');
        } finally {
            setIsBattling(false);
            setIsLoading1(false);
            setIsLoading2(false);
        }
    };

    const handleUsernameChange = (value, setUsername) => {
        setUsername(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        startBattle();
    };

    const renderStatComparison = (title, user1Stat, user2Stat) => {
        // For ranking, lower is better
        const isRanking = title === "Ranking";
        
        let user1Wins, user2Wins;
        if (isRanking) {
            user1Wins = user1Stat < user2Stat;
            user2Wins = user2Stat < user1Stat;
        } else {
            user1Wins = user1Stat > user2Stat;
            user2Wins = user2Stat > user1Stat;
        }
        
        const equal = user1Stat === user2Stat;

        return (
            <div className="mb-2 p-2 rounded-lg bg-gray-800/50">
                <div className="text-xs text-gray-400 mb-1 text-center">{title}</div>
                <div className="grid grid-cols-3 items-center">
                    <div className={`text-lg font-bold text-center ${user1Wins ? 'text-cyan-400' : equal ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user1Stat}
                        {user1Wins && <span className="ml-1 text-xs">👑</span>}
                    </div>
                    <div className="text-xs text-gray-500 text-center">vs</div>
                    <div className={`text-lg font-bold text-center ${user2Wins ? 'text-orange-400' : equal ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user2Stat}
                        {user2Wins && <span className="ml-1 text-xs">👑</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-12">
            <ToastContainer position="top-right" autoClose={5000} theme="dark" />
            <div className="w-full max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-blue-400">
                    LeetCode Battle
                </h1>

                <div className="flex justify-center items-center space-x-2 sm:space-x-8 mb-6 sm:mb-8">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2 sm:mb-3 relative">
                            <div className={`absolute inset-0 rounded-full border-4 ${username1 ? 'border-cyan-500' : 'border-gray-700'} overflow-hidden transition-all duration-300 ${isLoading1 ? 'animate-pulse' : ''}`}>
                                <img
                                    src={profileImage1}
                                    alt={username1 || "LeetCoder 1"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {battleResults && (
                            <span className="text-cyan-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg">{battleResults.user1?.name || username1}</span>
                        )}
                    </div>

                    <div className="bg-blue-500 text-white font-bold text-base sm:text-xl rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                        <span className="transform translate-y-px">VS</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2 sm:mb-3 relative">
                            <div className={`absolute inset-0 rounded-full border-4 ${username2 ? 'border-orange-500' : 'border-gray-700'} overflow-hidden transition-all duration-300 ${isLoading2 ? 'animate-pulse' : ''}`}>
                                <img
                                    src={profileImage2}
                                    alt={username2 || "LeetCoder 2"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {battleResults && (
                            <span className="text-orange-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg">{battleResults.user2?.name || username2}</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center space-x-2 sm:space-x-6 mb-6 sm:mb-8">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute -top-2 left-2 sm:left-4 px-1 z-10 text-cyan-400 text-xs sm:text-sm font-medium bg-gray-900">
                                leetcode
                            </div>
                            <div className="rounded-lg border-2 border-cyan-400 shadow-lg transition-all duration-300 hover:shadow-cyan-500/30">
                                <div className="flex items-center px-2 sm:px-4 py-2 sm:py-3">
                                    <input
                                        type="text"
                                        value={username1}
                                        onChange={(e) => handleUsernameChange(e.target.value, setUsername1)}
                                        placeholder="user1"
                                        className="w-full bg-transparent outline-none text-white placeholder-gray-400 focus:placeholder-cyan-300 transition-colors text-xs sm:text-sm md:text-base"
                                    />
                                    {username1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => setUsername1('')}
                                            className="ml-1 sm:ml-2 text-gray-400 hover:text-cyan-400 transition-colors"
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
                            <div className="absolute -top-2 left-2 sm:left-4 px-1 z-10 text-orange-400 text-xs sm:text-sm font-medium bg-gray-900">
                                leetcode
                            </div>
                            <div className="rounded-lg border-2 border-orange-400 shadow-lg transition-all duration-300 hover:shadow-orange-500/30">
                                <div className="flex items-center px-2 sm:px-4 py-2 sm:py-3">
                                    <input
                                        type="text"
                                        value={username2}
                                        onChange={(e) => handleUsernameChange(e.target.value, setUsername2)}
                                        placeholder="user2"
                                        className="w-full bg-transparent outline-none text-white placeholder-gray-400 focus:placeholder-orange-300 transition-colors text-xs sm:text-sm md:text-base"
                                    />
                                    {username2 && (
                                        <button 
                                            type="button" 
                                            onClick={() => setUsername2('')}
                                            className="ml-1 sm:ml-2 text-gray-400 hover:text-orange-400 transition-colors"
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
                        className={`bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition duration-300 flex items-center text-sm sm:text-base ${isBattling ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isBattling ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Battling...
                            </>
                        ) : (
                            'Code Battle 🔥'
                        )}
                    </button>
                </form>

                <div className="mt-8 sm:mt-12">
                    {!battleResults && !isBattling && (
                        <div className="flex justify-center">
                            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-[200px] md:h-[200px] overflow-hidden rounded-lg">
                                <img 
                                    src={loadingGif} 
                                    alt="LeetCode Battle Preview" 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    )}
                    
                    {battleResults && (
                        <div 
                            ref={resultsRef}
                            className="border-2 border-blue-500/30 rounded-lg p-3 sm:p-4 bg-gray-900/50 shadow-xl animate-fadeIn max-w-3xl mx-auto"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-400 text-center">Battle Results</h2>
                            
                            {/* LeetCode Stats Comparison - Simplified Head to Head Only */}
                            <div className="mb-6 p-3 bg-gray-800/70 rounded-lg">
                                <div className="grid grid-cols-3 items-center mb-4">
                                    <span className="font-medium text-cyan-400 text-center">{battleResults.user1?.name || username1}</span>
                                    <span className="text-xs bg-blue-600/50 px-2 py-1 rounded mx-auto">VS</span>
                                    <span className="font-medium text-orange-400 text-center">{battleResults.user2?.name || username2}</span>
                                </div>
                                
                                <div className="space-y-3">
                                    {renderStatComparison("Total Solved", 
                                        battleResults.user1?.stats?.totalSolved || 0, 
                                        battleResults.user2?.stats?.totalSolved || 0)}
                                    {renderStatComparison("Easy Problems", 
                                        battleResults.user1?.stats?.easySolved || 0, 
                                        battleResults.user2?.stats?.easySolved || 0)}
                                    {renderStatComparison("Medium Problems", 
                                        battleResults.user1?.stats?.mediumSolved || 0, 
                                        battleResults.user2?.stats?.mediumSolved || 0)}
                                    {renderStatComparison("Hard Problems", 
                                        battleResults.user1?.stats?.hardSolved || 0, 
                                        battleResults.user2?.stats?.hardSolved || 0)}
                                    {renderStatComparison("Ranking", 
                                        battleResults.user1?.stats?.ranking || 0, 
                                        battleResults.user2?.stats?.ranking || 0)}
                                </div>
                            </div>
                            
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
                                        const processedText = battleResults.battleResults?.replace(/\*(.*?)\*/g, '$1') || 
                                            "No battle results available";
                                        
                                        typewriter.typeString(processedText)
                                            .callFunction(() => {
                                                // Battle results typing completed
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

export default LeetCodeBattle;
