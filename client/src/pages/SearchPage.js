import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import api from "../services/api";
import ArticleCard from "../components/ui/ArticleCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { useDebounce } from "../hooks/useDebounce";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Sync state if URL changes externally (e.g. back/forward button)
  useEffect(() => {
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);

  // Sync URL search params when debounced term changes
  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim();
    if (trimmed !== queryFromUrl) {
      if (trimmed.length >= 2) {
        setSearchParams({ q: trimmed });
      } else if (!trimmed) {
        setSearchParams({});
      }
    }
  }, [debouncedSearchTerm, setSearchParams, queryFromUrl]);

  // Fetch search results from server with AbortController for race condition prevention
  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim();

    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const fetchSearchResults = async () => {
      try {
        const data = await api.get(
          `/articles?search=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        setSearchResults(data.articles || []);
      } catch (err) {
        if (err.name === "AbortError") {
          // Ignore cancelled requests
          return;
        }
        console.error("Error fetching search results:", err);
        setError(err.message || "Failed to fetch search results from server.");
        setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();

    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm]);

  const handleClear = () => {
    setSearchTerm("");
    setSearchParams({});
    setSearchResults([]);
  };

  const trimmedQuery = debouncedSearchTerm.trim();

  return (
    <div className="pt-28 pb-20 md:pb-28">
      <div className="page-container">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-12 md:mb-16 text-center"
        >
          <span className="badge bg-accent/10 text-accent mb-4">
            Server-side search
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary dark:text-white mb-4 tracking-tight">
            {trimmedQuery.length >= 2 ? (
              <>
                Results for{" "}
                <span className="text-secondary italic">
                  &ldquo;{trimmedQuery}&rdquo;
                </span>
              </>
            ) : (
              "Search the archive"
            )}
          </h1>

          <div className="relative max-w-xl mx-auto mt-6 group">
            <SearchIcon
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-accent transition-colors"
              size={20}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by title, state, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-14 pr-12 rounded-2xl"
            />
            {searchTerm && (
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

          {!loading && !error && trimmedQuery.length >= 2 && (
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
              {searchResults.length}{" "}
              {searchResults.length === 1 ? "story" : "stories"} found
            </p>
          )}
        </motion.header>

        {loading ? (
          <Spinner label="Searching database..." />
        ) : error ? (
          <div className="text-center py-12 space-y-4">
            <EmptyState title="Search error" description={error} />
            <Button onClick={() => window.location.reload()} variant="primary">
              Retry
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {trimmedQuery.length >= 2 && searchResults.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {searchResults.map((article, idx) => (
                  <ArticleCard key={article.name} article={article} index={idx} />
                ))}
              </motion.div>
            ) : trimmedQuery.length >= 2 && searchResults.length === 0 ? (
              <div className="space-y-6">
                <EmptyState
                  icon={SearchIcon}
                  title="No stories found"
                  description={`No stories found for "${trimmedQuery}". Try searching for another state or topic.`}
                />
                <div className="text-center">
                  <Button to="/articles-list" variant="primary">
                    Browse full collection
                  </Button>
                </div>
              </div>
            ) : trimmedQuery.length === 1 ? (
              <div className="text-center py-12">
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                  Please enter at least 2 characters to search.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Type a state name (e.g., &quot;Rajasthan&quot;, &quot;Kerala&quot;, &quot;Goa&quot;) or keyword above to query MongoDB.
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
