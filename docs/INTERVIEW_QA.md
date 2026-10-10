# State Stories — Technical Interview Q&A Guide

This guide prepares you to speak confidently and authoritatively about every architectural decision, security vulnerability, and scalability consideration in State Stories during technical interviews.

---

## 1. System Architecture & Design

### Q1: "Can you explain the high-level architecture of State Stories?"
> **Answer:**
> "State Stories is a decoupled MERN stack application designed for regional storytelling. The frontend is a React 18 single-page application styled with Tailwind CSS and Framer Motion, hosted on Vercel's Edge CDN. The backend is an Express 5 REST API designed to run both locally as a persistent server and on Vercel as serverless functions. Data is stored on MongoDB Atlas with dedicated indexes for slug lookup, state filtering, and full-text keyword search. We use a 3-tier backend architecture where routes delegate directly to business services, keeping database interactions and validation decoupled from HTTP transports."

### Q2: "How do you handle database connection pooling in a serverless environment like Vercel?"
> **Answer:**
> "In serverless environments, functions are stateless and spin up or freeze on demand. Establishing a new MongoDB connection on every request would add substantial latency (SSL handshake, auth). In `server/db.js`, we cache the Mongoose connection on the NodeJS `global` object (`global.mongoose = { conn, promise }`). When a serverless container stays warm across invocations, subsequent requests re-use the established TCP connection. We also set `bufferCommands: false` so that queries fail fast if the connection drops instead of hanging indefinitely."

---

## 2. Security & Authentication

### Q3: "How does authentication work in State Stories, and why did you choose JWT over sessions?"
> **Answer:**
> "We implement stateless authentication with JSON Web Tokens signed with HS256. Upon login, the user's password is verified using bcrypt (cost factor 12). The server signs a JWT containing the user ID and role, with a 7-day expiration. The frontend stores this in `localStorage` and automatically attaches it to the `Authorization: Bearer` header on outbound requests via our API client wrapper.
> We chose JWT because our frontend and backend are deployed as decoupled services. Stateless tokens allow our Vercel serverless backend functions to verify credentials independently without maintaining server-side session state or Redis stores."

### Q4: "What security vulnerabilities did you identify and remediate during the project audit?"
> **Answer:**
> "During our security audit, we addressed several critical vectors:
> 1. **JWT Fallback Secret:** The server previously fell back to an insecure string if `JWT_SECRET` was missing. We added a fail-fast startup guard in `server/middleware/auth.js` that crashes the server immediately on boot in production if `JWT_SECRET` is unset.
> 2. **CORS Wildcards:** We replaced permissive `*.vercel.app` wildcard matching with an explicit domain allowlist.
> 3. **Regex Injection (ReDoS):** The state query parameter previously interpolated raw input into `new RegExp`. We added input sanitization that escapes regex special characters.
> 4. **Auth Rate Limiting:** We added a dedicated IP rate limiter allowing a maximum of 10 requests per 15 minutes on login and registration to mitigate credential stuffing and brute-force attacks.
> 5. **Resource Exhaustion:** We capped the `limit` query parameter at a maximum of 50 items."

---

## 3. Database & Performance

### Q5: "What database indexes are created in MongoDB, and why?"
> **Answer:**
> "We have four primary indexing strategies:
> 1. `{ email: 1 }` (unique) on Users for $O(\log N)$ authentication lookups and duplicate prevention.
> 2. `{ name: 1 }` (unique) on Articles for slug-based article retrieval.
> 3. `{ state: 1 }` on Articles to accelerate state filtering queries.
> 4. `{ title: 'text', state: 'text', content: 'text' }` compound text index on Articles to support full-text search across article contents.
> 5. `{ article: 1, createdAt: -1 }` compound index on Comments to retrieve all comments for a story in reverse-chronological order without requiring in-memory sorting."

---

## 4. Frontend Engineering & React

### Q6: "How do you handle search input without spamming the backend API?"
> **Answer:**
> "We created a custom `useDebounce` hook that delays updating the debounced search term by 300 milliseconds after the user stops typing. Furthermore, our data-fetching `useEffect` in `SearchPage.js` attaches an `AbortController` signal to the API request. If the query changes while an HTTP request is in-flight, the previous request is cancelled immediately, preventing race conditions where slower, outdated responses overwrite newer results."
