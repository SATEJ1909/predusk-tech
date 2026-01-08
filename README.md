# Me-API & Portfolio

A full-stack portfolio application with a dynamic backend API and a modern React frontend. This project allows users to manage their developer profile, education, skills, and projects via a REST API, and displays them on a polished, responsive portfolio website.

## 🚀 Tech Stack

### Backend
- **Node.js & Express**: RESTful API server.
- **TypeScript**: Type-safe development.
- **MongoDB & Mongoose**: Database for storing profile and project data.
- **CORS & Dotenv**: Middleware for security and configuration.

### Frontend
- **React (Vite)**: Fast, component-based UI.
- **Tailwind CSS**: Utility-first styling for a premium look.
- **Lucide React**: Modern icons.
- **Axios**: HTTP client for API integration.

## 📂 Project Structure

```
.
├── backend/         # Express API server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── model/       # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   └── index.ts     # Entry point
│   └── ...
└── frontend/        # React application
    ├── src/
    │   ├── App.jsx      # Main application logic & UI
    │   └── ...
    └── ...
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=3000
# DATABASE_URL=mongodb://localhost:27017/me-api (or your connection string)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔌 API Endpoints

- `GET /api/profile`: Fetch profile details.
- `PATCH /api/update/:email`: Update profile information.
- `GET /api/search?skills=...`: Search projects by skills.
- `GET /api/health`: Check server status.

## ✨ Features

- **Dynamic Portfolio**: Content is fetched dynamically from the database.
- **Search Projects**: Filter projects by technical skills.
- **Edit Profile**: Update name, education, and skills directly from the UI.
- **Responsive Design**: Optimized for desktop and mobile.
