const axios = require('axios');
const { cleanReadmeText } = require('../utils/text-utils');

const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  'User-Agent': 'GitHub-Roaster-App',
};

// Get User Profile
async function getUserProfile(username) {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, { headers });
    return response.data;
  } catch (err) {
    //console.error('Error fetching user profile:', err.response?.data?.message || err.message);
    throw err;
  }
}

// Get User Profile Image
async function getUserProfileImage(username) {
  try {
    const profile = await getUserProfile(username);
    return profile.avatar_url;
  } catch (err) {
    //console.error('Error fetching user profile image:', err.message);
    throw err;
  }
}

// Get User Repositories
async function getUserRepos(username) {
  try {
    // Sort by created date in descending order (newest first)
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=created&direction=desc`,
      { headers }
    );
    return response.data;
  } catch (err) {
    //console.error('Error fetching user repos:', err.response?.data?.message);
    return [];
  }
}

// Get Repository Languages
async function getRepoLanguages(username, repoName) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/languages`,
      { headers }
    );
    return response.data;
  } catch (err) {
    //console.error(`Error fetching languages for ${repoName}:`, err.response?.data?.message);
    return {};
  }
}

// Get README of a Repo
async function getRepoReadme(username, repoName) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/readme`, {
      headers: { ...headers, Accept: 'application/vnd.github.v3.raw' },
    });
    return cleanReadmeText(response.data);
  } catch (err) {
    //console.error(`No README in ${repoName}:`, err.response?.data?.message);
    return null;
  }
}

function prepareUserData(profile, repos) {
  const userData = {
    username: profile.login,
    name: profile.name || profile.login,
    bio: profile.bio || "No bio provided",
    followers: profile.followers,
    following: profile.following,
    publicRepos: profile.public_repos,
    company: profile.company || "Not specified",
    location: profile.location || "Not specified",
    blog: profile.blog || "Not specified",
    createdAt: profile.created_at,
    
    // Top repos
    topRepos: repos.slice(0, 5).map(repo => ({
      name: repo.name,
      description: repo.description || "No description",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language
    }))
  };
  
  return userData;
}

module.exports = {
  getUserProfile,
  getUserProfileImage,
  getUserRepos,
  getRepoLanguages,
  getRepoReadme,
  prepareUserData
};
