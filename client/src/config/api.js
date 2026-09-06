/**
 * API base URL for all client requests.
 * - Dev: set REACT_APP_API_URL in client/.env (or use CRA proxy with /api)
 * - Production: set REACT_APP_API_URL in your host's env before `npm run build`
 */
const fromEnv = process.env.REACT_APP_API_URL?.replace(/\/$/, "");

export const API_BASE_URL = fromEnv || "http://localhost:8000/api";
