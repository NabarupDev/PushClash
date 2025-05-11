const express = require('express');
const router = express.Router();
const { generateRoastWithGemini } = require('../services/ai-service');
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

module.exports = router;
