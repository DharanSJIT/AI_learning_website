import React, { useState } from 'react';
import { Search, BookOpen, User, Settings, Shield, ChevronDown, Mail } from 'lucide-react';

// Data for the FAQ section - easy to update
const faqs = [
  {
    question: "How do I get started with the AI learning tools?",
    answer: "Getting started is easy! Simply sign up for an account, navigate to the dashboard, and select any tool like the Quiz Generator or Document Analyzer to begin. Each tool has on-screen instructions to guide you."
  },
  {
    question: "Can I track my learning progress?",
    answer: "Absolutely. The 'Progress Tracker' feature provides detailed analytics and visualizations of your quiz scores, completed modules, and study time to help you monitor your improvement."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security very seriously. All your personal information and uploaded documents are encrypted and stored securely. You can learn more in our Privacy Policy."
  },
  {
    question: "What should I do if a feature is not working as expected?",
    answer: "If you encounter any issues, first try refreshing the page. If the problem persists, please reach out to our support team via the 'Contact Us' link, and we'll be happy to assist you."
  }
];

// Reusable component for the FAQ accordion item
const FaqItem = ({ faq, index, openFaq, setOpenFaq }) => {
  const isOpen = index === openFaq;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        onClick={() => setOpenFaq(isOpen ? null : index)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-gray-100"
      >
        <span>{faq.question}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
      >
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};


export default function HelpCenter() {
  // State to manage which FAQ item is currently open
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Help Center
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            We're here to help. Find answers to your questions or contact us for more information.
          </p>
          {/* <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div> */}
        </div>

        {/* Categories Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <BookOpen className="w-10 h-10 text-blue-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Getting Started</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Learn the basics of our platform and start your journey.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <User className="w-10 h-10 text-blue-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Account Management</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Manage your profile, settings, and subscription.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <Shield className="w-10 h-10 text-blue-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Privacy & Security</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Understand how we protect your data and privacy.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FaqItem 
                key={index}
                faq={faq}
                index={index}
                openFaq={openFaq}
                setOpenFaq={setOpenFaq}
              />
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Still need help?
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Can't find the answer you're looking for? Don't worry, we're here to help.
          </p>
          <a
            href="https://www.dharanportfolio.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Us
          </a>
        </div>
        
      </div>
    </div>
  );
}