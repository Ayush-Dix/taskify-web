# MERN Todo App

A full-stack Todo List application with authentication, built using the MERN stack (MongoDB, Express, React, Node.js). Features JWT authentication, bcrypt password hashing, and a beautiful Spotify-inspired UI.

## Features

- 🔐 User registration & login (JWT auth)
- 📝 Create, read, update, delete todos (CRUD)
- 🟢 Real-time UI updates (no refresh needed)
- 🎨 Spotify-style, fully responsive design
- 🛡️ Passwords hashed with bcrypt
- 🚫 All todo filtering removed for simplicity
- 🌙 Dark mode by default

## Tech Stack

- **Frontend:** React, Vite, Context API, Axios, CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Database:** MongoDB (local or Atlas)

## Project Structure

```
mern-todo/
├── backend/
│   ├── config/           # DB config
│   ├── controllers/      # Auth & todo logic
│   ├── middleware/       # JWT auth
│   ├── models/           # User & Todo schemas
│   ├── routes/           # API routes
│   ├── utils/            # JWT helpers
│   ├── .env              # Backend env vars
│   └── server.js         # Express server
├── src/
│   ├── components/       # React UI components
│   ├── context/          # Auth & Todo context
│   ├── App.jsx           # Main app
│   ├── App.css           # Spotify-style CSS
│   └── main.jsx          # React entry
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas/database))

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd ../
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deployment

### 1. Deploy MongoDB (Atlas)
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- Get your connection string and update `MONGODB_URI` in backend `.env`

### 2. Deploy Backend
- Push `backend/` to GitHub
- Deploy to [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com)
- Set env vars (`MONGODB_URI`, `JWT_SECRET`, etc.) in the dashboard

### 3. Deploy Frontend
- Push your code to GitHub
- Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Set the API base URL in your React app (e.g. `VITE_API_URL=https://your-backend.onrender.com`)

### 4. CORS
- In backend, allow your frontend domain in CORS config

## Usage

1. Register a new account
2. Login to access your dashboard
3. Add, edit, or delete todos instantly
4. All changes update in real-time, no refresh needed

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Todos (protected)
- `GET /api/todos` — List all todos
- `POST /api/todos` — Create todo
- `PUT /api/todos/:id` — Update todo
- `DELETE /api/todos/:id` — Delete todo

## Screenshots

![Login](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)

## License

MIT
