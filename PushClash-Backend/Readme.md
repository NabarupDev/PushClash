# PushClash - Backend

A Node.js backend service that powers the GitHub Roaster application, allowing users to generate humorous roasts of GitHub profiles, create battles between users, analyze portfolio websites, and compare LeetCode profiles.

## Features

- **GitHub Profile Roasting**: Generates AI-powered humorous roasts based on GitHub profiles
- **Developer Battle**: Pits two GitHub users against each other for a comedic comparison
- **Portfolio Analysis**: Evaluates and roasts personal portfolio websites
- **Website Scraping**: Analyzes technical aspects of websites including SEO, accessibility, and performance
- **LeetCode Profile Analysis**: Generates roasts and comparisons of LeetCode profiles

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: Google Generative AI (Gemini)
- **Web Scraping**: Puppeteer
- **API Integration**: GitHub API, LeetCode API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GitHub Personal Access Token
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NabarupDev/PushClash.git
   cd PushClash-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your API keys to the `.env` file:
   ```
   GITHUB_TOKEN=your_github_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

5. Start the server:
   ```bash
   npm start
   ```

## API Documentation

### GitHub User Endpoints

#### Get User Profile Image
```
GET /github/profile-image/:username
```
Returns the profile image URL for a specific GitHub user.

#### Get User Details
```
GET /github/user/:username
```
Returns detailed user profile information and repository data.

### Roast Endpoints

#### Generate GitHub User Roast
```
POST /api/roast
```
Generates an AI-powered roast for a GitHub user.

**Request Body:**
```json
{
  "username": "githubUsername"
}
```

#### Generate LeetCode User Roast
```
POST /api/leetcode-roast
```
Generates an AI-powered roast based on a user's LeetCode profile.

**Request Body:**
```json
{
  "username": "leetcodeUsername"
}
```

### Battle Endpoints

#### Generate GitHub User Battle
```
POST /api/battle
```
Compares two GitHub users and generates a humorous battle analysis.

**Request Body:**
```json
{
  "username1": "firstGithubUsername",
  "username2": "secondGithubUsername"
}
```

#### Generate LeetCode User Battle
```
POST /api/leetcode-battle
```
Compares two LeetCode users and generates a humorous battle analysis based on their coding statistics.

**Request Body:**
```json
{
  "username1": "firstLeetCodeUsername",
  "username2": "secondLeetCodeUsername"
}
```

### Portfolio Analysis Endpoints

#### Get Portfolio Icon
```
POST /api/portfolio/icon
```
Fetches the favicon for a given website URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

#### Generate Portfolio Roast
```
POST /api/portfolio/roast
```
Creates a humorous AI-generated critique of a portfolio website.

**Request Body:**
```json
{
  "url": "https://example.com",
  "scrapeData": { /* Website analysis data */ }
}
```

#### Scrape Website
```
POST /api/scrape
```
Performs a comprehensive analysis of a website, examining technical aspects like performance, accessibility, and SEO.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

## Project Structure

```
PushClash-Backend/
├── index.js                  # Application entry point
├── .env.example              # Example environment variables
├── routes/                   # API route definitions
│   ├── battle.js            # Battle endpoint routes
│   ├── github.js            # GitHub API integration routes
│   ├── portfolio.js         # Portfolio analysis routes
│   └── roast.js             # Roast generation routes
├── services/                 # Business logic layer
│   ├── ai-service.js        # Gemini AI integration
│   └── github-service.js    # GitHub API service
└── utils/                    # Utility functions
    └── text-utils.js        # Text processing utilities
```

## Key Components

### AI Integration

The application uses Google's Gemini API to generate creative content. The implementation can be found in `services/ai-service.js`.

### GitHub API Integration

GitHub API calls are handled through dedicated service functions in `services/github-service.js`.

### LeetCode Integration

LeetCode profile data is fetched from a third-party API and processed to generate insightful and humorous roasts and comparisons.

### Web Scraping

Portfolio analysis is performed using Puppeteer for headless browser automation, enabling deep website inspection.

## Error Handling

The API implements comprehensive error handling for failed API calls, timeouts, and invalid inputs. All endpoints return appropriate HTTP status codes and error messages.

## Security Considerations

- GitHub tokens should have appropriate scopes and access levels
- Environment variables should be properly secured and never committed to version control
- Input validation is implemented on all endpoints

## 📝 License

This project is [MIT](LICENSE) licensed.

## 👨‍💻 Author

**Nabarup Roy**

- Website: [nabaruproy.me](https://nabaruproy.me/)
- GitHub: [@NabarupDev](https://github.com/NabarupDev)
- LinkedIn: [Nabarup Roy](https://linkedin.com/in/nabarup-roy)
