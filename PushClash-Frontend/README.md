# PushClash - GitHub & LeetCode Profile Analyzer

<div align="center">
  <img src="https://github.com/user-attachments/assets/076dd881-070c-47d3-9bb4-1340418bd5f9" alt="PushClash Logo" width="200" />
  <br />
  <h3>The ultimate tool for analyzing and roasting GitHub profiles, LeetCode profiles, and portfolios</h3>
  <p>Built with React, Node.js, TailwindCSS, and Gemini AI</p>
</div>

PushClash is an interactive web application that helps developers analyze GitHub profiles, LeetCode profiles, compare users head-to-head, and receive insightful feedback on portfolio websites - all with a twist of humor and roasting.

## 📌 Project Overview

PushClash provides developers with a fun and engaging way to:
- Get humorous yet insightful analysis of GitHub profiles and coding habits
- Compare two GitHub profiles in a "battle" to see who comes out on top
- Analyze and roast LeetCode profiles based on problem-solving stats
- Compare two LeetCode profiles to determine the superior coder
- Analyze portfolio websites for design, content, and user experience

The platform uses AI to generate personalized roasts and insights while maintaining a playful tone that makes the feedback engaging and entertaining.

## ✨ Features

### 🔥 GitHub Profile Roasting
- Enter any GitHub username
- Get a detailed, humorous analysis of the user's repositories, commit patterns, and coding habits
- Personalized feedback on strengths and areas for improvement

### ⚔️ GitHub Battle
- Compare two GitHub users head-to-head
- AI-generated analysis of both profiles
- Determine the winner based on multiple factors
- Humorous commentary on the comparison

### 🧠 LeetCode Profile Roasting
- Enter any LeetCode username
- Get a humorous analysis of problem-solving stats and skill levels
- Review of easy, medium, and hard problems solved
- Ranking analysis with personalized feedback

### 🏆 LeetCode Battle
- Compare two LeetCode users in a coding showdown
- Side-by-side comparison of problem counts and rankings
- AI-generated analysis of who's the superior problem solver
- Entertaining commentary on coding skills and patterns

### 🎨 Portfolio Website Analysis
- Enter the URL of any portfolio website
- Receive feedback on design, content, user experience, and technical aspects
- AI-generated suggestions for improvement with a roasting twist

## 🛠️ Tech Stack

- **Frontend:**
  - React.js (built with Vite)
  - React Router for navigation
  - Tailwind CSS for styling
  - TypeWriter Effect for text animations
  - React Toastify for notifications
  - dotLottie for loading animations

- **Backend:** 
  - Node.js/Express (in the same repository under different folder)
  - GitHub API integration
  - LeetCode scraping and analysis
  - AI-powered analysis

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Setup Instructions
```bash
# Clone the repository
git clone https://github.com/NabarupDev/PushClash.git

# Navigate to the project directory
cd PushClash

# Install frontend dependencies
cd PushClash-Frontend
npm install
# or
yarn install

# Create a frontend .env file with the following variables
VITE_ROAST_BASE_URL=http://localhost:3000
VITE_PROFILE_IMAGE_API_BASE_URL=http://localhost:3000

# Start the frontend development server
npm run dev
# or
yarn dev

# In a new terminal, set up the backend
cd ../PushClash-Backend
npm install

# Create a backend .env file with your GitHub API token and other config
# Start the backend server
npm start
```

## 📸 Feature Previews

### Home Page
![Image](https://github.com/user-attachments/assets/eef3a529-25bd-4976-8fca-e5e97e663064)

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


You can also view all videos by cloning this repository and opening the files in the `src/demo/` directory in your media player.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/NabarupDev/PushClash/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.

## 👨‍💻 Author

**Nabarup Roy**

- Website: [nabaruproy.me](https://nabaruproy.me/)
- GitHub: [@NabarupDev](https://github.com/NabarupDev)
- LinkedIn: [Nabarup Roy](https://linkedin.com/in/nabarup-roy)
