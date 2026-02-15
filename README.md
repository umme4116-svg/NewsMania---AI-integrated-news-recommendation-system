# NewsMania - Full-Stack MERN News Application

A comprehensive news aggregation platform built with the MERN stack, focusing on Indian and International news with AI-powered summaries, personalization, and admin moderation features.

![NewsMania](https://img.shields.io/badge/NewsMania-v1.0.0-blue)
![MERN](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

### User Features
- ✅ **Authentication**: Secure JWT-based registration and login
- ✅ **News Categories**: 8 main categories (Top Headlines, Politics, Technology, Sports, Business, Health, Entertainment, International News)
- ✅ **Personalization Mode**: Customize news feed based on selected categories
- ✅ **Trending News**: Always visible at the top in both default and personalized modes
- ✅ **Like/Unlike**: Interactive like system with count
- ✅ **Bookmarking**: Save articles for later reading
- ✅ **Social Sharing**: Share on WhatsApp, Facebook, X (Twitter), LinkedIn, and Copy Link
- ✅ **AI Summaries**: 2-3 sentence summaries generated using HuggingFace AI
- ✅ **Sentiment Analysis**: Optional sentiment labeling (Positive/Neutral/Negative)
- ✅ **Search**: Keyword-based news search with error handling
- ✅ **Dark/Light Mode**: Toggle between themes
- ✅ **Infinite Scroll**: Smooth pagination for news articles
- ✅ **Responsive Design**: Mobile-first, modern UI with Tailwind CSS

### Admin Features
- ✅ **User Management**: View, block, and unblock users
- ✅ **News Moderation**: View all news, block/unblock articles, delete inappropriate content
- ✅ **Real-time Updates**: Blocked content disappears instantly for users
- ✅ **Admin Dashboard**: Comprehensive admin panel with statistics

### Technical Features
- ✅ **Dual API Integration**: newsdata.io and newsapi.org with automatic fallback
- ✅ **Error Handling**: Comprehensive error messages and fallback mechanisms
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Role-Based Access Control**: Admin and user roles
- ✅ **MongoDB Atlas**: Cloud database integration
- ✅ **Deployment Ready**: Configured for Vercel (frontend) and Render (backend)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
NEWS_DATA_API_KEY=your_newsdata_io_api_key_here
NEWS_ORG_API_KEY=your_newsapi_org_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_optional
NODE_ENV=development
API_URL=http://localhost:5000
```

**⚠️ IMPORTANT**: You need to get your own API keys (the ones above are placeholders):
- **newsdata.io**: Sign up at https://newsdata.io/ (free tier: 200 requests/day)
- **newsapi.org**: Sign up at https://newsapi.org/ (free tier: 100 requests/day)
- See `GET_API_KEYS.md` for detailed step-by-step instructions

4. Seed admin user (optional):
```bash
node scripts/seedAdmin.js
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`
Swagger documentation available at `http://localhost:5000/api-docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
newsmania/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── News.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── news.js
│   │   ├── user.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   ├── newsService.js
│   │   └── aiService.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔑 Test Credentials

### Sample User Account
- **Email**: `user@example.com`
- **Password**: `user123`
- **Role**: User

### Admin Account
- **Email**: `admin@newsmania.com`
- **Password**: `admin123`
- **Role**: Admin

> ⚠️ **Important**: Change these passwords after first login in production!

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### News
- `GET /news/top` - Get top headlines
- `GET /news/category/:name` - Get news by category
- `GET /news/international` - Get international news
- `GET /news/search?q=query` - Search news articles
- `POST /news/like/:id` - Like an article (protected)
- `POST /news/unlike/:id` - Unlike an article (protected)

### User
- `GET /user/bookmarks` - Get user bookmarks (protected)
- `POST /user/bookmarks` - Add bookmark (protected)
- `DELETE /user/bookmarks` - Remove bookmark (protected)
- `GET /user/preferences` - Get user preferences (protected)
- `POST /user/preferences` - Update preferences (protected)

### Admin
- `GET /admin/users` - Get all users (admin only)
- `GET /admin/news` - Get all news (admin only)
- `POST /admin/block/:id` - Block news article (admin only)
- `POST /admin/unblock/:id` - Unblock news article (admin only)
- `DELETE /admin/delete/:id` - Delete news article (admin only)
- `POST /admin/user/block/:id` - Block user (admin only)
- `POST /admin/user/unblock/:id` - Unblock user (admin only)

Full API documentation available at `/api-docs` when backend is running.

## 🚀 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEWS_DATA_API_KEY`
   - `NEWS_ORG_API_KEY`
   - `HUGGINGFACE_API_KEY` (optional)
   - `NODE_ENV=production`
   - `API_URL=https://your-backend-url.onrender.com`

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Run: `vercel`
4. Set environment variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com`
5. Deploy: `vercel --prod`

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Category View
![Category View](screenshots/category.png)

### Admin Panel
![Admin Panel](screenshots/admin.png)

### Profile Settings
![Profile Settings](screenshots/profile.png)

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] News fetching from all categories
- [ ] Search functionality
- [ ] Like/unlike articles
- [ ] Bookmark articles
- [ ] Share articles on social platforms
- [ ] Switch between default and personalized mode
- [ ] Admin panel access and moderation
- [ ] Dark/light mode toggle
- [ ] Responsive design on mobile devices

## 🛠️ Technologies Used

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- React Toastify
- React Icons
- React Infinite Scroll Component
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- Axios
- Swagger (swagger-jsdoc, swagger-ui-express)
- dotenv

### External APIs
- newsdata.io API
- newsapi.org API
- HuggingFace AI API (for summaries and sentiment)

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- newsdata.io for news API
- newsapi.org for news API
- HuggingFace for AI models
- All open-source contributors

## 📞 Support

For support, email support@newsmania.com or create an issue in the repository.

---

**Note**: This is a final-year project submission. All features are fully functional and deployment-ready.

