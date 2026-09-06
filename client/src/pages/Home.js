import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  TrendingUp,
  Mail,
  ShieldCheck,
  Zap,
} from "lucide-react";
import api from "../services/api";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";
import ArticleCard from "../components/ui/ArticleCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    document.title = "States | Discover Incredible India";
    const fetchArticles = async () => {
      try {
        const data = await api.get("/articles");
        setArticles(data.articles || data);
      } catch (err) {
        console.error("Failed to load articles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="bg-background dark:bg-primary transition-colors duration-300">
      {/* Hero — full bleed */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-primary -mt-0">
        <div className="absolute inset-0">
          <img
            src="/images/home3.jpg"
            alt="Taj Mahal at sunrise"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-primary/10" />
        </div>

        <div className="relative z-10 text-center px-5 sm:px-6 max-w-4xl pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="badge bg-white/10 text-accent border border-accent/30 backdrop-blur-md mb-6">
              <Compass size={14} aria-hidden="true" /> The ultimate travel journal
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05] text-balance">
              Discover India.{" "}
              <span className="text-secondary italic">One state</span> at a time.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
              Curated stories of heritage, culture, and untamed beauty across Bharat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/articles-list" variant="accent" size="lg">
                Start exploring <ArrowRight size={18} aria-hidden="true" />
              </Button>
              <Link
                to="/about"
                className="text-white/90 hover:text-secondary font-medium transition-colors py-3"
              >
                Our mission →
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/35 gap-2"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* Bento Collection */}
      <section className="py-20 md:py-28">
        <div className="page-container">
          <SectionHeader
            eyebrow="Editorial picks"
            title="The bento collection"
            description="Hand-picked highlights from across the subcontinent."
            actionLabel="View all states"
            actionTo="/articles-list"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[minmax(200px,auto)]"
          >
            {/* Main Featured Card - Rajasthan */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-7 md:row-span-2 relative rounded-3xl overflow-hidden group min-h-[380px] shadow-card"
            >
              <img
                src="/images/rajasthan.jpg"
                alt="Rajasthan Forts"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="badge bg-orange-500 text-white mb-3 shadow-sm">
                  Iconic
                </span>
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                  Rajasthan
                </h3>
                <p className="text-gray-300 text-sm mb-4 max-w-sm leading-relaxed">
                  Forts, deserts, and stories of timeless royal valor.
                </p>
                <Link
                  to="/articles/rajasthan"
                  className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:gap-3 transition-all"
                >
                  Explore <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Secondary Featured Card - Kerala */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-5 relative rounded-3xl overflow-hidden group min-h-[240px] shadow-card"
            >
              <Link to="/articles/kerala" className="block h-full">
                <img
                  src="/images/kerala.jpg"
                  alt="Kerala Backwaters"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="badge bg-emerald-500 text-white mb-2 shadow-sm">
                    Serene
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-white">Kerala</h3>
                  <p className="text-gray-300 text-xs mt-1">God&apos;s Own Country</p>
                </div>
              </Link>
            </motion.div>

            {/* Two Smaller Cards - Varanasi & Goa */}
            {[
              { name: "Varanasi", slug: "varanasi", img: "/images/varanasi.jpg", tag: "Spiritual" },
              { name: "Goa", slug: "goa", img: "/images/goa.jpg", tag: "Coastal" },
            ].map((place) => (
              <motion.div
                key={place.slug}
                variants={itemVariants}
                className="md:col-span-6 lg:col-span-2.5 relative rounded-3xl overflow-hidden group min-h-[200px] shadow-card"
              >
                <Link to={`/articles/${place.slug}`} className="block h-full">
                  <img
                    src={place.img}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent group-hover:from-primary/95 transition-colors" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
                        {place.tag}
                      </p>
                      <h3 className="font-heading text-xl font-bold text-white">{place.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Stories */}
      <section className="py-20 bg-white/70 dark:bg-primary/80 border-y border-gray-100 dark:border-white/10 transition-colors duration-300">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary dark:bg-accent rounded-xl flex items-center justify-center text-white dark:text-primary shadow-sm">
              <TrendingUp size={18} aria-hidden="true" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary dark:text-white">
              Trending stories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse"
                    aria-hidden="true"
                  />
                ))
              : articles
                  .filter((a) => a.name !== "maharashtra")
                  .slice(0, 3)
                  .map((article, idx) => (
                    <ArticleCard key={article.name} article={article} index={idx} />
                  ))}
          </div>
        </div>
      </section>

      {/* Values / Why Follow States */}
      <section className="py-20 md:py-28">
        <div className="page-container">
          <div className="bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-4xl md:rounded-5xl p-8 md:p-14 overflow-hidden relative shadow-card backdrop-blur-md transition-colors duration-300">
            <div
              className="absolute -top-20 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-20 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-white mb-6 tracking-tight">
                  Why follow the <span className="text-secondary italic">States</span> story?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-10 leading-relaxed">
                  A digital archive of the subcontinent&apos;s culture, heritage, and
                  travel wisdom — researched and beautifully told.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      icon: <ShieldCheck className="text-accent" size={22} />,
                      title: "Curated excellence",
                      desc: "Historical and cultural accuracy in every article.",
                    },
                    {
                      icon: <Zap className="text-secondary" size={22} />,
                      title: "Modern experience",
                      desc: "Fast, readable, and responsive on every device.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/5 dark:bg-white/10 flex items-center justify-center border border-gray-200/50 dark:border-white/10">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-primary dark:text-white font-semibold mb-0.5">{item.title}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <img
                src="/images/home1.jpg"
                alt="Indian landscape"
                className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 md:py-24">
        <div className="page-container max-w-3xl">
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl md:rounded-4xl p-8 md:p-12 text-center shadow-card backdrop-blur-md transition-colors duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-2xl mb-6">
              <Mail size={28} aria-hidden="true" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
              The weekly state story
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto text-sm md:text-base">
              Join explorers receiving our best stories every Sunday.
            </p>

            {subscribed ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent/10 text-accent font-medium p-5 rounded-2xl border border-accent/20 max-w-md mx-auto"
                role="status"
              >
                Welcome aboard — check your inbox soon.
              </motion.p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field flex-1 rounded-2xl"
                  required
                />
                <Button type="submit" variant="primary" size="md" className="shrink-0 rounded-2xl">
                  Join now
                </Button>
              </form>
            )}
            <p className="mt-6 text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest">
              No spam — just stories.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

