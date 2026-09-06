import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const socials = [
    { icon: <FaGithub size={18} />, link: "https://github.com/coolKunal9", label: "GitHub" },
    {
      icon: <FaLinkedin size={18} />,
      link: "https://www.linkedin.com/in/kunal-prasad-7676392bb/",
      label: "LinkedIn",
    },
    { icon: <FaTwitter size={18} />, link: "#", label: "Twitter" },
    { icon: <FaEnvelope size={18} />, link: "mailto:kunalprasad142@gmail.com", label: "Email" },
  ];

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="page-container py-16 md:py-20 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Compass size={24} aria-hidden="true" />
              </div>
              <span className="font-heading text-2xl font-bold">States</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-8">
              A premium editorial platform dedicated to the soul of India — heritage,
              culture, and stories from every corner of the subcontinent.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-primary hover:border-accent transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-5">
              Navigation
            </h4>
            <ul className="space-y-3 text-gray-300">
              {[
                { to: "/", label: "Home" },
                { to: "/articles-list", label: "Explore states" },
                { to: "/about", label: "Our story" },
                { to: "/search", label: "Search archive" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-5">
              Featured
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/articles/rajasthan" className="hover:text-white transition-colors">
                  Rajasthan
                </Link>
              </li>
              <li>
                <Link to="/articles/kerala" className="hover:text-white transition-colors">
                  Kerala
                </Link>
              </li>
              <li>
                <Link
                  to="/articles/jammu-kashmir"
                  className="hover:text-white transition-colors"
                >
                  Kashmir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} States. Crafted by Kunal Prasad.</p>
          <div className="flex gap-6">
            <span className="text-gray-600 cursor-default">Privacy</span>
            <span className="text-gray-600 cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
