import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { getReadTime, excerptFromContent } from "../../utils/readTime";

export default function ArticleCard({ article, index = 0 }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group flex flex-col bg-white dark:bg-primary/60 rounded-3xl overflow-hidden border border-gray-100/80 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <Link
        to={`/articles/${article.name}`}
        className="relative aspect-[16/11] overflow-hidden block"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-5 left-5 bg-white/95 dark:bg-primary/90 backdrop-blur-sm text-primary dark:text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
          {article.state}
        </span>
      </Link>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-accent text-[10px] font-bold uppercase tracking-widest mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" /> India
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />{" "}
            {getReadTime(article.content)} min read
          </span>
        </div>

        <Link to={`/articles/${article.name}`}>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-primary dark:text-white mb-3 leading-snug group-hover:text-accent transition-colors">
            {article.title}
          </h2>
        </Link>

        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {excerptFromContent(article.content)}
        </p>

        <div className="mt-auto pt-5 border-t border-gray-50 dark:border-white/10">
          <Link
            to={`/articles/${article.name}`}
            className="inline-flex items-center gap-2 text-primary dark:text-white text-xs font-bold uppercase tracking-wider hover:text-accent dark:hover:text-accent transition-colors group/link"
          >
            Read story
            <ArrowRight
              size={14}
              className="group-hover/link:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
