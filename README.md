# MMMUT Hostel Exchange Portal

A full-stack web application for MMMUT students to find hostel exchange partners between **Ramanujan Bhawan** and **Ambedkar Bhawan**.

## Tech Stack

- **Frontend**: React.js (Vite) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas

## Project Structure

```
Hostel Exchange/
├── backend/          Node.js + Express API
├── frontend/         React + Tailwind frontend
├── install.bat       One-click setup script
├── start-backend.bat Start backend server
└── start-frontend.bat Start frontend dev server
```

## Setup & Running

### Step 1: Configure MongoDB Atlas

Edit `backend/.env` and replace the placeholder with your actual MongoDB Atlas URI:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/hostel-exchange?retryWrites=true&w=majority
PORT=5000
```

### Step 2: Install Dependencies

Double-click `install.bat` OR manually:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 3: Start the App

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:3000
```

Or double-click `start-backend.bat` and `start-frontend.bat`.

## Features

| Feature | Description |
|---------|-------------|
| 📋 Exchange Listings | Create and browse hostel exchange requests |
| 🔍 Search & Filter | Filter by hostel, branch, year, status |
| ✨ Smart Match Finder | Auto-detect perfect exchange pairs |
| ✅ Confirm Exchange | Record confirmed swaps to history |
| 📊 Statistics Dashboard | Live stats on home page |
| 📜 Exchange History | Complete record of all past exchanges |

## API Endpoints

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List all (with filters) |
| POST | `/api/students` | Create listing |
| PATCH | `/api/students/:id/status` | Update status |
| DELETE | `/api/students/:id` | Remove listing |
| GET | `/api/students/stats` | Dashboard stats |

### Matches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches` | Get auto-detected matches |

### History
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history` | All completed exchanges |
| POST | `/api/history` | Record a new exchange |
