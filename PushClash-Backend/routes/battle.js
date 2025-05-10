const express = require('express');
const router = express.Router();
const { generateBattleWithGemini } = require('../services/ai-service');
const { getUserProfile, getUserRepos, prepareUserData } = require('../services/github-service');

// Battle two GitHub users
router.post('/battle', async (req, res) => {
  try {
    const { username1, username2 } = req.body;
    
    if (!username1 || !username2) {
      return res.status(400).json({ error: "Two usernames are required" });
    }
    
    // Get profiles for both users
    const [profile1, profile2] = await Promise.all([
      getUserProfile(username1),
      getUserProfile(username2)
    ]);
    
    // Get repos for both users
    const [repos1, repos2] = await Promise.all([
      getUserRepos(username1),
      getUserRepos(username2)
    ]);
    
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
    //console.error('Battle error:', error);
    res.status(500).json({ 
      error: "Failed to generate battle results",
      message: error.message
    });
  }
});

module.exports = router;
