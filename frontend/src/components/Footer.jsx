import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✨ Import Link for navigation
import { Linkedin, Github, Instagram, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

// Mock WhatsApp icon component (as provided)
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
  </svg>
);

// ✨ Reusable component for internal footer links using React Router's <Link>
const FooterLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm text-left"
  >
    {children}
  </Link>
);

// Reusable component for external links (unchanged)
const ExternalFooterLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm group inline-flex items-center"
  >
    {children}
    <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
  </a>
);

// Social media icon component with custom tooltip (unchanged)
const SocialIcon = ({ href, icon: Icon, hoverTitle, hoverColor }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={hoverTitle}
        className={`w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group ${hoverColor} shadow-md hover:shadow-lg`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
      </a>
      
      {showTooltip && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
          {hoverTitle}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default function ProfessionalFooter() {
  return (
    <footer className="bg-gray-200 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        
        {/* === Top Section: Brand & Socials === */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-300 pb-8">
          {/* Brand Info */}
          <div className="flex-shrink-0 text-center md:text-left">
            {/* ✨ Changed button to a Link */}
            <Link 
              to="/"
              className="flex items-center justify-center md:justify-start gap-3 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-xl">🚀</span>
              </div>
              <span>AI-Powered Learning</span>
            </Link>
            <p className="text-gray-600 text-sm mt-3 max-w-sm">
              Revolutionizing education through artificial intelligence and innovative learning solutions.
            </p>
          </div>
          
          {/* Follow Us Section */}
          <div className="text-center md:text-right">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Follow Us
            </h3>
            <div className="flex items-center justify-center md:justify-end space-x-4">
              <SocialIcon 
                href="https://wa.me/919942548955" 
                icon={WhatsAppIcon} 
                hoverTitle="Chat on WhatsApp" 
                hoverColor="hover:bg-green-500" 
              />
              <SocialIcon 
                href="https://instagram.com" 
                icon={Instagram} 
                hoverTitle="Follow on Instagram" 
                hoverColor="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500" 
              />
              <SocialIcon 
                href="https://github.com/DharanSJIT" 
                icon={Github} 
                hoverTitle="View on GitHub" 
                hoverColor="hover:bg-gray-800" 
              />
              <SocialIcon 
                href="https://www.linkedin.com/in/dharansjit/" 
                icon={Linkedin} 
                hoverTitle="Connect on LinkedIn" 
                hoverColor="hover:bg-blue-700" 
              />
            </div>
          </div>
        </div>

        {/* === Middle Section: Links Grid === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* ✨ All FooterLink components now use the 'to' prop for navigation */}
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-3 flex flex-col items-start">
              <FooterLink to="/dashboard">Home</FooterLink>
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/explore">Explore</FooterLink>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
            <div className="space-y-3 flex flex-col items-start">
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/help-center">Help Center</FooterLink>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
            <div className="space-y-3 flex flex-col items-start">
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-3 flex flex-col items-start">
              <ExternalFooterLink href="mailto: dharan.mj05@gmail.com">
                <Mail className="w-4 h-4 mr-2 text-blue-600" /> Email
              </ExternalFooterLink>
              <ExternalFooterLink href="tel:+919942548955">
                <Phone className="w-4 h-4 mr-2 text-blue-600" /> Call Us
              </ExternalFooterLink>
              <ExternalFooterLink href="https://www.dharanportfolio.xyz/">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" /> Portfolio
              </ExternalFooterLink>
            </div>
          </div>
        </div>

        {/* === Bottom Section: Copyright === */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AI-Powered Learning. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>in Chennai, India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}