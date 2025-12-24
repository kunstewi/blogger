# Quick API Testing Guide

## Prerequisites

1. Configure your `.env` file:
```bash
cp .env.example .env
```

Add your MongoDB URI and JWT secret:
```
MONGO_URI=mongodb://localhost:27017/blogger
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_key_here  # Optional
PORT=8000
```

2. Start the server:
```bash
npm run dev
```

## Test Endpoints with curl

### 1. Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "member" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save the token for subsequent requests!

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Profile (Protected)
```bash
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create Blog Post (Protected)
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Blog Post",
    "content": "# Hello World\n\nThis is my **first** blog post written in markdown!\n\n## Features\n- Easy to write\n- Supports formatting\n- Great for blogging",
    "tags": "javascript, nodejs, blogging",
    "isDraft": false
  }'
```

### 5. Get All Posts (Public)
```bash
curl -X GET "http://localhost:8000/api/posts?page=1&limit=10"
```

### 6. Get Post by Slug (Public)
```bash
curl -X GET http://localhost:8000/api/posts/my-first-blog-post
```

### 7. Like a Post (Public)
```bash
curl -X PATCH http://localhost:8000/api/posts/POST_ID_HERE/like
```

### 8. Create Comment (Protected)
```bash
curl -X POST http://localhost:8000/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "postId": "POST_ID_HERE",
    "content": "Great post! Very informative."
  }'
```

### 9. Get Comments for Post (Public)
```bash
curl -X GET http://localhost:8000/api/comments/POST_ID_HERE
```

### 10. Get Dashboard Stats (Protected)
```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 11. Generate Blog Post with AI (Protected, requires GEMINI_API_KEY)
```bash
curl -X POST http://localhost:8000/api/ai/generate-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "topic": "The Future of Web Development",
    "keywords": "javascript, react, nodejs",
    "tone": "professional"
  }'
```

### 12. Improve Content Section (Protected, requires GEMINI_API_KEY)
```bash
curl -X POST http://localhost:8000/api/ai/improve-section \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Web development is changing fast. New frameworks come out all the time.",
    "instructions": "Make it more engaging and add specific examples"
  }'
```

## Using Postman

1. Import the following as a collection
2. Create an environment variable `token` to store your JWT
3. Set `Authorization: Bearer {{token}}` in protected requests

## Common Query Parameters

### Blog Posts
- `?page=1` - Page number (default: 1)
- `?limit=10` - Items per page (default: 10)
- `?search=keyword` - Search in title and content
- `?tag=javascript` - Filter by tag

### Dashboard
- `?limit=5` - Number of items (default: 5)
- `?sortBy=views` or `?sortBy=likes` - Sort popular posts

## File Upload Endpoints

### Update Profile Image
```bash
curl -X PUT http://localhost:8000/api/auth/profile-image \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/your/image.jpg"
```

### Update Post Cover Image
```bash
curl -X PUT http://localhost:8000/api/posts/POST_ID_HERE/cover \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/cover.jpg"
```

## Expected Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Tips

1. **Save your token**: After login/register, save the token to use in subsequent requests
2. **Use environment variables**: In Postman, create variables for `baseUrl` and `token`
3. **Check MongoDB**: Verify data is being saved correctly in your database
4. **Test authorization**: Try accessing protected routes without a token to verify security
5. **Test ownership**: Try editing/deleting another user's post to verify authorization
