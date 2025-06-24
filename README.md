# OutFlo Campaign Management System

A full-stack campaign management system with AI-powered message generation for LinkedIn outreach.

## Features

### Backend (Node.js + Express + TypeScript + MongoDB)
- **Campaign CRUD APIs**: Create, read, update, and delete campaigns
- **Soft Delete**: Deleted campaigns remain in database but are not visible
- **Status Management**: Toggle campaigns between ACTIVE and INACTIVE
- **AI-Powered Messages**: Generate personalized LinkedIn outreach messages using Google Gemini
- **Input Validation**: Using Zod for type-safe validation
- **MongoDB Integration**: Persistent data storage with Mongoose

### Frontend (React + TypeScript + Tailwind CSS)
- **Campaign Dashboard**: View and manage all campaigns
- **Campaign Forms**: Create and edit campaigns with dynamic form fields
- **Message Generator**: AI-powered LinkedIn message generation
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Updates**: Instant UI updates for campaign status changes

## Tech Stack

### Backend
- Node.js & Express.js
- TypeScript
- MongoDB with Mongoose
- Zod for validation
- Google Gemini AI for message generation
- CORS, Helmet, Morgan for security and logging

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

## Project Structure

```
OutFlo/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── validation/      # Zod schemas
│   │   ├── middleware/      # Error handling
│   │   └── server.ts        # Express server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or cloud instance)
- Google Gemini API key (optional, fallback messages provided)

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd OutFlo
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud connection
   # Update MONGODB_URI in .env
   ```

4. **Run the application:**
   ```bash
   # From root directory - runs both backend and frontend
   npm run dev
   
   # Or run separately:
   # Backend (http://localhost:5000)
   cd backend && npm run dev
   
   # Frontend (http://localhost:3000)
   cd frontend && npm run dev
   ```

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/outflo_campaigns

# AI Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## API Documentation

### Campaign Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | Get all campaigns (excluding deleted) |
| GET | `/api/campaigns/:id` | Get single campaign |
| POST | `/api/campaigns` | Create new campaign |
| PUT | `/api/campaigns/:id` | Update campaign |
| DELETE | `/api/campaigns/:id` | Soft delete campaign |

### Message Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/personalized-message` | Generate AI-powered message |

### Example Requests

**Create Campaign:**
```json
POST /api/campaigns
{
  "name": "Tech Startup Outreach",
  "description": "Reaching out to tech startup founders",
  "leads": [
    "https://linkedin.com/in/john-doe",
    "https://linkedin.com/in/jane-smith"
  ],
  "accountIDs": ["account1", "account2"]
}
```

**Generate Message:**
```json
POST /api/personalized-message
{
  "name": "John Doe",
  "job_title": "Software Engineer",
  "company": "TechCorp",
  "location": "San Francisco, CA",
  "summary": "Experienced in AI & ML..."
}
```

## Usage

### Campaign Management
1. **Create Campaign**: Click "New Campaign" to create a campaign with name, description, LinkedIn URLs, and account IDs
2. **View Campaigns**: Dashboard shows all active campaigns with stats
3. **Edit Campaign**: Click edit icon to modify campaign details
4. **Toggle Status**: Use toggle button to activate/deactivate campaigns
5. **Delete Campaign**: Click delete icon to soft-delete campaigns

### Message Generation
1. **Navigate** to Message Generator
2. **Fill Profile Data**: Enter LinkedIn profile information
3. **Generate Message**: Click to create AI-powered personalized message
4. **Copy & Use**: Copy generated message for outreach

## Development

### Available Scripts

```bash
# Root directory
npm run dev          # Run both backend and frontend
npm run build        # Build both applications
npm run start        # Start production server
npm run install:all  # Install all dependencies

# Backend
npm run server:dev   # Development server with hot reload
npm run server:build # Build TypeScript to JavaScript
npm start           # Start production server

# Frontend
npm run client:dev   # Development server with hot reload
npm run client:build # Build for production
```

### Database Schema

**Campaign Model:**
```typescript
{
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  leads: string[];        // LinkedIn URLs
  accountIDs: string[];   // Account identifiers
  createdAt: Date;
  updatedAt: Date;
}
```

## Deployment

### Railway Deployment

1. **Prepare for deployment:**
   ```bash
   # Ensure all dependencies are installed
   npm run install:all
   ```

2. **Deploy to Railway:**
   ```bash
   # Method 1: Connect GitHub repository to Railway
   # - Fork/clone this repository
   # - Connect to Railway dashboard
   # - Railway will auto-deploy on push

   # Method 2: Deploy using Railway CLI
   railway login
   railway link
   railway up
   ```

3. **Environment Variables on Railway:**
   Set these variables in Railway dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key (optional)
   ```

4. **Database Setup:**
   - Use Railway's MongoDB plugin, or
   - Connect to MongoDB Atlas
   - Update MONGODB_URI environment variable

### Railway Configuration

The project includes:
- `railway.json` for deployment configuration
- Single-process deployment (backend serves frontend)
- Dynamic port binding for Railway's infrastructure
- Production-ready build process

### Live Application

Once deployed, your application will be available at:
`https://your-app-name.railway.app`

The backend API will be accessible at:
`https://your-app-name.railway.app/api/campaigns`

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - Use Railway MongoDB or MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/outflo_campaigns

# AI Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL - Railway provides this automatically
FRONTEND_URL=https://your-app-name.railway.app
```

