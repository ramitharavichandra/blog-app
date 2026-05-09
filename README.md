# 📝 BlogHub - RESTful Blogging Platform

A modern, full-stack blogging platform built with React, Node.js, and MongoDB. Allows users to create, share, and interact with blog posts using JWT authentication.

## 🎯 Features

- ✨ **User Authentication** - Secure JWT-based login and registration
- 📝 **Blog Management** - Create, edit, delete, and publish blogs
- 🔍 **Search & Filter** - Find blogs by keyword or category
- ❤️ **Social Features** - Like and comment on blogs
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🔒 **Security** - Password hashing, protected routes, token validation
- 🚀 **Performance** - Optimized queries and pagination

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router DOM
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs

**Deployment:**
- Backend: Render
- Frontend: Vercel

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/blog-app
# JWT_SECRET=your_secret_key

npm run dev
# Server runs at http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Edit .env
# REACT_APP_API_URL=http://localhost:5000/api

npm start
# Opens at http://localhost:3000
```

### MongoDB Setup

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
1. Create account at https://mongodb.com/cloud/atlas
2. Create cluster
3. Copy connection string
4. Add to .env

## 📚 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/profile` | Yes | Get user profile |
| PUT | `/api/auth/profile` | Yes | Update profile |
| GET | `/api/blogs` | No | Get all published blogs |
| GET | `/api/blogs/:id` | No | Get single blog |
| POST | `/api/blogs` | Yes | Create new blog |
| PUT | `/api/blogs/:id` | Yes | Update blog |
| DELETE | `/api/blogs/:id` | Yes | Delete blog |
| POST | `/api/blogs/:id/like` | Yes | Like blog |
| POST | `/api/blogs/:id/comment` | Yes | Add comment |

## 📁 Project Structure

```
blog-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🧪 Testing APIs

Using Postman or cURL:

```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Create Blog (with JWT token)
POST http://localhost:5000/api/blogs
Authorization: Bearer <token>
{
  "title": "My First Blog",
  "content": "This is my first blog post...",
  "description": "A great blog",
  "category": "Technology"
}
```

## 🚀 Deployment

### Deploy Backend (Render)

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables
6. Deploy

### Deploy Frontend (Vercel)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import GitHub repository
4. Select frontend folder
5. Set environment variables
6. Deploy

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎓 Learning Outcomes

- Full-stack web development
- RESTful API design
- JWT authentication
- MongoDB database design
- React hooks and context API
- Error handling and validation
- Cloud deployment

## 📄 License

MIT

## 👨‍💻 Author

[Your Name] (Student ID)
Department of Computer Science & Engineering

## 🤝 Contributing

This is a mini project for educational purposes.

## 📞 Support

For issues, please create an issue on GitHub or contact the instructor.

---

**Happy Blogging! 📝✨**