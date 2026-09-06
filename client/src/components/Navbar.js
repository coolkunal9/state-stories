import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  User,
  Compass,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const solidNav = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const linkClass = solidNav
    ? "text-text-main/70 dark:text-white/70 hover:text-accent"
    : "text-white/80 hover:text-white";

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          solidNav
            ? "glass-nav py-3 shadow-soft"
            : "bg-transparent py-5"
        }`}
        aria-label="Main navigation"
      >
        <div className="page-container flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="States home"
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
              <Compass size={22} aria-hidden="true" />
            </div>
            <span
              className={`font-heading text-xl font-bold tracking-tight transition-colors ${
                solidNav ? "text-primary dark:text-white" : "text-white"
              }`}
            >
              States
            </span>
          </Link>

          <div
            className={`hidden md:flex items-center gap-8 text-sm font-medium ${linkClass}`}
          >
            <Link to="/" className="transition-colors">
              Home
            </Link>
            <div className="relative group/drop">
              <button
                type="button"
                className="flex items-center gap-1 transition-colors"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Explore <ChevronDown size={14} aria-hidden="true" />
              </button>
              <div className="absolute top-full left-0 mt-3 w-52 bg-white dark:bg-primary rounded-2xl shadow-card border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover/drop:opacity-100 group-hover/drop:visible transition-all duration-200 translate-y-1 group-hover/drop:translate-y-0 p-2">
                <Link
                  to="/articles-list"
                  className="block px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-primary dark:text-white text-sm"
                >
                  All states
                </Link>
                <Link
                  to="/articles/rajasthan"
                  className="block px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-primary dark:text-white text-sm"
                >
                  Rajasthan
                </Link>
                <Link
                  to="/articles/kerala"
                  className="block px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-primary dark:text-white text-sm"
                >
                  Kerala
                </Link>
              </div>
            </div>
            <Link to="/about" className="transition-colors">
              About
            </Link>
          </div>

          <div
            className={`flex items-center gap-4 sm:gap-5 ${
              solidNav ? "text-primary dark:text-white" : "text-white"
            }`}
          >
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative group hidden md:block">
                <button
                  type="button"
                  className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-full font-semibold text-sm"
                >
                  <User size={14} aria-hidden="true" /> {user.username}
                </button>
                <div className="absolute top-full right-0 mt-3 w-44 bg-white dark:bg-primary rounded-2xl shadow-card border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-medium text-primary dark:text-white transition-colors"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-sm font-medium transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden md:inline-flex bg-accent hover:bg-emerald-500 text-primary px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:shadow-soft"
              >
                Sign in
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              aria-expanded={mobileMenu}
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 dark:border-white/10 bg-white dark:bg-primary overflow-hidden"
            >
              <div className="page-container py-6 flex flex-col gap-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/articles-list", label: "Explore states" },
                  { to: "/about", label: "About" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="py-3 text-lg font-medium text-primary dark:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenu(false)}
                      className="py-3 text-lg font-medium text-primary dark:text-white"
                    >
                      My Profile ({user.username})
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenu(false);
                      }}
                      className="py-3 text-left text-red-600 font-medium text-lg"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileMenu(false);
                    }}
                    className="mt-4 bg-accent text-primary py-3.5 rounded-2xl font-semibold"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-xl flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors p-2"
              aria-label="Close search"
            >
              <X size={32} />
            </button>
            <div className="w-full max-w-3xl">
              <label htmlFor="nav-search" className="sr-only">
                Search articles
              </label>
              <input
                id="nav-search"
                type="search"
                autoFocus
                placeholder="Search by state or experience..."
                className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-3xl md:text-5xl font-heading font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-secondary transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <p className="mt-6 text-white/40 text-xs font-medium uppercase tracking-widest">
                Press Enter to search
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
