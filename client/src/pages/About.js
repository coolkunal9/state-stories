import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Compass, Heart } from "lucide-react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const techStack = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind CSS",
  "Framer Motion",
  "REST API",
  "Vercel",
];

const About = () => {
  useEffect(() => {
    document.title = "Our Story | States";
  }, []);

  return (
    <div>
      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/images/home.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-5 pt-28 pb-16"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Our story
          </h1>
          <p className="text-secondary text-sm md:text-base uppercase tracking-[0.2em] font-medium">
            Celebrating the spirit of India
          </p>
        </motion.div>
      </section>

      <div className="page-container -mt-12 relative z-10 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              {...fadeIn}
              className="bg-white dark:bg-white/5 p-8 md:p-10 rounded-3xl shadow-card border border-gray-100 dark:border-white/10"
            >
              <div className="flex items-center gap-2 mb-4 text-accent">
                <Compass size={24} aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  The mission
                </span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-primary dark:text-white mb-5 leading-snug">
                More than a travel blog — a digital legacy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5 italic border-l-2 border-accent/30 pl-4">
                Welcome to States — a platform celebrating the diversity, culture, and
                beauty of India, from the Himalayas to the southern backwaters.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                As a full-stack developer in Jaipur, Rajasthan, I built this archive so
                travelers and culture enthusiasts can explore every state with clarity,
                speed, and editorial care.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Globe size={22} />,
                  iconWrap: "bg-secondary/10 text-secondary",
                  title: "Vast diversity",
                  text: "28 states and 8 union territories — each with its own language, cuisine, and history.",
                },
                {
                  icon: <Heart size={22} />,
                  iconWrap: "bg-accent/10 text-accent",
                  title: "Authentic stories",
                  text: "Deep dives into local cultures that make India a living museum.",
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  {...fadeIn}
                  className="bg-white dark:bg-white/5 p-7 rounded-3xl shadow-card border border-gray-100 dark:border-white/10"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${card.iconWrap}`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <motion.div
              {...fadeIn}
              className="bg-primary text-white p-8 rounded-3xl shadow-card relative overflow-hidden text-center"
            >
              <div className="relative z-10">
                <div className="w-28 h-28 mx-auto mb-5 p-1 bg-gradient-to-tr from-accent to-secondary rounded-full">
                  <img
                    src="/images/kunal-photo.jpg"
                    alt="Kunal Prasad"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://ui-avatars.com/api/?name=Kunal+Prasad&background=0F172A&color=fff";
                    }}
                  />
                </div>
                <h3 className="font-heading text-xl font-bold mb-1">Kunal Prasad</h3>
                <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-5">
                  Full-stack developer
                </p>
                <div className="flex justify-center gap-3">
                  {[
                    { href: "https://github.com/coolKunal9", icon: <FaGithub size={16} />, label: "GitHub" },
                    {
                      href: "https://www.linkedin.com/in/kunal-prasad-7676392bb/",
                      icon: <FaLinkedin size={16} />,
                      label: "LinkedIn",
                    },
                    {
                      href: "mailto:kunalprasad142@gmail.com",
                      icon: <FaEnvelope size={16} />,
                      label: "Email",
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
              <div
                className="absolute -bottom-10 -right-10 w-36 h-36 bg-accent/20 rounded-full blur-3xl"
                aria-hidden="true"
              />
            </motion.div>

            <motion.div
              {...fadeIn}
              className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-card border border-gray-100 dark:border-white/10"
            >
              <h3 className="font-heading text-lg font-bold text-primary dark:text-white mb-5 flex items-center gap-2">
                <ExternalLink size={18} className="text-accent" aria-hidden="true" />
                Built with
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-100 dark:border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
