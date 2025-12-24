# Blogger Backend API

A complete backend API for a markdown blog application with AI-powered writing assistance.

## Features

- 🔐 **Authentication**: JWT-based user authentication with registration, login, and profile management
- 📝 **Blog Posts**: Full CRUD operations with markdown support, drafts, tags, and slug generation
- 💬 **Comments**: Nested comment system with replies
- 🤖 **AI Writing Assistant**: Powered by Google Gemini AI
  - Generate complete blog posts from topics
  - Improve existing content sections
  - Create blog outlines
  - Continue writing from existing content
  - Auto-generate tags
- 📊 **Dashboard Analytics**: User statistics, popular posts, and recent activity
- 🖼️ **File Uploads**: Profile images and blog post cover images
- 🔒 **Authorization**: Role-based access control (admin/member)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **AI**: Google Gemini AI (@google/genai)
- **File Upload**: Multer
- **CORS**: Enabled for frontend integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `GEMINI_API_KEY`: Google Gemini API key (optional, for AI features)
- `PORT`: Server port (default: 5000)

3. Create uploads directory (already created):
```bash
mkdir -p uploads
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:8000` (or your configured PORT).

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile (protected)
- `PUT /profile` - Update profile (protected)
- `PUT /profile-image` - Update profile image (protected)
- `PUT /change-password` - Change password (protected)

### Blog Posts (`/api/posts`)
- `GET /` - Get all published posts (with pagination, search, tag filter)
- `GET /:slug` - Get single post by slug
- `GET /user/my-posts` - Get current user's posts (protected)
- `POST /` - Create new post (protected)
- `PUT /:id` - Update post (protected, author only)
- `DELETE /:id` - Delete post (protected, author/admin only)
- `PATCH /:id/draft` - Toggle draft status (protected)
- `PATCH /:id/like` - Like a post
- `PUT /:id/cover` - Update cover image (protected)

### Comments (`/api/comments`)
- `GET /:postId` - Get all comments for a post
- `POST /` - Create comment (protected)
- `PUT /:id` - Update comment (protected, author only)
- `DELETE /:id` - Delete comment (protected, author/admin only)

### AI Writing Assistant (`/api/ai`)
All AI endpoints require authentication and GEMINI_API_KEY configuration.

- `POST /generate-post` - Generate complete blog post
  - Body: `{ topic, keywords?, tone? }`
- `POST /improve-section` - Improve content section
  - Body: `{ content, instructions? }`
- `POST /generate-outline` - Generate blog outline
  - Body: `{ topic, sections? }`
- `POST /continue-writing` - Continue writing
  - Body: `{ content, direction? }`
- `POST /generate-tags` - Generate tags from content
  - Body: `{ content }`

### Dashboard (`/api/dashboard`)
All dashboard endpoints require authentication.

- `GET /stats` - Get user statistics (posts, views, likes, comments)
- `GET /recent` - Get recent posts and comments
- `GET /popular` - Get popular posts (sorted by views or likes)

## Database Models

### User
- name, email, password (hashed)
- profileImageUrl, bio
- role (admin/member)

### BlogPost
- title, slug (auto-generated)
- content (markdown)
- coverImageUrl, tags
- author (ref: User)
- isDraft, views, likes
- generatedByAI (flag for AI-generated content)

### Comment
- post (ref: BlogPost)
- author (ref: User)
- content
- parentComment (ref: Comment, for nested replies)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error responses include a `message` field explaining the error.

## File Uploads

Uploaded files are stored in the `uploads/` directory and served statically at `/uploads/<filename>`.

Supported image formats: JPEG, JPG, PNG, WEBP
Maximum file size: 5MB

## Development Notes

- The server uses nodemon for auto-reload in development
- CORS is enabled for all origins (configure for production)
- Passwords are hashed using bcryptjs
- JWT tokens expire in 30 days
- AI features require a valid GEMINI_API_KEY

## License

ISC
