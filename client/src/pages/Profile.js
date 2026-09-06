import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

/**
 * Format ISO date string into readable Month Year (e.g., "August 2026").
 */
const formatJoinedDate = (dateString) => {
  if (!dateString) return "Recently joined";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "Recently joined";
  }
};

/**
 * Format ISO date string into readable short date (e.g., "Aug 25, 2026").
 */
const formatCommentDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
};

const Profile = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserComments = async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/auth/my-comments", { signal });
      setComments(data.comments || []);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Error fetching user comments:", err);
      setError(err.message || "Unable to load your activity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `${user?.username || "User"} Profile | States`;
    const controller = new AbortController();
    fetchUserComments(controller.signal);

    return () => {
      controller.abort();
    };
  }, [user]);

  const initialLetter = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="pt-28 pb-20 md:pb-28 min-h-screen bg-background dark:bg-primary transition-colors duration-300">
      <div className="page-container">
        {/* Header Grid: Profile Info Card + Activity Stat Card */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Main User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl md:rounded-4xl p-8 md:p-10 shadow-card backdrop-blur-md transition-colors duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar Circle */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-accent to-secondary text-primary font-heading font-bold text-3xl sm:text-4xl flex items-center justify-center shadow-lg shrink-0">
                {initialLetter}
              </div>

              {/* User Metadata */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary dark:text-white">
                    {user?.username}
                  </h1>
                  <span className="badge bg-accent/10 text-accent border border-accent/20">
                    <Shield size={12} className="mr-1" aria-hidden="true" />
                    {user?.role === "admin" ? "Admin" : "Member"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-secondary shrink-0" aria-hidden="true" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-accent shrink-0" aria-hidden="true" />
                    <span>Joined {formatJoinedDate(user?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Stat Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl md:rounded-4xl p-8 flex flex-col justify-center items-center text-center shadow-card backdrop-blur-md transition-colors duration-300"
          >
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-3">
              <MessageSquare size={22} aria-hidden="true" />
            </div>
            <span className="font-heading text-4xl font-bold text-primary dark:text-white mb-1">
              {loading ? "..." : comments.length}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
              Comments Shared
            </span>
          </motion.div>
        </div>

        {/* Section: Activity & Comments */}
        <section aria-labelledby="activity-heading">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <MessageSquare size={18} aria-hidden="true" />
              </div>
              <h2
                id="activity-heading"
                className="font-heading text-2xl font-bold text-primary dark:text-white"
              >
                My Discussion Activity
              </h2>
            </div>
          </div>

          {loading ? (
            /* Skeleton Loading State (3 cards) */
            <div className="space-y-5" aria-label="Loading comments">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8 animate-pulse h-36"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8 text-center shadow-card space-y-4">
              <p className="text-red-500 dark:text-red-400 font-medium text-sm">
                {error}
              </p>
              <Button
                onClick={() => fetchUserComments()}
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <RefreshCw size={14} /> Retry
              </Button>
            </div>
          ) : comments.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-10 md:p-14 text-center shadow-card">
              <EmptyState
                icon={MessageSquare}
                title="No comments shared yet"
                description="Start exploring stories across India and join the discussion."
                actionLabel="Explore stories"
                actionTo="/articles-list"
              />
            </div>
          ) : (
            /* Comments List */
            <AnimatePresence mode="popLayout">
              <div className="space-y-5">
                {comments.map((comment, idx) => (
                  <motion.article
                    key={comment.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-card hover:shadow-card-hover transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      {/* Article Info */}
                      {comment.article ? (
                        <div className="flex items-center gap-2.5">
                          <span className="badge bg-accent/10 text-accent font-semibold text-xs">
                            <MapPin size={12} className="mr-1 inline" />
                            {comment.article.state}
                          </span>
                          <Link
                            to={`/articles/${comment.article.name}`}
                            className="font-heading font-bold text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors text-base md:text-lg line-clamp-1"
                          >
                            {comment.article.title}
                          </Link>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm italic">
                          Article unavailable
                        </span>
                      )}

                      {/* Comment Date */}
                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 shrink-0">
                        {formatCommentDate(comment.createdAt)}
                      </span>
                    </div>

                    {/* Comment Body Text */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                      &ldquo;{comment.text}&rdquo;
                    </p>

                    {/* Action Link */}
                    {comment.article && (
                      <div className="flex justify-end">
                        <Link
                          to={`/articles/${comment.article.name}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary dark:hover:text-white transition-colors"
                        >
                          View story <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>
            </AnimatePresence>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
