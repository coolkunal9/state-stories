# State Stories — Deployment & Infrastructure Guide

## 1. Deployment Topology

State Stories is deployed across modern cloud platforms optimized for high availability, zero cold-start database overhead, and automatic SSL encryption:

```
┌────────────────────────────────────────────────────────┐
│               Frontend: Vercel (Edge CDN)              │
│  - Static Asset Hosting & Edge Distribution            │
│  - React SPA Rewrites to index.html                    │
│  - Environment: REACT_APP_API_URL                      │
└───────────────────────────┬────────────────────────────┘
                            │ Outbound HTTPS API Calls
                            ▼
┌────────────────────────────────────────────────────────┐
│             Backend: Vercel Serverless Function        │
│  - Route: All requests directed to server.js           │
│  - Express 5 REST API Handlers                         │
│  - Environment: MONGODB_URI, JWT_SECRET, CLIENT_URL    │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose Connection Pool
                            ▼
┌────────────────────────────────────────────────────────┐
│           Database: MongoDB Atlas (M0/Dedicated)       │
│  - Managed Multi-AZ Replica Set                        │
│  - Automated Backups & Indexing                        │
│  - Network Access: IP Whitelist (0.0.0.0/0 for Serverless)
└────────────────────────────────────────────────────────┘
```

---

## 2. Environment Variables Configuration

### Backend Environment Variables (`server/.env` / Vercel Backend Project)
| Variable | Description | Example / Required Format |
|---|---|---|
| `NODE_ENV` | Environment identifier | `production` |
| `PORT` | Local dev server port (ignored on Vercel) | `8000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/state-stories?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `64+ character random hex/alphanumeric string` |
| `CLIENT_URL` | Trusted frontend domain for CORS | `https://state-stories.vercel.app` |

### Frontend Environment Variables (`client/.env` / Vercel Frontend Project)
| Variable | Description | Example / Required Format |
|---|---|---|
| `REACT_APP_API_URL` | Base endpoint for the backend API | `https://state-stories-api.vercel.app/api` |

> **IMPORTANT:** In React (Create React App), environment variables prefixed with `REACT_APP_` are embedded into the client bundle at **build time**. If you update `REACT_APP_API_URL` on Vercel, you must trigger a redeploy for the change to take effect.

---

## 3. Vercel Configuration Files

### Frontend Vercel Config (`client/vercel.json`)
Ensures client-side React Router handles deep routes (e.g. `/articles/rajasthan`) without returning HTTP 404:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Backend Vercel Config (`server/vercel.json`)
Directs all API traffic to the serverless Express instance:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

## 4. Step-by-Step Deployment Walkthrough

### Step 1: MongoDB Atlas Setup
1. Create a cluster on MongoDB Atlas.
2. In **Database Access**, create a user with `readWrite` permissions.
3. In **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) because Vercel serverless IPs change dynamically.
4. Copy the connection URI string.

### Step 2: Backend Deployment (Vercel)
1. Import the repository into Vercel and set the **Root Directory** to `server`.
2. Add environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<your-atlas-uri>`
   - `JWT_SECRET`: `<secure-random-32-byte-string>`
   - `CLIENT_URL`: `https://<your-frontend>.vercel.app`
3. Deploy and verify health check at `https://<backend-url>/api/health`.

### Step 3: Frontend Deployment (Vercel)
1. Import the repository into Vercel and set the **Root Directory** to `client`.
2. Add environment variable:
   - `REACT_APP_API_URL`: `https://<backend-url>/api`
3. Deploy. Verify that navigation, login, and story browsing function seamlessly.
