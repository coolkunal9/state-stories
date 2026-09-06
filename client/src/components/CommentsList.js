import React from "react";
import { User } from "lucide-react";

const CommentsList = ({ comments }) => {
  return (
    <div>
      <h3 className="font-heading text-xl font-bold text-primary dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic py-4">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li
              key={index}
              className="bg-white dark:bg-white/5 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/5 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white">
                  <User size={14} aria-hidden="true" />
                </div>
                <h4 className="font-semibold text-primary dark:text-white">{comment.username}</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentsList;
