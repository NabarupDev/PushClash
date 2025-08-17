const express = require('express');
const router = express.Router();
const axios = require('axios');
const { 
  generateRoastWithGemini, 
  generateLeetcodeRoastWithGemini,
  generateLeetcodeBattleWithGemini
} = require('../services/ai-service');
const { getUserProfile, getUserRepos, prepareUserData } = require('../services/github-service');

// Simple in-memory cache
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const githubCache = {};
const leetcodeCache = {};

// Roast a single GitHub user
router.post('/roast', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Check cache
    let cached = githubCache[username];
    let profile, repos;
    let userNotFound = false;
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      profile = cached.profile;
      repos = cached.repos;
    } else {
      try {
        // Get profile for user
        profile = await getUserProfile(username);
        // Get repos for user
        repos = await getUserRepos(username);
        // Update cache
        githubCache[username] = {
          profile,
          repos,
          timestamp: Date.now()
        };
      } catch (err) {
        // If error is 404, user does not exist
        if (err.response && err.response.status === 404) {
          userNotFound = true;
        } else {
          throw err;
        }
      }
    }

    let roastResult;
    if (userNotFound) {
      // Send a special prompt to Gemini if user not found
      roastResult = await generateRoastWithGemini({ username, userNotFound: true });
      return res.json({
        user: {
          username: username,
          avatarUrl: null,
          name: username
        },
        roastResult
      });
    }

    // Prepare data for user
    const userData = prepareUserData(profile, repos);

    // Generate roast using Gemini
    roastResult = await generateRoastWithGemini(userData);

    res.json({
      user: {
        username: username,
        avatarUrl: profile.avatar_url,
        name: profile.name || profile.login
      },
      roastResult
    });

  } catch (error) {
    console.error('Roast error:', error);
    res.status(500).json({ 
      error: "Failed to generate roast",
      message: error.message
    });
  }
});

// Roast a LeetCode user
router.post('/leetcode-roast', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    // Check cache
    let cached = leetcodeCache[username];
    let leetcodeData;
    let apiFailed = false;
    let userNotFound = false;
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      leetcodeData = cached.data;
    } else {
      try {
        const leetcodeResponse = await axios.post('https://leetcode.com/graphql', {
          query: `query getFullProfile($username: String!) { 
            matchedUser(username: $username) { 
              username 
              githubUrl 
              linkedinUrl 
              twitterUrl 
              profile { 
                realName 
                userAvatar 
                aboutMe 
                countryName 
                company 
                school 
                jobTitle 
                ranking 
                reputation 
                starRating 
              } 
              badges { 
                id 
                name 
                displayName 
                icon 
                creationDate 
              } 
              submitStats { 
                acSubmissionNum { 
                  difficulty 
                  count 
                  submissions 
                } 
                totalSubmissionNum { 
                  difficulty 
                  count 
                  submissions 
                } 
              } 
              languageProblemCount { 
                languageName 
                problemsSolved 
              } 
              contestBadge { 
                name 
                expired 
                hoverText 
                icon 
              } 
            } 
          }`,
          variables: { username }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!leetcodeResponse.data || !leetcodeResponse.data.data) {
          apiFailed = true;
        } else if (leetcodeResponse.data.errors || !leetcodeResponse.data.data.matchedUser) {
          userNotFound = true;
        } else {
          const userData = leetcodeResponse.data.data.matchedUser;
          
          // Transform the GraphQL response to match the expected format
          leetcodeData = {
            username: userData.username,
            name: userData.profile?.realName || userData.username,
            avatar: userData.profile?.userAvatar,
            about: userData.profile?.aboutMe,
            country: userData.profile?.countryName,
            company: userData.profile?.company,
            school: userData.profile?.school,
            jobTitle: userData.profile?.jobTitle,
            ranking: userData.profile?.ranking,
            reputation: userData.profile?.reputation,
            starRating: userData.profile?.starRating,
            githubUrl: userData.githubUrl,
            linkedinUrl: userData.linkedinUrl,
            twitterUrl: userData.twitterUrl,
            badges: userData.badges,
            submitStats: userData.submitStats,
            languageProblemCount: userData.languageProblemCount,
            contestBadge: userData.contestBadge,
            
            // Calculate solved problems from submitStats
            totalSolved: userData.submitStats?.acSubmissionNum?.reduce((total, stat) => total + stat.count, 0) || 0,
            easySolved: userData.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Easy')?.count || 0,
            mediumSolved: userData.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Medium')?.count || 0,
            hardSolved: userData.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Hard')?.count || 0,
            
            // Calculate acceptance rate
            acceptanceRate: userData.submitStats?.acSubmissionNum && userData.submitStats?.totalSubmissionNum
              ? ((userData.submitStats.acSubmissionNum.reduce((total, stat) => total + stat.count, 0) / 
                  userData.submitStats.totalSubmissionNum.reduce((total, stat) => total + stat.count, 0)) * 100).toFixed(1)
              : 0,
            
            rating: userData.profile?.starRating || 0
          };
          
          leetcodeCache[username] = {
            data: leetcodeData,
            timestamp: Date.now()
          };
        }
      } catch (err) {
        console.error('LeetCode API error:', err.response?.data || err.message);
        apiFailed = true;
      }
    }

    // If API failed, send a special message to Gemini
    if (apiFailed) {
      leetcodeData = {
        username,
        apiError: true
      };
    }

    // If user not found, send a special message to Gemini
    if (userNotFound) {
      leetcodeData = {
        username,
        userNotFound: true
      };
    }
    
    // Generate roast using Gemini
    const roastResult = await generateLeetcodeRoastWithGemini(leetcodeData);
    
    res.json({
      user: {
        username: username,
        avatarUrl: leetcodeData?.avatar || `https://ui-avatars.com/api/?name=${username}&background=random`,
        name: leetcodeData?.name || username
      },
      leetcodeStats: {
        totalSolved: leetcodeData.totalSolved,
        easySolved: leetcodeData.easySolved,
        mediumSolved: leetcodeData.mediumSolved,
        hardSolved: leetcodeData.hardSolved,
        acceptanceRate: leetcodeData.acceptanceRate,
        rating: leetcodeData.rating,
        ranking: leetcodeData.ranking
      },
      roastResult
    });
    
  } catch (error) {
    console.error('LeetCode Roast error:', error);
    res.status(500).json({ 
      error: "Failed to generate LeetCode roast",
      message: error.message
    });
  }
});

// Battle between two LeetCode users
router.post('/leetcode-battle', async (req, res) => {
  try {
    const { username1, username2 } = req.body;
    
    if (!username1 || !username2) {
      return res.status(400).json({ error: "Two usernames are required" });
    }
    
    // Check cache for both users
    let user1Data, user2Data;
    let apiFailed1 = false, apiFailed2 = false;
    let cached1 = leetcodeCache[username1];
    let cached2 = leetcodeCache[username2];
    if (cached1 && (Date.now() - cached1.timestamp < CACHE_TTL)) {
      user1Data = cached1.data;
    } else {
      try {
        const leetcode1Response = await axios.post('https://leetcode.com/graphql', {
          query: `query getFullProfile($username: String!) { 
            matchedUser(username: $username) { 
              username 
              githubUrl 
              linkedinUrl 
              twitterUrl 
              profile { 
                realName 
                userAvatar 
                aboutMe 
                countryName 
                company 
                school 
                jobTitle 
                ranking 
                reputation 
                starRating 
              } 
              badges { 
                id 
                name 
                displayName 
                icon 
                creationDate 
              } 
              submitStats { 
                acSubmissionNum { 
                  difficulty 
                  count 
                  submissions 
                } 
                totalSubmissionNum { 
                  difficulty 
                  count 
                  submissions 
                } 
              } 
              languageProblemCount { 
                languageName 
                problemsSolved 
              } 
              contestBadge { 
                name 
                expired 
                hoverText 
                icon 
              } 
            } 
          }`,
          variables: { username: username1 }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!leetcode1Response.data || !leetcode1Response.data.data) {
          return res.status(500).json({ error: `Failed to fetch data for ${username1}` });
        } else if (leetcode1Response.data.errors || !leetcode1Response.data.data.matchedUser) {
          return res.status(404).json({ error: `LeetCode user ${username1} not found` });
        }
        
        const userData1 = leetcode1Response.data.data.matchedUser;
        
        // Transform the GraphQL response to match the expected format
        user1Data = {
          username: userData1.username,
          name: userData1.profile?.realName || userData1.username,
          avatar: userData1.profile?.userAvatar,
          about: userData1.profile?.aboutMe,
          country: userData1.profile?.countryName,
          company: userData1.profile?.company,
          school: userData1.profile?.school,
          jobTitle: userData1.profile?.jobTitle,
          ranking: userData1.profile?.ranking,
          reputation: userData1.profile?.reputation,
          starRating: userData1.profile?.starRating,
          githubUrl: userData1.githubUrl,
          linkedinUrl: userData1.linkedinUrl,
          twitterUrl: userData1.twitterUrl,
          badges: userData1.badges,
          submitStats: userData1.submitStats,
          languageProblemCount: userData1.languageProblemCount,
          contestBadge: userData1.contestBadge,
          
          // Calculate solved problems from submitStats
          totalSolved: userData1.submitStats?.acSubmissionNum?.reduce((total, stat) => total + stat.count, 0) || 0,
          easySolved: userData1.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Easy')?.count || 0,
          mediumSolved: userData1.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Medium')?.count || 0,
          hardSolved: userData1.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Hard')?.count || 0,
          
          // Calculate acceptance rate
          acceptanceRate: userData1.submitStats?.acSubmissionNum && userData1.submitStats?.totalSubmissionNum
            ? ((userData1.submitStats.acSubmissionNum.reduce((total, stat) => total + stat.count, 0) / 
                userData1.submitStats.totalSubmissionNum.reduce((total, stat) => total + stat.count, 0)) * 100).toFixed(1)
            : 0,
          
          rating: userData1.profile?.starRating || 0
        };
        
        leetcodeCache[username1] = {
          data: user1Data,
          timestamp: Date.now()
        };
      } catch (err) {
        console.error('LeetCode API error for user1:', err.response?.data || err.message);
        apiFailed1 = true;
        user1Data = { username: username1, apiError: true };
      }
    }
    if (cached2 && (Date.now() - cached2.timestamp < CACHE_TTL)) {
      user2Data = cached2.data;
    } else {
      try {
        const leetcode2Response = await axios.post('https://leetcode.com/graphql', {
          query: `query getFullProfile($username: String!) { 
            matchedUser(username: $username) { 
              username 
              githubUrl 
              linkedinUrl 
              twitterUrl 
              profile { 
                realName 
                userAvatar 
                aboutMe 
                countryName 
                company 
                school 
                jobTitle 
                ranking 
                reputation 
                starRating 
              } 
              badges { 
                id 
                name 
                displayName 
                icon 
                creationDate 
              } 
              submitStats { 
                acSubmissionNum { 
                  difficulty 
                  count 
                  submissions 
                } 
                totalSubmissionNum { 
                  difficulty 
                  count 
                  submissions 
                } 
              } 
              languageProblemCount { 
                languageName 
                problemsSolved 
              } 
              contestBadge { 
                name 
                expired 
                hoverText 
                icon 
              } 
            } 
          }`,
          variables: { username: username2 }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!leetcode2Response.data || !leetcode2Response.data.data) {
          return res.status(500).json({ error: `Failed to fetch data for ${username2}` });
        } else if (leetcode2Response.data.errors || !leetcode2Response.data.data.matchedUser) {
          return res.status(404).json({ error: `LeetCode user ${username2} not found` });
        }
        
        const userData2 = leetcode2Response.data.data.matchedUser;
        
        // Transform the GraphQL response to match the expected format
        user2Data = {
          username: userData2.username,
          name: userData2.profile?.realName || userData2.username,
          avatar: userData2.profile?.userAvatar,
          about: userData2.profile?.aboutMe,
          country: userData2.profile?.countryName,
          company: userData2.profile?.company,
          school: userData2.profile?.school,
          jobTitle: userData2.profile?.jobTitle,
          ranking: userData2.profile?.ranking,
          reputation: userData2.profile?.reputation,
          starRating: userData2.profile?.starRating,
          githubUrl: userData2.githubUrl,
          linkedinUrl: userData2.linkedinUrl,
          twitterUrl: userData2.twitterUrl,
          badges: userData2.badges,
          submitStats: userData2.submitStats,
          languageProblemCount: userData2.languageProblemCount,
          contestBadge: userData2.contestBadge,
          
          // Calculate solved problems from submitStats
          totalSolved: userData2.submitStats?.acSubmissionNum?.reduce((total, stat) => total + stat.count, 0) || 0,
          easySolved: userData2.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Easy')?.count || 0,
          mediumSolved: userData2.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Medium')?.count || 0,
          hardSolved: userData2.submitStats?.acSubmissionNum?.find(stat => stat.difficulty === 'Hard')?.count || 0,
          
          // Calculate acceptance rate
          acceptanceRate: userData2.submitStats?.acSubmissionNum && userData2.submitStats?.totalSubmissionNum
            ? ((userData2.submitStats.acSubmissionNum.reduce((total, stat) => total + stat.count, 0) / 
                userData2.submitStats.totalSubmissionNum.reduce((total, stat) => total + stat.count, 0)) * 100).toFixed(1)
            : 0,
          
          rating: userData2.profile?.starRating || 0
        };
        
        leetcodeCache[username2] = {
          data: user2Data,
          timestamp: Date.now()
        };
      } catch (err) {
        console.error('LeetCode API error for user2:', err.response?.data || err.message);
        apiFailed2 = true;
        user2Data = { username: username2, apiError: true };
      }
    }
    
    // Generate battle results using Gemini
    const battleResults = await generateLeetcodeBattleWithGemini(user1Data, user2Data);
    
    res.json({
      user1: {
        username: username1,
        avatarUrl: user1Data?.avatar || `https://ui-avatars.com/api/?name=${username1}&background=random`,
        name: user1Data?.name || username1,
        stats: {
          totalSolved: user1Data.totalSolved,
          easySolved: user1Data.easySolved,
          mediumSolved: user1Data.mediumSolved,
          hardSolved: user1Data.hardSolved,
          acceptanceRate: user1Data.acceptanceRate,
          rating: user1Data.rating,
          ranking: user1Data.ranking
        }
      },
      user2: {
        username: username2,
        avatarUrl: user2Data?.avatar || `https://ui-avatars.com/api/?name=${username2}&background=random`,
        name: user2Data?.name || username2,
        stats: {
          totalSolved: user2Data.totalSolved,
          easySolved: user2Data.easySolved,
          mediumSolved: user2Data.mediumSolved,
          hardSolved: user2Data.hardSolved,
          acceptanceRate: user2Data.acceptanceRate,
          rating: user2Data.rating,
          ranking: user2Data.ranking
        }
      },
      battleResults
    });
    
  } catch (error) {
    console.error('LeetCode Battle error:', error);
    res.status(500).json({ 
      error: "Failed to generate LeetCode battle results",
      message: error.message
    });
  }
});

module.exports = router;
