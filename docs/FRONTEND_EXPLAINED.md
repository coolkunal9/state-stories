# State Stories — Frontend Architecture & Component Guide

## 1. Design System & Technology Stack

The State Stories client is built as a single-page application (SPA) with a focus on typography, aesthetic regional imagery, smooth micro-interactions, and accessibility.

- **Framework:** React 18 with React Router v7
- **Styling:** Tailwind CSS with custom aesthetic theme tokens (Warm Sand `#FBF8F3`, Deep Emerald `#1A3026`, Indian Terracotta `#C85A32`, Gold/Saffron `#D48B38`)
- **Micro-Animations:** Framer Motion for scroll reveals, modal overlays, and optimistic comment insertion
- **Icons:** Lucide React (`lucide-react`)
- **Theme Support:** Native Dark Mode toggle with `localStorage` persistence and `document.documentElement.classList` integration

---

## 2. Component Hierarchy & Flow

```
App.js (BrowserRouter, AuthProvider)
 │
 ├── Navbar (Theme Toggle, Search Link, Auth Trigger / Profile Menu)
 │
 ├── Routes
 │    ├── /                      → Home.js (Hero, Curated Articles, Values, Newsletter)
 │    ├── /articles-list         → ArticlesList.js (Grid of All Articles, Filter)
 │    ├── /articles/:name        → Article.js (Hero Banner, Content Blocks, Comments Feed, AddCommentForm)
 │    ├── /search                → SearchPage.js (Debounced Live Full-Text Search)
 │    ├── /profile               → Profile.js (Protected: User Info & Comment Activity)
 │    ├── /about                 → About.js (Mission & Tech Stack)
 │    └── *                      → NotFound.js (404 Fallback)
 │
 ├── AuthModal (Controlled Modal for Login / Registration)
 └── Footer (Quick Links, Regional Directory, Legal Info)
```

---

## 3. Key Patterns & Implementation Details

### 1. Custom HTTP Client with Automatic JWT Injection (`client/src/services/api.js`)
Instead of importing Axios, State Stories uses a native `fetch` wrapper that handles JSON serialization, error message parsing, and dynamic authorization header injection:
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "An unexpected error occurred.");
    }
    return data;
};
```

### 2. Debounced Search Hook (`client/src/hooks/useDebounce.js`)
Prevents server spam during typing in the search bar by delaying state updates by 300ms:
```javascript
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
```

### 3. Request Lifecycle Cleanup with `AbortController`
Pages like `SearchPage.js` and `Profile.js` utilize `AbortController` to cancel in-flight HTTP requests if the component unmounts or if the user modifies search parameters before the previous request finishes:
```javascript
useEffect(() => {
    const controller = new AbortController();

    const fetchResults = async () => {
        try {
            setLoading(true);
            const res = await api.getArticles({ search: debouncedQuery, signal: controller.signal });
            setArticles(res.data || []);
        } catch (err) {
            if (err.name !== "AbortError") {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    fetchResults();
    return () => controller.abort();
}, [debouncedQuery]);
```

### 4. Optimistic UI Updates in Comments (`client/src/pages/Article.js`)
When an authenticated user submits a comment, the client immediately updates the local React state with the returned comment data, avoiding a full page re-fetch or reload.
