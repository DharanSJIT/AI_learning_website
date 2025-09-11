import React from "react";
import { useNavigate } from "react-router-dom";
import { Linkedin, Twitter, Github, Instagram } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

// Reusable component for footer links to keep the code clean
const FooterLink = ({ path, children }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300 text-left"
    >
      {children}
    </button>
  );
};

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-200 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        {/* ✨ FIX: Improved responsive grid for better alignment on all screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand and Socials */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white hover:scale-105 transition-transform"
            >
              <span>🚀</span>
              <span className="text-gray-800 dark:text-white">
                AI-Powered Learning
              </span>
            </button>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Enhancing education and accelerating careers with the power of
              artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/919942548955"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                {/* ✨ 2. Replace the Phone icon with the new WhatsApp icon */}
                <SiWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/DharanSJIT"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/dharansjit/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-3 items-start">
              <FooterLink path="/dashboard">Home</FooterLink>
              <FooterLink path="/services">Services</FooterLink>
              <FooterLink path="/explore">Explore</FooterLink>
              {/* <FooterLink path="/JharkhandInfo">Overviews</FooterLink> */}
            </div>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Resources
            </h3>
            <div className="flex flex-col space-y-3 items-start">
              <FooterLink>FAQ</FooterLink>
              <FooterLink>Blog</FooterLink>
              <a
                href="https://www.dharanportfolio.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500  dark:text-gray-400 dark:hover:text-white transition-colors duration-300 text-left"
              >
                Contact Us
              </a>
              <FooterLink path="/help-center">Help Center</FooterLink>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Legal
            </h3>
            <div className="flex flex-col space-y-3 items-start">
              <FooterLink path="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink path="/terms-of-service">Terms of Service</FooterLink>
            </div>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AI-Powered Learning. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
