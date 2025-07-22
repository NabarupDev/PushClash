const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateBattleWithGemini(user1Data, user2Data) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Craft a detailed prompt for Gemini
    const prompt = `
    You need to behave as an evaluator comparing two GitHub users. 
    
    Developer 1: ${user1Data.name} (${user1Data.username})
    - Bio: ${user1Data.bio}
    - Followers: ${user1Data.followers}
    - Following: ${user1Data.following}
    - Public Repos: ${user1Data.publicRepos}
    - Company: ${user1Data.company}
    - Location: ${user1Data.location}
    - GitHub member since: ${new Date(user1Data.createdAt).toLocaleDateString()}
    - Top Repositories: ${user1Data.topRepos.map(repo => 
        `${repo.name} (${repo.stars} stars, ${repo.forks} forks, Main language: ${repo.language || 'Not specified'})`
      ).join(', ')}
    
    Developer 2: ${user2Data.name} (${user2Data.username})
    - Bio: ${user2Data.bio}
    - Followers: ${user2Data.followers}
    - Following: ${user2Data.following}
    - Public Repos: ${user2Data.publicRepos}
    - Company: ${user2Data.company}
    - Location: ${user2Data.location}
    - GitHub member since: ${new Date(user2Data.createdAt).toLocaleDateString()}
    - Top Repositories: ${user2Data.topRepos.map(repo => 
        `${repo.name} (${repo.stars} stars, ${repo.forks} forks, Main language: ${repo.language || 'Not specified'})`
      ).join(', ')}
    
    Evaluate both user profiles. For the user with the weaker profile, roast them harshly and make jokes about them - use strong language if needed. For the user with the better profile, praise them enthusiastically. If both profiles are roughly equal, praise both users.
    
    Analyze their stats, repository quality, and GitHub presence. Include emojis in your response.
    Your response should be direct as if you're talking to them. Don't include any meta-text or labels.
    Ignore any links in the data. Don't print any [object] references.
    
    Keep your response medium length - not too short, not too long. Make sure to heavily criticize the weaker profile in a humorous way. 
    
    Your entire response will be passed directly to a frontend, so only include the evaluation text.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    //console.log("Gemini response:", response);
    return response.text();
  } catch (error) {
    console.error("Error generating battle with Gemini:", error);
    throw new Error("Failed to generate battle results");
  }
}

async function generateRoastWithGemini(userData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // If user not found, instruct Gemini to respond accordingly
    if (userData.userNotFound) {
      const prompt = `
      We tried to fetch GitHub data for user "${userData.username}" but they do not exist on GitHub (404 error). Please roast us (the backend team) for failing to find the user, and let the requester know that the user does not exist, so you can't roast them. Be funny, self-deprecating, and include emojis.
      `;
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    }

    const prompt = `
    You need to behave as a professional roaster reviewing a GitHub user.
    
    Developer: ${userData.name} (${userData.username})
    - Bio: ${userData.bio}
    - Followers: ${userData.followers}
    - Following: ${userData.following}
    - Public Repos: ${userData.publicRepos}
    - Company: ${userData.company}
    - Location: ${userData.location}
    - GitHub member since: ${new Date(userData.createdAt).toLocaleDateString()}
    - Top Repositories: ${userData.topRepos.map(repo => 
        `${repo.name} (${repo.stars} stars, ${repo.forks} forks, Main language: ${repo.language || 'Not specified'})`
      ).join(', ')}
    
    Roast this GitHub profile mercilessly. Be creative, harsh, and funny. Point out weaknesses in their GitHub stats, repository quality, commit frequency, or any other aspects you can infer.
    
    Use strong language, be sarcastic, include pop culture references, and don't hold back. Include appropriate emojis to emphasize your points.
    
    Your response should be direct as if you're talking to them. Don't include any meta-text or labels.
    Ignore any links in the data. Don't print any [object] references.
    
    Keep your response medium length - not too short, not too long. Make sure the roast is humorous but brutal.
    
    Your entire response will be passed directly to a frontend, so only include the roast text.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    //console.log("Gemini roast response:", response);
    return response.text();
  } catch (error) {
    console.error("Error generating roast with Gemini:", error);
    throw new Error("Failed to generate roast results");
  }
}

async function generatePortfolioRoastWithGemini(url, scrapeData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const {
      basic = {},
      metrics = {},
      issues = {},
      seo = {},
      links = {},
      responsiveCheck = [],
      images = {},
      forms = [],
      resourceSizes = [],
      githubLinks = []
    } = scrapeData;
    
    const loadTime = metrics.loadTime || 'unknown';
    const jsErrors = issues.jsErrors?.length || 0;
    const missingMetaTags = issues.missingMetaTags?.length || 0;
    const accessibilityIssues = issues.accessibilityViolations?.length || 0;
    
    const imageIssues = images.withoutAlt || 0;
    const largeImages = images.largeImages || 0;

    const responsiveIssues = responsiveCheck
      .filter(check => check.overflowingElements?.length > 0)
      .map(check => `${check.viewport} (${check.overflowingElements.length} issues)`)
      .join(', ');
      
    const hasGithubLinks = githubLinks.length > 0;
    
    const totalJsSize = resourceSizes
      .filter(r => r.type === 'js')
      .reduce((sum, r) => sum + (r.size || 0), 0);
    const totalCssSize = resourceSizes
      .filter(r => r.type === 'css')
      .reduce((sum, r) => sum + (r.size || 0), 0);
    
    const prompt = `
    You need to behave as a harsh portfolio critic reviewing a developer's personal website or portfolio.
    
    Portfolio URL: ${url}
    Page Title: ${basic.title || 'No title found'}
    
    Technical Details:
    - Load Time: ${loadTime}ms
    - JS Errors Found: ${jsErrors}
    - Missing SEO Meta Tags: ${missingMetaTags} 
    - Accessibility Issues: ${accessibilityIssues}
    - Images Without Alt Text: ${imageIssues} out of ${images.total || 0}
    - Large/Unoptimized Images: ${largeImages}
    - Responsive Issues: ${responsiveIssues || 'None detected'}
    - GitHub Links Present: ${hasGithubLinks ? 'Yes' : 'No'}
    
    Roast this portfolio website mercilessly. Be creative, harsh, and funny. Point out weaknesses in the website's design, performance, content quality, and technical implementation.
    
    VERY IMPORTANT: Keep your response STRICTLY between 175-200 words total. DO NOT exceed 175 words under any circumstances.
    
    Use strong language, be sarcastic, and include emojis to emphasize your points. Make the roast humorous but brutal.
    
    Structure your roast with:
    1. A catchy title/headline (one line)
    2. A brief overall assessment
    3. Key criticism points (design, performance, content)
    4. End with 2 specific improvement recommendations
    
    Your response should be direct as if you're talking to the portfolio owner. Don't include any meta-text or labels.
    Your entire response will be passed directly to a frontend, so only include the roast text.
    Remember to stay UNDER 225 words total.
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    //console.log("Gemini portfolio roast response generated");
    return response.text();
  } catch (error) {
    console.error("Error generating portfolio roast with Gemini:", error);
    throw new Error("Failed to generate portfolio roast results");
  }
}

async function generateLeetcodeRoastWithGemini(leetcodeData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // If API failed, instruct Gemini to respond accordingly
    if (leetcodeData.apiError) {
      const prompt = `
      We tried to fetch LeetCode data for user "${leetcodeData.username}" but our backend failed to get the data due to an error on our side (external API failure). Please roast us (the backend team) for failing to get the data, and let the user know it's our fault, not theirs. Be funny, self-deprecating, and include emojis.
      `;
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    }

    // If user not found, instruct Gemini to respond accordingly
    if (leetcodeData.userNotFound) {
      const prompt = `
      We tried to fetch LeetCode data for user "${leetcodeData.username}" but they do not exist on LeetCode. Please roast us (the backend team) for failing to find the user, and let the requester know that the user does not exist, so you can't roast them. Be funny, self-deprecating, and include emojis.
      `;
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    }

    // Check if the data indicates user doesn't exist
    if (leetcodeData.errors && 
        leetcodeData.errors.some(err => err.message === "That user does not exist.") &&
        leetcodeData.data.matchedUser === null) {
      return "No data found, user does not exist. I can't roast what isn't there! 👻";
    }
    
    const prompt = `
    You need to behave as a professional roaster reviewing a LeetCode user.
    
    LeetCode User: ${leetcodeData.username}
    - Total Solved Problems: ${leetcodeData.totalSolved || 0}
    - Easy Problems: ${leetcodeData.easySolved || 0}/${leetcodeData.totalEasy || 0}
    - Medium Problems: ${leetcodeData.mediumSolved || 0}/${leetcodeData.totalMedium || 0}
    - Hard Problems: ${leetcodeData.hardSolved || 0}/${leetcodeData.totalHard || 0}
    - Acceptance Rate: ${leetcodeData.acceptanceRate || 'N/A'}
    - Contest Rating: ${leetcodeData.rating || 'N/A'}
    - Contest Ranking: ${leetcodeData.ranking || 'N/A'}
    - Badges: ${leetcodeData.badges ? JSON.stringify(leetcodeData.badges) : 'None'}
    - Submissions in Past Year: ${leetcodeData.submissionCalendar ? 'Available' : 'Not available'}
    
    Roast this LeetCode profile mercilessly. Be creative, harsh, and funny. Point out weaknesses in their solving patterns, problem selection, consistency, or any other aspects you can infer.
    
    For example, if they've solved mostly easy problems and few medium/hard ones, mock them for avoiding challenges. If they have a low acceptance rate, tease them about submitting without thinking. If they've solved many problems but have a poor rating, joke about quantity over quality.
    
    Use strong language, be sarcastic, include pop culture references, and don't hold back. Include appropriate emojis to emphasize your points.
    
    Your response should be direct as if you're talking to them. Don't include any meta-text or labels.
    
    Keep your response medium length - not too short, not too long. Make sure the roast is humorous but brutal.
    
    Your entire response will be passed directly to a frontend, so only include the roast text.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating LeetCode roast with Gemini:", error);
    throw new Error("Failed to generate LeetCode roast results");
  }
}

async function generateLeetcodeBattleWithGemini(user1Data, user2Data) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // If either API failed, instruct Gemini to respond accordingly
    if (user1Data.apiError || user2Data.apiError) {
      const failedUsers = [user1Data, user2Data].filter(u => u.apiError).map(u => u.username).join(' and ');
      const prompt = `
      We tried to fetch LeetCode data for user(s) "${failedUsers}" but our backend failed to get the data due to an error on our side (external API failure). Please roast us (the backend team) for failing to get the data, and let the users know it's our fault, not theirs. Be funny, self-deprecating, and include emojis.
      `;
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    }

    // Check if either user doesn't exist
    if ((user1Data.errors && 
         user1Data.errors.some(err => err.message === "That user does not exist.") &&
         user1Data.data.matchedUser === null) ||
        (user2Data.errors && 
         user2Data.errors.some(err => err.message === "That user does not exist.") &&
         user2Data.data.matchedUser === null)) {
      return "One or both users don't exist on LeetCode. I can't compare what isn't there! 👻";
    }
    
    // Craft a detailed prompt for Gemini
    const prompt = `
    You need to behave as an evaluator comparing two LeetCode users. 
    
    User 1: ${user1Data.username}
    - Total Solved Problems: ${user1Data.totalSolved || 0}
    - Easy Problems: ${user1Data.easySolved || 0}/${user1Data.totalEasy || 0}
    - Medium Problems: ${user1Data.mediumSolved || 0}/${user1Data.totalMedium || 0}
    - Hard Problems: ${user1Data.hardSolved || 0}/${user1Data.totalHard || 0}
    - Acceptance Rate: ${user1Data.acceptanceRate || 'N/A'}
    - Contest Rating: ${user1Data.rating || 'N/A'}
    - Contest Ranking: ${user1Data.ranking || 'N/A'}
    
    User 2: ${user2Data.username}
    - Total Solved Problems: ${user2Data.totalSolved || 0}
    - Easy Problems: ${user2Data.easySolved || 0}/${user2Data.totalEasy || 0}
    - Medium Problems: ${user2Data.mediumSolved || 0}/${user2Data.totalMedium || 0}
    - Hard Problems: ${user2Data.hardSolved || 0}/${user2Data.totalHard || 0}
    - Acceptance Rate: ${user2Data.acceptanceRate || 'N/A'}
    - Contest Rating: ${user2Data.rating || 'N/A'}
    - Contest Ranking: ${user2Data.ranking || 'N/A'}
    
    Evaluate both user profiles. For the user with the weaker profile, roast them harshly and make jokes about them - use strong language if needed. For the user with the better profile, praise them enthusiastically. If both profiles are roughly equal, praise both users.
    
    Compare them based on:
    1. Overall problem-solving skills (total problems solved)
    2. Problem difficulty balance (ratio of easy/medium/hard problems)
    3. Contest performance (rating and ranking)
    4. Code quality (acceptance rate)
    
    Include emojis in your response. Your response should be direct as if you're talking to them. Don't include any meta-text or labels.
    
    Keep your response medium length - not too short, not too long. Make sure to heavily criticize the weaker profile in a humorous way.
    
    Your entire response will be passed directly to a frontend, so only include the evaluation text.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating LeetCode battle with Gemini:", error);
    throw new Error("Failed to generate LeetCode battle results");
  }
}

module.exports = {
  generateBattleWithGemini,
  generateRoastWithGemini,
  generatePortfolioRoastWithGemini,
  generateLeetcodeRoastWithGemini,
  generateLeetcodeBattleWithGemini
};
