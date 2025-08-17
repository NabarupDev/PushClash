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
    Real Name: ${leetcodeData.name || 'Not provided'}
    About: ${leetcodeData.about || 'No bio provided'}
    Country: ${leetcodeData.country || 'Unknown'}
    Company: ${leetcodeData.company || 'Unemployed/Not specified'}
    School: ${leetcodeData.school || 'Not specified'}
    Job Title: ${leetcodeData.jobTitle || 'Not specified'}
    
    Social Links:
    - GitHub: ${leetcodeData.githubUrl || 'None'}
    - LinkedIn: ${leetcodeData.linkedinUrl || 'None'}
    - Twitter: ${leetcodeData.twitterUrl || 'None'}
    
    LeetCode Stats:
    - Global Ranking: ${leetcodeData.ranking ? `#${leetcodeData.ranking}` : 'Not ranked/Too low to show'}
    - Contest Rating: ${leetcodeData.rating || 'No rating/Never participated'}
    - Star Rating: ${leetcodeData.starRating || 'No stars'}
    - Reputation: ${leetcodeData.reputation || 0}
    
    Problem Solving Stats:
    - Total Solved: ${leetcodeData.totalSolved || 0}
    - Easy Solved: ${leetcodeData.easySolved || 0}
    - Medium Solved: ${leetcodeData.mediumSolved || 0}
    - Hard Solved: ${leetcodeData.hardSolved || 0}
    - Acceptance Rate: ${leetcodeData.acceptanceRate || 'N/A'}%
    
    Badges Earned: ${leetcodeData.badges?.length ? 
      leetcodeData.badges.map(badge => badge.displayName || badge.name).join(', ') : 
      'No badges - completely badge-less'}
    
    Programming Languages Used: ${leetcodeData.languageProblemCount?.length ? 
      leetcodeData.languageProblemCount.map(lang => `${lang.languageName}: ${lang.problemsSolved} problems`).join(', ') : 
      'No language data available'}
    
    Contest Badge: ${leetcodeData.contestBadge ? 
      `${leetcodeData.contestBadge.name} ${leetcodeData.contestBadge.expired ? '(EXPIRED!)' : ''}` : 
      'No contest achievements'}
    
    Roast this LeetCode profile mercilessly. Be creative, harsh, and funny. Use their personal info, stats, and achievements (or lack thereof) to craft targeted insults.
    
    Focus on:
    1. Their problem-solving patterns (easy vs hard ratio)
    2. Contest participation and performance
    3. Professional background vs coding skills
    4. Social media presence vs actual skills
    5. Badge collection (or embarrassing lack thereof)
    6. Language preferences and diversity
    7. Overall ranking and reputation
    
    Mock them for things like: avoiding hard problems, having no contest rating, working at a no-name company, having empty social profiles, collecting meaningless badges, or having a pathetic global ranking.
    
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
    Real Name: ${user1Data.name || 'Not provided'}
    Country: ${user1Data.country || 'Unknown'}
    Company: ${user1Data.company || 'Unemployed/Not specified'}
    Job Title: ${user1Data.jobTitle || 'Not specified'}
    About: ${user1Data.about || 'No bio'}
    
    Social Links:
    - GitHub: ${user1Data.githubUrl || 'None'}
    - LinkedIn: ${user1Data.linkedinUrl || 'None'}
    - Twitter: ${user1Data.twitterUrl || 'None'}
    
    LeetCode Performance:
    - Global Ranking: ${user1Data.ranking ? `#${user1Data.ranking}` : 'Not ranked/Too low'}
    - Contest Rating: ${user1Data.rating || 'No rating/Never participated'}
    - Star Rating: ${user1Data.starRating || 'No stars'}
    - Reputation: ${user1Data.reputation || 0}
    - Total Solved: ${user1Data.totalSolved || 0}
    - Easy: ${user1Data.easySolved || 0}, Medium: ${user1Data.mediumSolved || 0}, Hard: ${user1Data.hardSolved || 0}
    - Acceptance Rate: ${user1Data.acceptanceRate || 'N/A'}%
    - Badges: ${user1Data.badges?.length || 0} badges
    - Languages: ${user1Data.languageProblemCount?.length ? 
        user1Data.languageProblemCount.map(lang => lang.languageName).join(', ') : 'None'}
    
    User 2: ${user2Data.username}
    Real Name: ${user2Data.name || 'Not provided'}
    Country: ${user2Data.country || 'Unknown'}
    Company: ${user2Data.company || 'Unemployed/Not specified'}
    Job Title: ${user2Data.jobTitle || 'Not specified'}
    About: ${user2Data.about || 'No bio'}
    
    Social Links:
    - GitHub: ${user2Data.githubUrl || 'None'}
    - LinkedIn: ${user2Data.linkedinUrl || 'None'}
    - Twitter: ${user2Data.twitterUrl || 'None'}
    
    LeetCode Performance:
    - Global Ranking: ${user2Data.ranking ? `#${user2Data.ranking}` : 'Not ranked/Too low'}
    - Contest Rating: ${user2Data.rating || 'No rating/Never participated'}
    - Star Rating: ${user2Data.starRating || 'No stars'}
    - Reputation: ${user2Data.reputation || 0}
    - Total Solved: ${user2Data.totalSolved || 0}
    - Easy: ${user2Data.easySolved || 0}, Medium: ${user2Data.mediumSolved || 0}, Hard: ${user2Data.hardSolved || 0}
    - Acceptance Rate: ${user2Data.acceptanceRate || 'N/A'}%
    - Badges: ${user2Data.badges?.length || 0} badges
    - Languages: ${user2Data.languageProblemCount?.length ? 
        user2Data.languageProblemCount.map(lang => lang.languageName).join(', ') : 'None'}
    
    Compare these two LeetCode warriors and determine the winner! For the superior coder, praise them enthusiastically. For the inferior one, roast them brutally and make jokes about their pathetic performance.
    
    Judge them on:
    1. Overall problem count and difficulty distribution
    2. Contest performance and ratings
    3. Global ranking and reputation
    4. Professional background vs actual skills
    5. Badge collection and achievements
    6. Programming language diversity
    7. Social media presence and networking
    
    Be especially harsh on:
    - Low rankings or no ranking at all
    - Avoiding hard problems
    - Never participating in contests
    - Working at unknown companies
    - Having empty profiles or bios
    - Limited language knowledge
    - Poor acceptance rates
    
    Use strong, creative language and don't hold back on the roasts. Include emojis and make it entertaining.
    
    If both users are roughly equal, you can praise both, but still point out their mutual weaknesses compared to top coders.
    
    Your response should be direct as if you're talking to both of them. Don't include any meta-text or labels.
    
    Keep your response medium length and make sure to heavily criticize the weaker profile in a humorous way.
    
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
