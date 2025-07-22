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
        const leetcodeResponse = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
        if (!leetcodeResponse.data) {
          apiFailed = true;
        } else if (leetcodeResponse.data.errors &&
            leetcodeResponse.data.errors.some(err => err.message === "That user does not exist.") &&
            leetcodeResponse.data.data.matchedUser === null) {
          userNotFound = true;
        } else {
          leetcodeData = leetcodeResponse.data;
          leetcodeData.username = username;
          leetcodeCache[username] = {
            data: leetcodeData,
            timestamp: Date.now()
          };
        }
      } catch (err) {
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
        avatarUrl: leetcodeData.avatar || `https://ui-avatars.com/api/?name=${username}&background=random`,
        name: leetcodeData.name || username
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
        const leetcode1Response = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${username1}`);
        if (leetcode1Response.data.errors &&
            leetcode1Response.data.errors.some(err => err.message === "That user does not exist.") &&
            leetcode1Response.data.data.matchedUser === null) {
          return res.status(404).json({ error: `LeetCode user ${username1} not found` });
        }
        user1Data = leetcode1Response.data;
        user1Data.username = username1;
        leetcodeCache[username1] = {
          data: user1Data,
          timestamp: Date.now()
        };
      } catch (err) {
        apiFailed1 = true;
        user1Data = { username: username1, apiError: true };
      }
    }
    if (cached2 && (Date.now() - cached2.timestamp < CACHE_TTL)) {
      user2Data = cached2.data;
    } else {
      try {
        const leetcode2Response = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${username2}`);
        if (leetcode2Response.data.errors &&
            leetcode2Response.data.errors.some(err => err.message === "That user does not exist.") &&
            leetcode2Response.data.data.matchedUser === null) {
          return res.status(404).json({ error: `LeetCode user ${username2} not found` });
        }
        user2Data = leetcode2Response.data;
        user2Data.username = username2;
        leetcodeCache[username2] = {
          data: user2Data,
          timestamp: Date.now()
        };
      } catch (err) {
        apiFailed2 = true;
        user2Data = { username: username2, apiError: true };
      }
    }
    
    // Generate battle results using Gemini
    const battleResults = await generateLeetcodeBattleWithGemini(user1Data, user2Data);
    
    res.json({
      user1: {
        username: username1,
        avatarUrl: user1Data.avatar || `https://ui-avatars.com/api/?name=${username1}&background=random`,
        name: user1Data.name || username1,
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
        avatarUrl: user2Data.avatar || `https://ui-avatars.com/api/?name=${username2}&background=random`,
        name: user2Data.name || username2,
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
