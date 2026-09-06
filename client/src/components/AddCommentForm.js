import React, { useState } from "react";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Button from "./ui/Button";

const AddCommentForm = ({ articleName, onCommentAdded }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const result = await api.post(`/articles/${articleName}/comments`, {
        text: commentText,
      });

      if (onCommentAdded) {
        onCommentAdded(result.comment);
      }
      setCommentText("");
    } catch (err) {
      setError(err.message || "Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/10">
      <h3 className="font-heading text-xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
        <MessageSquarePlus size={22} className="text-accent" aria-hidden="true" />
        Add a comment
      </h3>

      {user ? (
        <form onSubmit={addComment} className="space-y-4">
          {error && (
            <div
              className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 rounded-2xl text-sm text-red-700 dark:text-red-400"
              role="alert"
            >
              {error}
            </div>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Commenting as{" "}
            <span className="font-semibold text-primary dark:text-white">{user.username}</span>
          </p>

          <label htmlFor="comment-text" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment-text"
            rows={4}
            placeholder="Share your thoughts about this state..."
            value={commentText}
            required
            onChange={(e) => setCommentText(e.target.value)}
            className="input-field resize-none"
          />

          <Button
            type="submit"
            variant="accent"
            disabled={submitting || !commentText.trim()}
            className="disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Posting...
              </>
            ) : (
              "Post comment"
            )}
          </Button>
        </form>
      ) : (
        <p className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
          Sign in from the menu above to join the discussion.
        </p>
      )}
    </div>
  );
};

export default AddCommentForm;
