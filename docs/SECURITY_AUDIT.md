# State Stories — Application Security Audit & Hardening Guide

## 1. Security Architecture Summary

State Stories adopts a defense-in-depth security approach combining network hardening, header security, request rate-limiting, strict input schema validation, password hashing, and token verification.

```
Incoming Request
  │
  ├─ 1. HTTP Security Headers (Helmet)
  ├─ 2. CORS Allowlist Validation (No Wildcards in Production)
  ├─ 3. Auth-Specific Rate Limiter (Brute-Force Defense)
  ├─ 4. Global API Rate Limiter (DoS Defense)
  ├─ 5. JSON Body Size Guard (100kb limit)
  ├─ 6. Database Health Check (Cold-Start Fault Isolation)
  ├─ 7. Bearer JWT Signature & Expiry Check
  ├─ 8. Joi Schema Payload Validation
  ├─ 9. Sanitization & Escaping (Regex Injection & XSS)
  └─ 10. Database Execution with Least-Privilege Queries
```

---

## 2. Vulnerability Assessment & Implemented Mitigations

### 1. Insecure Fallback JWT Secret in Production
- **Vulnerability:** If `JWT_SECRET` was omitted from production environment variables, the server defaulted to `"state-stories-dev-secret-change-me"`. An attacker knowing this public default could forge arbitrary admin/user JWT tokens.
- **Remediation:** Added a production startup guard in `server/middleware/auth.js` and `server/server.js` that halts server boot if `JWT_SECRET` is unset or equals the dev fallback when `NODE_ENV === "production"`.

### 2. CORS Wildcard Exposure
- **Vulnerability:** Previous CORS rules allowed any subdomain matching `*.vercel.app`. Any malicious website deployed to Vercel could make cross-origin requests to the API.
- **Remediation:** Replaced regex wildcards with an explicit origin array (`allowedOrigins`) that checks `process.env.CLIENT_URL` and exact trusted URLs.

### 3. Regex Injection / ReDoS in State Filter
- **Vulnerability:** `new RegExp('^' + state + '$', 'i')` directly interpolated unescaped user input into regular expressions. Special regex characters could cause unintended matching or catastrophic backtracking (ReDoS).
- **Remediation:** Updated `server/services/articleService.js` to escape special regex characters via `state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` before compiling the regular expression.

### 4. Uncapped Limit Parameter (Resource Exhaustion)
- **Vulnerability:** Requesting `GET /api/articles?limit=1000000` could force MongoDB into memory exhaustion.
- **Remediation:** Added `const MAX_LIMIT = 50;` in `server/services/articleService.js` and clamped all incoming limit arguments: `Math.min(Math.max(1, parseInt(limit, 10)), MAX_LIMIT)`.

### 5. Brute Force on Authentication Endpoints
- **Vulnerability:** Generic global rate limiter allowed 100 requests per 15 minutes across all endpoints, which was too loose for `/api/auth/login` and `/api/auth/register`.
- **Remediation:** Configured a dedicated `authLimiter` with a threshold of 10 attempts per 15 minutes per IP applied specifically to `/api/auth/login` and `/api/auth/register`.

### 6. Destructive Seed Script
- **Vulnerability:** `seed.js` previously called `Article.deleteMany({})` without checking environment context, risking immediate data loss if triggered against production MongoDB.
- **Remediation:** Converted seeding to idempotent `bulkWrite` upserts and added an environment block that aborts execution in production unless explicitly overridden with `--force`.

---

## 3. Defense Implementation Checklist

| Category | Security Control | File Reference | Status |
|---|---|---|---|
| **Headers** | Helmet (11 security headers including HSTS, X-Content-Type) | `server/server.js` | ✅ Hardened |
| **CORS** | Strict Origin Allowlist without wildcards | `server/server.js` | ✅ Hardened |
| **Rate Limiting** | General API (100 req/15m) + Auth API (10 req/15m) | `server/server.js` | ✅ Hardened |
| **Authentication** | Bcrypt (12 rounds) + JWT (7-day expiry, fail-fast secret) | `server/middleware/auth.js` | ✅ Hardened |
| **Input Validation** | Joi schemas on register, login, comments | `server/middleware/validate.js` | ✅ Hardened |
| **XSS Prevention** | Server-side HTML escaping + React JSX text escaping | `server/services/articleService.js` | ✅ Hardened |
| **Error Handling** | Generic client messages; stack traces hidden in production | `server/middleware/errorHandler.js` | ✅ Hardened |
| **Secrets Management** | `.gitignore` excludes `.env`, `client/.env`, `server/.env` | `.gitignore` | ✅ Verified |
