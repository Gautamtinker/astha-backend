# Backend Setup Guide - Astha Love Website

This guide will help you set up the Node.js + MongoDB backend to sync notes across all devices.

## Prerequisites

1. **Node.js** - Download from [nodejs.org](https://nodejs.org)
2. **MongoDB Atlas Account** - Free tier at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

## Step-by-Step Setup

### 1. Install Dependencies

Open terminal in the `server` folder and run:

```bash
cd server
npm install
```

### 2. Set Up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
6. Replace `<password>` with your database user password

### 3. Configure Environment Variables

Edit the `.env` file in the `server` folder:

```env
# Replace with your MongoDB connection string
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/astha-love-website?retryWrites=true&w=majority

# Server port (default: 5000)
PORT=5000

# Your frontend URL (change for production)
CORS_ORIGIN=http://localhost:5173
```

### 4. Start the Backend Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# OR production mode
npm start
```

You should see:

```
✅ Connected to MongoDB
🚀 Server running on port 5000
💕 Astha Love Website API is ready!
📝 API endpoints available at http://localhost:5000/api/notes
```

### 5. Test the API

Open your browser and go to:

- `http://localhost:5000/api/health` - Should show server status
- `http://localhost:5000/api/notes` - Should show empty notes array

## API Endpoints

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/notes`     | Get all notes   |
| GET    | `/api/notes/:id` | Get single note |
| POST   | `/api/notes`     | Create new note |
| PUT    | `/api/notes/:id` | Update note     |
| DELETE | `/api/notes/:id` | Delete note     |

### Example: Create a Note

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Love for You",
    "content": "Astha, you are my everything...",
    "category": "love",
    "color": "#ff69b4"
  }'
```

## Deploying to Production

### Option 1: Render.com (Free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Create new "Web Service"
4. Connect your GitHub repository
5. Set build command: `cd server && npm install`
6. Set start command: `cd server && npm start`
7. Add environment variables (MONGODB_URI, etc.)

### Option 2: Railway.app (Free)

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Deploy from GitHub
4. Add MongoDB plugin
5. Set environment variables

### Option 3: Heroku (Free alternatives)

Similar process - connect GitHub and deploy.

## Updating Frontend to Use Backend

After the backend is running, you'll need to update the LoveNotebook component to use the API instead of localStorage.

The frontend should:

1. Fetch notes from `http://localhost:5000/api/notes`
2. POST new notes to `/api/notes`
3. PUT updates to `/api/notes/:id`
4. DELETE notes to `/api/notes/:id`

## Troubleshooting

### MongoDB Connection Error

- Check your connection string in `.env`
- Make sure your IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for development)
- Verify username and password are correct

### CORS Error

- Make sure `CORS_ORIGIN` in `.env` matches your frontend URL
- For development: `http://localhost:5173`
- For production: Your deployed URL

### Port Already in Use

- Change `PORT` in `.env` to another number (e.g., 5001)
- Update frontend API URL accordingly

## Need Help?

If you face any issues:

1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Make sure MongoDB cluster is running (check Atlas dashboard)

Good luck! 💕
