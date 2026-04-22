🚀 EduFlex  
🧠 AI-Powered Personalized Learning Platform  

EduFlex adapts to your learning style (Visual, Auditory, Reading, Kinesthetic) to deliver smarter, faster, and more engaging education.


✨ Features

🧠 AI-Powered Learning  
Generate structured, high-quality course content instantly using Google Gemini AI.

🎯 Adaptive Learning Styles  
🎨 Visual → Graphviz diagrams + curated YouTube videos  
🎧 Auditory → Text-to-speech learning  
📖 Reading → Structured notes + flashcards  
🛠️ Kinesthetic → Hands-on projects & challenges  

📈 Progress Tracking & Spaced Repetition  
Track learning streaks, history, and review schedules to improve retention.

📝 Knowledge Checks  
Auto-generated quizzes to test understanding after each topic.

💎 Interactive UI  
Modern glassmorphism UI with smooth animations powered by Framer Motion.


🧩 Tech Stack

🎨 Frontend  
⚛️ React.js (Vite)  
🎞️ Framer Motion  
🧭 React Router  
🎨 Lucide React  
📊 Graphviz-React  
📄 html2canvas & jspdf  

🛠️ Backend  
🟢 Node.js & Express.js  
🍃 MongoDB & Mongoose  
🔐 JWT Authentication  
🔑 Bcryptjs  
🤖 Google Gemini API  
📺 YouTube Data API v3  


⚙️ Prerequisites

💻 Node.js (v16 or higher)  
🍃 MongoDB (Local or Atlas)  

🔑 Required API Keys  
Google Gemini API  
YouTube Data API v3  


🧑‍💻 Local Setup

📥 Clone Repository  
```bash id="c1"
git clone https://github.com/RAGALLASAIGANESH/EduFlex.git
cd EduFlex

🛠️ Backend Setup

cd backend
npm install

Create a .env file inside backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
YOUTUBE_API_KEY=your_youtube_v3_api_key

Start backend server:

npm start
# or
npm run dev

🎨 Frontend Setup

cd frontend
npm install
npm run dev

🌐 Run the App

http://localhost:5173


📌 Usage

👤 Sign Up / Login
Create an account to track your progress

🧩 Onboarding
Complete the VARK questionnaire

📚 Learn
Enter a topic → Get AI-generated personalized content

📊 Dashboard
Track streaks, review topics, and monitor progress


🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repo and submit a PR 🚀
