const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getUserProfileImage,
  getUserRepos,
  getRepoLanguages,
  getRepoReadme
} = require('../services/github-service');

// Get user profile image
router.get('/profile-image/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const imageUrl = await getUserProfileImage(username);
    
    if (imageUrl) {
      return res.json({ imageUrl });
    } else {
      return res.status(404).json({ error: 'Profile image not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get user details
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const profile = await getUserProfile(username);
    const repos = await getUserRepos(username);
    const profileImage = profile.avatar_url;
    
    const repoDetails = [];
    
    for (const repo of repos.slice(0, 3)) { // limit to 3 for demo
      const languages = await getRepoLanguages(username, repo.name);
      const readme = await getRepoReadme(username, repo.name);
      
      repoDetails.push({
        name: repo.name,
        description: repo.description,
        languages,
        readme: readme ? readme.substring(0, 500) + (readme.length > 500 ? '...' : '') : null
      });
    }
    
    res.json({
      profile: {
        name: profile.name || profile.login,
        login: profile.login,
        bio: profile.bio || 'No bio provided',
        followers: profile.followers,
        following: profile.following,
        profileImage
      },
      repos: repoDetails
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
