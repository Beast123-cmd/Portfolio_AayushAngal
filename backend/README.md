# Portfolio Backend

Backend for the portfolio website handling contact form submissions and resume downloads.

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create `.env` file in the `backend` folder
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/portfolio
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 3. MongoDB Setup (Free)
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free account
- Create a cluster
- Get your connection string and add it to `.env`

### 4. Email Setup (Gmail Example)
- Enable 2-Factor Authentication in your Google Account
- Generate an App Password: https://myaccount.google.com/apppasswords
- Use that password in EMAIL_PASSWORD in `.env`

### 5. Run the Backend
```bash
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

The backend will run on `http://localhost:3001`

## API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit a new contact form
- **GET** `/api/contact` - Get all contacts
- **GET** `/api/contact/:id` - Get a specific contact
- **PATCH** `/api/contact/:id` - Update contact status
- **DELETE** `/api/contact/:id` - Delete a contact

### Resume
- **GET** `/api/resume/download` - Download resume PDF

### Health Check
- **GET** `/api/health` - Check if backend is running

## Database Schema

### Contact
- `name` (String) - Contact's name
- `email` (String) - Contact's email
- `message` (String) - Contact message
- `status` (String) - Status: 'new', 'read', or 'replied'
- `ipAddress` (String) - Submitter's IP address
- `createdAt` (Date) - Submission timestamp
- `updatedAt` (Date) - Last update timestamp
