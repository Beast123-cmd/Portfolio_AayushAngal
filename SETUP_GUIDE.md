# Portfolio Setup Guide

## Project Structure
```
portfolio/
├── frontend/               (React + TypeScript + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── backend/               (Node.js + Express + MongoDB)
    ├── models/
    ├── routes/
    ├── utils/
    ├── server.js
    ├── package.json
    └── .env
```

## Quick Start (Local Development)

### Terminal 1: Frontend
```bash
cd /path/to/aayush-angal-portfolio
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Terminal 2: Backend
```bash
cd /path/to/aayush-angal-portfolio/backend
npm install
# Create .env file first (see Backend Setup below)
npm run dev
# Backend runs on http://localhost:3001
```

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env.local` file
```
VITE_API_URL=http://localhost:3001
```

### 3. Run Development Server
```bash
npm run dev
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create `.env` file
Copy from `.env.example`:
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/portfolio
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 3. MongoDB Setup (FREE - MongoDB Atlas)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new project
4. Create a cluster (free tier available)
5. Create a database user
6. Get connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
7. Add `/portfolio` at the end for database name
8. Whitelist your IP address
9. Add to `.env` as `MONGODB_URI`

### 4. Email Setup (Gmail)
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer" (or your device)
5. Google will generate a 16-character password
6. Use this password in `.env` as `EMAIL_PASSWORD`
7. Use your Gmail address in `.env` as `EMAIL_USER`

### 5. Run Development Server
```bash
npm run dev
```

Backend will run on http://localhost:3001

## Features

### Contact Form
- ✅ Form validation (name, email, message)
- ✅ Stores submissions in MongoDB database
- ✅ Sends notification email to your Gmail
- ✅ Timestamps and IP tracking
- ✅ Status tracking (new, read, replied)

### Resume Download
- ✅ Serve resume.pdf from public folder
- ✅ File download functionality
- ✅ Error handling if file missing

## Testing the Endpoints

### Test Contact Form Submission
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is a test message from curl"
  }'
```

### Test Resume Download
```bash
curl -X GET http://localhost:3001/api/resume/download \
  -o resume.pdf
```

### Check Backend Health
```bash
curl http://localhost:3001/api/health
```

## Important Notes

1. **Resume File**: Add your resume as `public/resume.pdf` in the root directory
2. **Email Configuration**: Email service is optional. If not configured, messages are still saved to database
3. **CORS**: Backend configured to accept requests from `http://localhost:5173`
4. **Database**: All contacts are stored with timestamps and metadata

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Ensure .env file exists with all required variables
- Check MongoDB connection string

### Contact form not submitting
- Check browser console for errors
- Verify backend is running (`http://localhost:3001/api/health`)
- Check network tab in DevTools
- Ensure VITE_API_URL is correctly set in frontend

### Email not sending
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Check if Gmail app password was generated correctly
- Check backend console for email errors

### Resume not downloading
- Ensure resume.pdf exists in `public/` folder
- Check file permissions
- Verify backend can access the file

## Production Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update VITE_API_URL to production backend URL

### Backend
- Deploy to Heroku, Railway, Render, or any Node.js hosting
- Set environment variables on hosting platform
- Update FRONTEND_URL in backend .env

## Useful Commands

```bash
# Frontend
npm run dev        # Development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build

# Backend
npm run dev        # Development with auto-reload
npm start          # Production mode
```

## Environment Variables Summary

**Frontend (.env.local)**
- `VITE_API_URL` - Backend API URL

**Backend (.env)**
- `MONGODB_URI` - MongoDB connection string
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASSWORD` - Gmail app password
- `FRONTEND_URL` - Frontend URL for CORS
- `PORT` - Backend port (default: 3001)
