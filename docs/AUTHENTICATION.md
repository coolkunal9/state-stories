# State Stories — Authentication & Session Architecture

## 1. Authentication Strategy

State Stories implements a stateless JSON Web Token (JWT) authentication strategy combined with bcrypt password hashing.

```
┌──────────────┐                                      ┌──────────────┐                               ┌──────────────┐
│ React Client │                                      │ Express API  │                               │ MongoDB      │
└──────┬───────┘                                      └──────┬───────┘                               └──────┬───────┘
       │                                                     │                                              │
       │ 1. POST /api/auth/login { email, password }         │                                              │
       ├────────────────────────────────────────────────────>│                                              │
       │                                                     │ 2. Find user by email                        │
       │                                                     ├─────────────────────────────────────────────>│
       │                                                     │<─────────────────────────────────────────────┤
       │                                                     │ 3. bcrypt.compare(password, user.password)   │
       │                                                     │ 4. Sign JWT with payload { id, role }        │
       │ 5. Respond 200 { token, user: { id, email, ... } }  │                                              │
       │<────────────────────────────────────────────────────┤                                              │
       │                                                     │                                              │
       │ 6. Store token in localStorage                      │                                              │
       │ 7. Set AuthContext state                            │                                              │
       │                                                     │                                              │
       │ 8. Authenticated Request: GET /api/auth/me          │                                              │
       │    Header: Authorization: Bearer <token>            │                                              │
       ├────────────────────────────────────────────────────>│                                              │
       │                                                     │ 9. authenticate middleware: jwt.verify()     │
       │                                                     │ 10. Load user profile                        │
       │                                                     ├─────────────────────────────────────────────>│
       │                                                     │<─────────────────────────────────────────────┤
       │ 11. Respond 200 { user }                            │                                              │
       │<────────────────────────────────────────────────────┤                                              │
```

---

## 2. Password Hashing (bcrypt)

Passwords must never be stored in plain text. State Stories uses `bcrypt` with **12 salt rounds**.

### Registration Flow (`server/services/authService.js`)
```javascript
const SALT_ROUNDS = 12;
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

const user = await User.create({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: "user",
});
```

### Why 12 Salt Rounds?
Bcrypt uses an adaptive cost factor (`2^rounds` iterations). 12 rounds computes 4,096 iterations, taking ~250–350ms on modern server hardware. This rate strikes an optimal balance between responsive user login and exponential defense against offline dictionary and brute-force GPU attacks.

---

## 3. JWT Token Lifecycle & Security

### Token Generation
Upon valid credentials, a signed JWT is issued with a 7-day expiry:
```javascript
const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
);
```

### Production Security Guard (`server/middleware/auth.js`)
To eliminate the risk of running in production with weak or default development secrets:
```javascript
const INSECURE_DEFAULT = "state-stories-dev-secret-change-me";

if (process.env.NODE_ENV === "production") {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === INSECURE_DEFAULT) {
        throw new Error(
            "[FATAL] JWT_SECRET must be set to a secure secret in production. Application refusing to start."
        );
    }
}
```

### Authorization Header Verification
Protected routes intercept requests using `authenticate` middleware:
```javascript
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please log in.",
        });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id: "...", role: "user", iat: ..., exp: ... }
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please log in again.",
        });
    }
};
```

---

## 4. Frontend State & Session Persistence

The frontend maintains authentication state through `client/src/context/AuthContext.js`:

```javascript
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                try {
                    // Re-validate token with backend on page load
                    const userData = await api.getMe();
                    setUser(userData);
                    setToken(savedToken);
                } catch (err) {
                    // Expired or invalid token — clean up
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);
    // ...
};
```

### Automatic Header Injection (`client/src/services/api.js`)
All outbound API requests automatically inject the stored JWT:
```javascript
const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    // ...
};
```

---

## 5. Trade-offs: `localStorage` vs `httpOnly` Cookies

| Aspect | `localStorage` (Current Implementation) | `httpOnly` Cookies (Enterprise Alternative) |
|---|---|---|
| **Storage Location** | Browser Web Storage API | Browser Cookie Jar (flagged `HttpOnly`) |
| **XSS Vulnerability** | Vulnerable if JavaScript injection occurs | Immune to client JavaScript extraction |
| **CSRF Vulnerability** | Immune (tokens must be explicitly attached via code) | Vulnerable unless `SameSite=Strict` or Anti-CSRF token used |
| **Cross-Domain / Serverless** | Easy to pass cross-origin across distinct subdomains | Requires matching domain cookies & CORS credentials config |
| **Recommendation** | Ideal for decoupled SPAs when strict XSS sanitization and CSP are enforced | Preferred for banking, payment, or enterprise healthcare applications |
