import React from "react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="text-center py-16 md:py-20 px-6 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 shadow-card max-w-lg mx-auto">
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 dark:bg-white/10 text-primary dark:text-white mb-6">
          <Icon size={28} aria-hidden="true" />
        </div>
      )}
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary dark:text-white mb-3 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Button to={actionTo} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
