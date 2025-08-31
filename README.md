📚 AI-Powered Learning Website - README
🚀 Overview
The AI-Powered Learning Website is an interactive learning platform that integrates multiple learning and productivity tools. It enables learners to explore curated learning resources, generate AI-powered quizzes, track their progress, and manage their educational journey seamlessly in one place.

✨ Features
🎓 Learning Path – Personalized plan for learners

❓ AI Quiz Generator – Generate and answer quizzes instantly

📖 Learning Resources – Curated materials from YouTube, Udemy, Coursera, GitHub, Medium, & Dev.to

📝 Document Analyzer – Upload text/documents and extract intelligent insights

🔍 ATS Resume Checker – Check your resume against ATS filters

✅ Task Management – To-Do List, Progress Tracker, and Bookbank for resources

🌙 Modern UI/UX – Responsive layout with light/dark mode

🛠️ Tech Stack
Frontend: React + Vite

Styling: TailwindCSS

Icons: Lucide React, React Icons

AI API: Google Gemini API

Backend APIs: External APIs (YouTube, Dev.to, Medium, etc.)

Deployment: Vercel

⚡ Installation & Setup
Prerequisites
Node.js (v14 or higher)

npm or yarn

Google Gemini API Key (Get it here)

Environment Setup
Create a .env file in both frontend and backend directories

Add your Gemini API key to both files:

Frontend/.env:

env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
Backend/.env:

env
GEMINI_API_KEY=your_gemini_api_key_here
Frontend Setup
bash
# Clone repository
git clone https://github.com/DharanSJIT/AI_learning_website.git

# Navigate to project
cd frontend

# Install dependencies
npm install

# Run locally
npm run dev
Backend Setup
bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run locally
node server.js


📁 Project Structure
text
AI_learning_website/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   ├── .env               # Environment variables (add your GEMINI_API_KEY)
│   └── package.json
├── backend/
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── .env               # Environment variables (add your GEMINI_API_KEY)
│   └── server.js          # Server entry point
└── README.md


🔑 API Key Configuration
To use the AI features, you need to obtain a Google Gemini API key:

Visit Google AI Studio

Create an API key

Replace your_gemini_api_key_here in both .env files with your actual API key

Never commit your .env files to version control

🌐 Live Demo
👉 AI Learning Hub

🎯 Key Highlights
🚀 AI-Powered Learning Hub is an all-in-one platform built with React + TailwindCSS.
🎓 Explore curated resources from YouTube, Udemy, Coursera, GitHub, Medium & Dev.to.
❓ Create and attempt AI-powered quizzes tailored to any chosen topic.
📊 Track progress, manage notes, and enhance learning with interactive tools.
🌙 Responsive, modern, and optimized with dark/light mode support.

🤝 Contributing
We welcome contributions! Please feel free to submit a Pull Request.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📞 Contact
For any queries, please reach out to us at:

Email: contact@ailearninghub.com

GitHub: DharanSJIT

🙏 Acknowledgments
Icons by Lucide and React Icons

UI inspiration from various educational platforms

API providers: YouTube, Udemy, Coursera, GitHub, Medium, Dev.to

AI capabilities powered by Google Gemini API

<div align="center">
⭐️ Don't forget to star this repository if you find it helpful!
</div>