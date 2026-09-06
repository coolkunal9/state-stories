import React, { createContext, useState, useEffect, useContext } from "react";
import { API_BASE_URL } from "../config/api";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Verify existing JWT token with backend on initial page load
    useEffect(() => {
        let isMounted = true;
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
            if (isMounted) {
                setUser(null);
                setAuthLoading(false);
            }
            return;
        }

        const verifySession = async () => {
            try {
                const data = await api.get("/auth/me");
                if (isMounted && data.success && data.user) {
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
            } catch (err) {
                // Silently clear session on invalid or expired token
                if (isMounted) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setAuthLoading(false);
                }
            }
        };

        verifySession();

        return () => {
            isMounted = false;
        };
    }, []);

    /**
     * Registers a new user.
     */
    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.errors ? data.errors.join(", ") : (data.message || "Failed to register account.");
                throw new Error(errorMsg);
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Authenticates an existing user.
     */
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.errors ? data.errors.join(", ") : (data.message || "Failed to log in.");
                throw new Error(errorMsg);
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Unauthenticates and destroys the current user session.
     */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        authLoading,
        loading,
        error,
        register,
        login,
        logout,
        setError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the auth context easily
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
