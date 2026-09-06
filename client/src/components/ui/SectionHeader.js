import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  align = "left",
  className = "",
}) {
  const alignClass =
    align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div
      className={`flex flex-col gap-4 mb-12 md:mb-16 ${
        actionLabel ? "md:flex-row md:items-end md:justify-between" : ""
      } ${className}`}
    >
      <div className={`max-w-2xl ${alignClass}`}>
        {eyebrow && (
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            {eyebrow}
          </span>
        )}
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-white tracking-tight text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="shrink-0 inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
        >
          {actionLabel} <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
