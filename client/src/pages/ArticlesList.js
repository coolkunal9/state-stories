import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import api from "../services/api";
import ArticleCard from "../components/ui/ArticleCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { useDebounce } from "../hooks/useDebounce";

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    document.title = "Explore India | States";
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const trimmed = debouncedQuery.trim();

    // If typing 1 character, do not send search request
    if (trimmed.length === 1) {
      setSearching(false);
      return;
    }

    const fetchArticles = async () => {
      setSearching(true);
      setError(null);

      try {
        const endpoint =
          trimmed.length >= 2
            ? `/articles?search=${encodeURIComponent(trimmed)}`
            : "/articles";

        const data = await api.get(endpoint, { signal: controller.signal });
        setArticles(data.articles || data);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("Error fetching articles:", err);
        setError(err.message || "Failed to load articles");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setSearching(false);
        }
      }
    };

    fetchArticles();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery("");
  };

  if (loading && !query) {
    return (
      <div className="pt-28">
        <Spinner label="Curating archive..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 page-container min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <EmptyState title="Connection lost" description={error} />
        <Button onClick={() => window.location.reload()} variant="primary">
          Retry connection
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <div className="page-container">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-16"
        >
          <span className="badge bg-accent/10 text-accent mb-4">Full collection</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary dark:text-white mb-4 tracking-tight text-balance">
            Explore the{" "}
            <span className="text-secondary italic">subcontinent</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10">
            {articles.length} {articles.length === 1 ? "story" : "stories"} in our editorial archive.
          </p>

          <div className="relative max-w-xl mx-auto group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-accent transition-colors"
              size={20}
              aria-hidden="true"
            />
            <label htmlFor="articles-search" className="sr-only">
              Filter articles
            </label>
            <input
              id="articles-search"
              type="search"
              placeholder="Search by state or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-14 pr-12 rounded-2xl"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-white p-1 transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.header>

        {searching ? (
          <Spinner label="Searching..." />
        ) : (
          <AnimatePresence mode="popLayout">
            {articles.length === 0 ? (
              <EmptyState
                title="No stories found"
                description={
                  query.trim()
                    ? `No stories found for "${query.trim()}". Try searching for another state or keyword.`
                    : 'Try searching for "Rajasthan", "Kerala", or "temple".'
                }
                actionLabel={query.trim() ? "View all stories" : undefined}
                actionTo={query.trim() ? "#" : undefined}
              />
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {articles.map((article, idx) => (
                  <ArticleCard key={article.name} article={article} index={idx} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ArticlesList;
