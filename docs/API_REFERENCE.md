# State Stories — REST API Reference

Base URL (Local): `http://localhost:8000/api`  
Base URL (Production): `https://<your-backend-domain>/api`

---

## 1. System Health

### `GET /api/health`
Checks server uptime, deployment environment, and live MongoDB connectivity.

- **Authentication:** None
- **Response (200 OK):**
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "development",
  "timestamp": "2026-10-10T08:00:00.000Z"
}
```

---

## 2. Articles API

### `GET /api/articles`
Retrieves a paginated list of articles with optional search and state filters.

- **Authentication:** None
- **Query Parameters:**
  - `page` *(optional, integer, default: 1)*: Page number
  - `limit` *(optional, integer, default: 12, max: 50)*: Number of items per page
  - `state` *(optional, string)*: Case-insensitive state filter (e.g., `Kerala`)
  - `search` *(optional, string)*: Text query matching title, state, or content
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "660c1...",
      "name": "kerala",
      "title": "Kerala: God's Own Country & Living Traditions",
      "image": "/images/kerala.jpg",
      "image2": "/images/kerala2.jpg",
      "content": ["Paragraph 1...", "Paragraph 2..."],
      "state": "Kerala",
      "sourceLink": "https://keralatourism.org",
      "createdAt": "2026-03-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 12,
    "totalPages": 1
  }
}
```

---

### `GET /api/articles/:name`
Retrieves full details for a single article identified by its unique slug (`name`), along with all associated comments.

- **Authentication:** None
- **Path Parameters:**
  - `name` *(required, string)*: Article slug (e.g., `kerala`, `rajasthan`)
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "660c1...",
    "name": "kerala",
    "title": "Kerala: God's Own Country & Living Traditions",
    "image": "/images/kerala.jpg",
    "image2": "/images/kerala2.jpg",
    "content": ["Paragraph 1...", "Paragraph 2..."],
    "state": "Kerala",
    "comments": [
      {
        "_id": "660c2...",
        "user": "660a1...",
        "username": "traveller_ananya",
        "text": "The backwaters in Alleppey were magical!",
        "createdAt": "2026-03-02T12:00:00.000Z"
      }
    ]
  }
}
```
- **Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Article not found with name: nonexistent-state"
}
```

---

### `POST /api/articles/:name/comments`
Posts a new user comment on a specific article.

- **Authentication:** Required (`Bearer <JWT>`)
- **Path Parameters:**
  - `name` *(required, string)*: Article slug
- **Request Body (JSON):**
```json
{
  "text": "Such an insightful piece on the architecture of Jaipur!"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "_id": "660c9...",
    "article": "660c1...",
    "user": "660a1...",
    "username": "kunal",
    "text": "Such an insightful piece on the architecture of Jaipur!",
    "createdAt": "2026-10-10T08:15:00.000Z"
  }
}
```
- **Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "details": ["\"text\" length must be at least 1 characters long"]
}
```
- **Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Authentication required. Please log in."
}
```

---

## 3. Authentication API

### `POST /api/auth/register`
Creates a new user account.

- **Authentication:** None (Stricter Rate Limiting applied: 10 requests / 15 min per IP)
- **Request Body (JSON):**
```json
{
  "username": "rohit_sharma",
  "email": "rohit@example.com",
  "password": "Password123!"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "660a1...",
    "username": "rohit_sharma",
    "email": "rohit@example.com",
    "role": "user"
  }
}
```
- **Error (409 Conflict):**
```json
{
  "success": false,
  "message": "A user with this email or username already exists."
}
```

---

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT.

- **Authentication:** None (Stricter Rate Limiting applied: 10 requests / 15 min per IP)
- **Request Body (JSON):**
```json
{
  "email": "rohit@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "660a1...",
    "username": "rohit_sharma",
    "email": "rohit@example.com",
    "role": "user"
  }
}
```
- **Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

### `GET /api/auth/me`
Fetches the currently authenticated user's profile details.

- **Authentication:** Required (`Bearer <JWT>`)
- **Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "660a1...",
    "username": "rohit_sharma",
    "email": "rohit@example.com",
    "role": "user",
    "createdAt": "2026-03-01T10:00:00.000Z"
  }
}
```

---

### `GET /api/auth/my-comments`
Retrieves all comments authored by the currently authenticated user, populated with article titles and slugs.

- **Authentication:** Required (`Bearer <JWT>`)
- **Response (200 OK):**
```json
{
  "success": true,
  "comments": [
    {
      "_id": "660c9...",
      "text": "Such an insightful piece on the architecture of Jaipur!",
      "createdAt": "2026-10-10T08:15:00.000Z",
      "article": {
        "_id": "660c1...",
        "name": "rajasthan",
        "title": "Rajasthan: The Land of Kings & Timeless Forts"
      }
    }
  ]
}
```
