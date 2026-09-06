import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  User,
  Calendar,
  Share2,
  ArrowLeft,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Globe,
  Compass,
  ArrowRight,
} from "lucide-react";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import NotFound from "./NotFound";
import Spinner from "../components/ui/Spinner";
import api from "../services/api";
import { getReadTime } from "../utils/readTime";

const Article = () => {
  const { name } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [img2Error, setImg2Error] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/articles/${name}`);
        setArticle(data);
        document.title = `${data.title} | States`;
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [name]);

  if (loading) {
    return (
      <div className="pt-20">
        <Spinner label="Unfolding story..." />
      </div>
    );
  }

  if (!article) return <NotFound />;

  const allBlocks = article.content
    .split("\n\n")
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
  const splitIndex =
    allBlocks.findIndex((b) => b.startsWith("## Culture")) ||
    Math.floor(allBlocks.length / 2);
  const firstBlocks = allBlocks.slice(
    0,
    splitIndex > 0 ? splitIndex : Math.floor(allBlocks.length / 2)
  );
  const secondBlocks = allBlocks.slice(firstBlocks.length);

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(article.title);

  const renderBlocks = (blocks) =>
    blocks.map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i}>
            {block.replace("## ", "")}
          </h2>
        );
      }
      return <p key={i}>{block}</p>;
    });

  const handleCommentAdded = (newComment) => {
    setArticle((prev) => ({
      ...prev,
      comments: [newComment, ...(prev.comments || [])],
    }));
  };

  return (
    <article className="pb-20 md:pb-28">
      <header className="relative min-h-[55vh] md:min-h-[65vh] flex items-end overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />
        </div>

        <div className="relative z-10 page-container pb-12 md:pb-16 pt-28 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/articles-list"
              className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-6 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back to archive
            </Link>
            <span className="badge bg-accent/20 text-accent border border-accent/30 mb-4">
              {article.state}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.05] max-w-4xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/60 text-xs font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <User size={14} className="text-accent" aria-hidden="true" /> Kunal Prasad
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-accent" aria-hidden="true" /> March 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-accent" aria-hidden="true" />{" "}
                {getReadTime(article.content)} min read
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="page-container grid lg:grid-cols-12 gap-10 lg:gap-14 -mt-8 relative z-10">
        <main className="lg:col-span-8 bg-white dark:bg-primary/60 rounded-3xl md:rounded-4xl p-6 md:p-12 lg:p-14 shadow-card border border-gray-100/80 dark:border-white/10">
          <div className="prose-article max-w-none">
            {renderBlocks(firstBlocks)}

            {article.image2 && !img2Error && (
              <motion.figure
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="my-12 rounded-3xl overflow-hidden shadow-card"
              >
                <img
                  src={article.image2}
                  alt=""
                  className="w-full max-h-[480px] object-cover"
                  onError={() => setImg2Error(true)}
                  loading="lazy"
                />
              </motion.figure>
            )}

            {renderBlocks(secondBlocks)}
          </div>

          <section className="mt-14 p-8 md:p-10 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
            <h3 className="font-heading text-xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
              <Compass className="text-accent" size={24} aria-hidden="true" />
              Insider travel tips
            </h3>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                "Carry valid ID for major heritage sites",
                "Respect dress codes at religious places",
                "Book stays ahead during peak season",
                "Try local street food for authentic flavor",
                "Use official tourism guides where available",
              ].map((tip) => (
                <li key={tip} className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2
                    className="text-accent shrink-0 mt-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h3 className="font-heading text-xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
              <Globe className="text-secondary" size={24} aria-hidden="true" />
              Local updates
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-card transition-shadow">
                <span className="badge bg-accent/10 text-accent mb-3">Heritage</span>
                <h4 className="font-semibold text-primary dark:text-white mb-2">Night tours launched</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Official evening tours now cover major landmarks under the moonlight.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-card transition-shadow">
                <span className="badge bg-secondary/10 text-secondary mb-3">Transit</span>
                <h4 className="font-semibold text-primary dark:text-white mb-2">New eco-bus routes</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Sustainable lines connect airports to central tourist districts.
                </p>
              </div>
            </div>
          </section>

          <section id="comments" className="mt-16 pt-12 border-t border-gray-100 dark:border-white/10">
            <h3 className="font-heading text-2xl font-bold text-primary dark:text-white mb-8 flex items-center gap-2">
              <MessageSquare size={24} aria-hidden="true" />
              Discussion
            </h3>
            <div className="space-y-10">
              <AddCommentForm articleName={name} onCommentAdded={handleCommentAdded} />
              <CommentsList comments={article.comments || []} />
            </div>
          </section>
        </main>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-primary text-white p-8 rounded-3xl shadow-card relative overflow-hidden">
              <div
                className="absolute -top-8 -right-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-5">
                  Article info
                </h3>
                <dl className="space-y-5">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-accent shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="text-[10px] text-white/40 uppercase tracking-wider">
                        Location
                      </dt>
                      <dd className="font-medium text-sm">
                        {article.state}, India
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-secondary shrink-0" aria-hidden="true" />
                    <div>
                      <dt className="text-[10px] text-white/40 uppercase tracking-wider">
                        Reading time
                      </dt>
                      <dd className="font-medium text-sm">
                        {getReadTime(article.content)} minutes
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">
                    Share
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                      aria-label="Share on WhatsApp"
                    >
                      <Share2 size={16} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label="Share on X"
                    >
                      <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {article.sourceLink && (
              <div className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-card border border-gray-100 dark:border-white/10 text-center">
                <h3 className="font-heading text-lg font-bold text-primary dark:text-white mb-3">
                  Plan your trip to {article.state}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Official tourism resources and licensed guides.
                </p>
                <a
                  href={article.sourceLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-full bg-accent hover:bg-emerald-500 text-primary py-3.5 rounded-2xl font-semibold text-sm transition-all"
                >
                  Official portal <ArrowRight size={14} className="ml-2" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
};

export default Article;
