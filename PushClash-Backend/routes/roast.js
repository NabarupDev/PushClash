const express = require('express');
const router = express.Router();
const axios = require('axios');
const { 
  generateRoastWithGemini, 
  generateLeetcodeRoastWithGemini,
  generateLeetcodeBattleWithGemini
} = require('../services/ai-service');
const { getUserProfile, getUserRepos, prepareUserData } = require('../services/github-service');

// Roast a single GitHub user
router.post('/roast', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    // Get profile for user
    const profile = await getUserProfile(username);
    
    // Get repos for user
    const repos = await getUserRepos(username);
    
    // Prepare data for user
    const userData = prepareUserData(profile, repos);
    
    // Generate roast using Gemini
    const roastResult = await generateRoastWithGemini(userData);
    
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
    
    // Fetch LeetCode user data from the provided API
    const leetcodeResponse = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
    
    if (!leetcodeResponse.data) {
      return res.status(404).json({ error: "LeetCode API is unavailable" });
    }
    
    // Check if the response contains errors indicating the user doesn't exist
    if (leetcodeResponse.data.errors && 
        leetcodeResponse.data.errors.some(err => err.message === "That user does not exist.") &&
        leetcodeResponse.data.data.matchedUser === null) {
      return res.status(404).json({ error: "LeetCode user not found" });
    }
    
    const leetcodeData = leetcodeResponse.data;
    
    // Add username to the data for reference in the prompt
    leetcodeData.username = username;
    
    // Generate roast using Gemini
    const roastResult = await generateLeetcodeRoastWithGemini(leetcodeData);
    
    res.json({
      user: {
        username: username,
        // Use the LeetCode avatar if available, or a placeholder
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
    
    // Fetch LeetCode data for both users
    const [leetcode1Response, leetcode2Response] = await Promise.all([
      axios.get(`https://leetcode-api-faisalshohag.vercel.app/${username1}`),
      axios.get(`https://leetcode-api-faisalshohag.vercel.app/${username2}`)
    ]);
    
    // Check if the response for user1 indicates the user doesn't exist
    if (leetcode1Response.data.errors && 
        leetcode1Response.data.errors.some(err => err.message === "That user does not exist.") &&
        leetcode1Response.data.data.matchedUser === null) {
      return res.status(404).json({ error: `LeetCode user ${username1} not found` });
    }
    
    // Check if the response for user2 indicates the user doesn't exist
    if (leetcode2Response.data.errors && 
        leetcode2Response.data.errors.some(err => err.message === "That user does not exist.") &&
        leetcode2Response.data.data.matchedUser === null) {
      return res.status(404).json({ error: `LeetCode user ${username2} not found` });
    }
    
    const user1Data = leetcode1Response.data;
    const user2Data = leetcode2Response.data;
    
    // Add usernames to the data for reference in the prompt
    user1Data.username = username1;
    user2Data.username = username2;
    
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
