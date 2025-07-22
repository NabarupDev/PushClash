const express = require('express');
const router = express.Router();
const { generateBattleWithGemini } = require('../services/ai-service');
const { getUserProfile, getUserRepos, prepareUserData } = require('../services/github-service');

// Simple in-memory cache
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const githubCache = {};

// Battle two GitHub users
router.post('/battle', async (req, res) => {
  try {
    const { username1, username2 } = req.body;
    
    if (!username1 || !username2) {
      return res.status(400).json({ error: "Two usernames are required" });
    }
    
    // Get profiles for both users (with cache)
    let profile1, profile2, repos1, repos2;
    let cached1 = githubCache[username1];
    let cached2 = githubCache[username2];
    if (cached1 && (Date.now() - cached1.timestamp < CACHE_TTL)) {
      profile1 = cached1.profile;
      repos1 = cached1.repos;
    } else {
      profile1 = await getUserProfile(username1);
      repos1 = await getUserRepos(username1);
      githubCache[username1] = {
        profile: profile1,
        repos: repos1,
        timestamp: Date.now()
      };
    }
    if (cached2 && (Date.now() - cached2.timestamp < CACHE_TTL)) {
      profile2 = cached2.profile;
      repos2 = cached2.repos;
    } else {
      profile2 = await getUserProfile(username2);
      repos2 = await getUserRepos(username2);
      githubCache[username2] = {
        profile: profile2,
        repos: repos2,
        timestamp: Date.now()
      };
    }
    
    // Prepare data for each user
    const user1Data = prepareUserData(profile1, repos1);
    const user2Data = prepareUserData(profile2, repos2);
    
    // Generate battle results using Gemini
    const battleResults = await generateBattleWithGemini(user1Data, user2Data);
    
    res.json({
      user1: {
        username: username1,
        avatarUrl: profile1.avatar_url,
        name: profile1.name || profile1.login
      },
      user2: {
        username: username2,
        avatarUrl: profile2.avatar_url,
        name: profile2.name || profile2.login
      },
      battleResults
    });
    
  } catch (error) {
    console.error('Battle error:', error);
    res.status(500).json({ 
      error: "Failed to generate battle results",
      message: error.message
    });
  }
});

module.exports = router;
