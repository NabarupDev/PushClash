# PushClash - GitHub & LeetCode Profile & Portfolio Analyzer

<div align="center">
  <img src="https://github.com/user-attachments/assets/076dd881-070c-47d3-9bb4-1340418bd5f9" alt="PushClash Logo" width="200" />
  <br />
  <h3>The ultimate tool for analyzing and roasting GitHub profiles, LeetCode profiles, and portfolios</h3>
  <p>Built with React, Node.js, TailwindCSS, and Gemini AI</p>
</div>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demos">Demos</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

## 📋 Overview

PushClash is a full-stack web application that helps developers gain insights about GitHub profiles, LeetCode profiles, and portfolio websites with a twist of humor. The platform offers five main services: GitHub profile roasting, LeetCode profile analysis, head-to-head profile battles for both platforms, and portfolio website analysis.

The project combines powerful API integrations with Google's Gemini AI to generate personalized, entertaining feedback that's both funny and insightful. The application is designed with a clean, modern UI and responsive design to provide an excellent user experience across all devices.

## ✨ Features

### 🔥 GitHub Profile Roasting
- Enter any GitHub username to receive a detailed, humorous analysis
- AI-powered insights on coding habits, repository quality, and commit patterns
- Personalized feedback on strengths and areas for improvement

### ⚔️ GitHub Battle
- Compare two GitHub users head-to-head in a coding showdown
- AI-generated battle report analyzing strengths and weaknesses
- Entertaining commentary with a clear winner declaration

### 🧠 LeetCode Profile Analysis
- Enter any LeetCode username for a customized roast
- Detailed breakdown of problem-solving statistics and rankings
- Humorous commentary on coding skills and problem-solving patterns

### 🏆 LeetCode Battle
- Compare two LeetCode profiles in a coding skills competition
- Side-by-side stats comparison of solved problems and difficulty levels
- AI-generated analysis of who has superior problem-solving abilities

### 🎨 Portfolio Website Analysis
- Submit any portfolio URL for comprehensive technical assessment
- Evaluation of design, content, performance, and technical implementation
- Detailed feedback with actionable improvement suggestions

## 🎬 Demos

### Home Page
![Home Page](https://github.com/user-attachments/assets/eef3a529-25bd-4976-8fca-e5e97e663064)

### GitHub Roast
https://github.com/user-attachments/assets/7f654675-1102-4ee3-bc9c-4a15fc2fe57e

### GitHub Battle
https://github.com/user-attachments/assets/deee9174-7a0b-4138-8655-bfe0ef0a7477

### LeetCode Roast
https://github.com/user-attachments/assets/leetcode-roast-preview

### LeetCode Battle
https://github.com/user-attachments/assets/leetcode-battle-preview

### Portfolio Analysis
https://github.com/user-attachments/assets/bcb93aeb-ef83-4450-bed6-1b4e4ffaf4bb

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: 
  - TypeWriter Effect
  - dotLottie for loading states
- **State Management**: React Hooks
- **Notifications**: React Toastify
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: Google Generative AI (Gemini)
- **Web Scraping**: Puppeteer
- **API Integration**: GitHub API, LeetCode API
- **Deployment**: Render

## 🏗 Architecture

PushClash follows a client-server architecture:

```
┌─────────────────┐       ┌─────────────────┐      ┌───────────────────┐
│                 │       │                 │      │                   │
│  React Frontend ├───────►  Node Backend   ├──────►   External APIs   │
│     (Vite)      │       │  (Express.js)   │      │ (GitHub, LeetCode,│
│                 │       │                 │      │     Gemini)       │
└─────────────────┘       └─────────────────┘      └───────────────────┘
```

- **Frontend**: Handles UI rendering, user interactions, and API calls to the backend
- **Backend**: Processes requests, communicates with external APIs, and returns formatted data
- **External Services**:
  - GitHub API: Fetches user data, repositories, and statistics
  - LeetCode API: Fetches user statistics and problem-solving data
  - Gemini AI: Generates personalized roasts and battle analysis
  - Puppeteer: Performs website scraping for portfolio analysis

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- GitHub Personal Access Token
- Google Gemini API Key

### Frontend Setup
```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Create .env file with API endpoints
echo "VITE_ROAST_BASE_URL=http://localhost:3000" > .env
echo "VITE_PROFILE_IMAGE_API_BASE_URL=http://localhost:3000" >> .env

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file with required API keys
cat << EOF > .env
GITHUB_TOKEN=your_github_personal_access_token
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
EOF

# Start development server
npm run dev
```

## 📁 Project Structure

```
PushClash/
├── Frontend/     # React frontend application
│   ├── public/                # Static assets
│   ├── src/                   # Source files
│   │   ├── assets/           # Images and static resources
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Roast.jsx     # GitHub profile roasting
│   │   │   ├── Battle.jsx    # GitHub profile battle
│   │   │   ├── LeetCode.jsx  # LeetCode profile roasting
│   │   │   ├── LeetCodeBattle.jsx # LeetCode profile battle
│   │   │   └── Portfolio.jsx # Portfolio analysis
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # Tailwind CSS configuration
│
├── Backend/      # Node.js backend application
│   ├── routes/                # API route definitions
│   │   ├── battle.js         # Battle endpoints
│   │   ├── github.js         # GitHub API endpoints
│   │   ├── portfolio.js      # Portfolio analysis endpoints
│   │   └── roast.js          # Roast generation endpoints
│   ├── services/              # Business logic layer
│   │   ├── ai-service.js     # Gemini AI integration
│   │   └── github-service.js # GitHub API service
│   ├── utils/                 # Utility functions
│   │   └── text-utils.js     # Text processing utilities
│   ├── index.js               # Application entry point
│   └── package.json           # Backend dependencies
│
└── README.md                   # Project documentation
```

## 📘 API Documentation

### GitHub User Endpoints

#### Get User Profile Image
```
GET /github/profile-image/:username
```
Returns the profile image URL for a GitHub user.

#### Get User Details
```
GET /github/user/:username
```
Returns detailed user profile information.

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
Generates an AI-powered roast for a LeetCode user.

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
Compares two GitHub users with humorous analysis.

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
Compares two LeetCode users with humorous analysis.

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
Creates a humorous critique of a portfolio website.

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
Analyzes a website's performance, accessibility, and SEO.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

## 🔑 Key Components

### Frontend Components

- **Navbar**: Navigation component with adaptive dark/light mode support
- **Home**: Landing page with feature highlights and getting started guide
- **Roast**: GitHub profile analysis page with typewriter effect for results
- **Battle**: Head-to-head comparison tool for GitHub profiles
- **LeetCode**: LeetCode profile analysis with problem-solving statistics
- **LeetCodeBattle**: Head-to-head comparison tool for LeetCode profiles
- **Portfolio**: Website analysis page with technical assessment features
- **Footer**: Contains attribution and developer contact information

### Backend Services

- **GitHub Service**: Handles all GitHub API integrations for fetching user data
- **AI Service**: Manages interactions with Google Gemini for generating content
- **Web Scraping Service**: Uses Puppeteer to analyze website content and performance
- **LeetCode Service**: Integrates with LeetCode API for user statistics

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Add environment variables for API endpoints
4. Deploy

### Backend Deployment (Railway/Render)

1. Connect your GitHub repository to Railway or Render
2. Configure build settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Add environment variables for API keys and tokens
4. Deploy

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nabarup Roy**

- Website: [nabaruproy.me](https://nabaruproy.me/)
- GitHub: [@NabarupDev](https://github.com/NabarupDev)
- LinkedIn: [Nabarup Roy](https://linkedin.com/in/nabarup-roy)

## 🙏 Acknowledgments

- GitHub API for providing the data
- LeetCode API for providing coding statistics
- Google Gemini AI for powering the intelligent roasts
- All open-source libraries and tools used in this project
