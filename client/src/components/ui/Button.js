import React from "react";
import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-primary dark:bg-accent text-white dark:text-primary shadow-soft hover:bg-slate-800 dark:hover:bg-emerald-500 focus-visible:ring-primary/30",
  accent:
    "bg-accent text-primary shadow-soft hover:bg-emerald-500 focus-visible:ring-accent/40",
  outline:
    "border-2 border-primary/15 dark:border-white/20 text-primary dark:text-white bg-white dark:bg-white/5 hover:border-primary/30 dark:hover:border-white/40 hover:bg-white dark:hover:bg-white/10 focus-visible:ring-primary/20",
  ghost:
    "text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white hover:bg-primary/5 dark:hover:bg-white/10 focus-visible:ring-primary/15",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  to,
  href,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:pointer-events-none";

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
