import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // ✅ All pages that should NOT have a footer are listed here
  const pathsWithoutFooter = [
    // Auth Pages
    "/",
    "/login",
    "/signup",

    // Main Feature Components
    "/learning-path",
    "/quiz-generator",
    "/quiz-history",
    "/notes",
    "/todo-list",
    "/mentor",
    "/progress-tracker",
    "/ats-checker",
    "/bookmarks",
    "/summarization",
    "/image-analysis",
    "/document-analyzer",
  ];

  // This logic checks if the current URL is in the array above
  const shouldShowFooter = !pathsWithoutFooter.includes(location.pathname);

  return (
    // This div creates the main page structure
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <ScrollToTop />
      
      {/* The 'main' area grows to push the footer down */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* The footer is only rendered if the path is not in the list */}
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default Layout;