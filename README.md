# 📄 AI Resume Builder & ATS Optimization Platform

An intelligent, full-stack web application designed to help job seekers build ATS-friendly resumes, optimize their profiles against job descriptions, and prepare for interviews using AI-driven feedback, score analytics, and interactive roadmaps.

---

## ✨ Key Features

- 🎯 **ATS Compatibility & Optimization**: Analyze resume content against target job descriptions and industry standards for higher interview callback rates.
- 🤖 **AI-Powered Insights**: Generates structured feedback, tailored interview questions, skill evaluations, and personalized preparation roadmaps.
- 📊 **Dynamic Score Gauge & Visual Analytics**: Real-time visual metrics measuring ATS fit, technical readiness, and improvement areas.
- 🌐 **Interactive 3D User Interface**: Immersive frontend featuring custom Three.js backgrounds and fluid SCSS styling.
- 🔒 **Secure Authentication**: Complete JWT-based authentication flow with token blacklisting, protected routes, and session persistence.
- 📁 **Resume Parsing & Processing**: Seamless upload and parsing of PDF resumes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Visuals & 3D**: [Three.js](https://threejs.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: SCSS (Modular & Component-scoped styling)
- **Icons & HTTP**: Lucide React, Axios

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Handling**: Multer & pdf-parse

---

## 📁 Project Structure

```
AI-Resume-Builder-And-ATS-Optimization-Platform/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Auth and Interview business logic
│   │   ├── middlewares/     # Auth verification & file upload middlewares
│   │   ├── models/          # User, Blacklist, and InterviewReport schemas
│   │   ├── routes/          # API endpoint declarations
│   │   ├── services/        # AI prompt logic & external services
│   │   └── app.js           # Express app definition
│   ├── server.js            # Server entry point
│   ├── .env.example         # Sample environment configurations
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # Shared components (3D Background, UI widgets)
│   │   ├── features/        # Feature-based modules (Auth, Interview)
│   │   │   ├── auth/        # Login, Register, Auth Context
│   │   │   └── interview/   # Home, Interview Prep, Score Gauge, Roadmap
│   │   ├── app.routes.jsx   # Client-side routing configuration
│   │   ├── main.jsx         # App entry point
│   │   └── style.scss       # Global design tokens and styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- MongoDB instance (local or MongoDB Atlas)
- Google Gemini API Key

---

### 1. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend/` directory based on `.env.example`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

### 2. Frontend Setup

```bash
cd ../Frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to experience the platform.

---

## 👤 Author

- **Name**: Sachin Rawat
- **Email**: [sachinhome8@gmail.com](mailto:sachinhome8@gmail.com)
- **GitHub**: [@sachinhome8-jpg](https://github.com/sachinhome8-jpg)

---

## 📄 License

This project is licensed under the ISC License.
