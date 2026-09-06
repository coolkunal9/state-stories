import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowRight, Map } from "lucide-react";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-28 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl translate-x-1/2"
        aria-hidden="true"
      />

      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl text-accent mb-8 shadow-card">
            <Compass size={32} aria-hidden="true" />
          </div>

          <p
            className="font-heading text-[8rem] md:text-[10rem] font-bold text-primary/5 leading-none mb-2 select-none"
            aria-hidden="true"
          >
            404
          </p>

          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            You&apos;ve strayed{" "}
            <span className="text-secondary italic">off the map</span>
          </h1>

          <p className="text-gray-500 mb-10 leading-relaxed max-w-md mx-auto">
            This destination isn&apos;t in our archive yet, or the link may be outdated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/" variant="primary" size="lg">
              Return home <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Link
              to="/articles-list"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors py-3"
            >
              <Map size={18} aria-hidden="true" /> Browse archive
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
