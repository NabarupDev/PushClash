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

module.exports = {
  generateBattleWithGemini,
  generateRoastWithGemini,
  generatePortfolioRoastWithGemini
};
