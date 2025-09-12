import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

// You can easily update your questions and answers here
const faqData = [
  {
    question: "What is AI-Powered Learning?",
    answer: "It's an educational platform that uses artificial intelligence to create personalized learning experiences, such as generating quizzes, summarizing documents, and providing instant help to enhance your study efficiency."
  },
  {
    question: "How do I create an account?",
    answer: "You can create an account by clicking the 'Sign Up' button on the homepage. You can register using your email address or by connecting with a Google account for quick access."
  },
  {
    question: "Are the learning tools free to use?",
    answer: "Our platform offers a free tier with access to many core features. We also have premium plans that unlock advanced capabilities, higher usage limits, and more powerful tools for serious learners."
  },
  {
    question: "How is my personal data protected?",
    answer: "We prioritize your privacy and security. All user data is encrypted and handled in accordance with our Privacy Policy. We never share your personal information with third parties."
  },
  {
    question: "Who can I contact for support?",
    answer: "If you have any issues or questions that are not answered here, please visit our 'Help Center' or use the 'Contact Us' link in the footer to get in touch with our support team."
  }
];

export default function FaqPage() {
  // This state keeps track of which question is currently open
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    // If the clicked question is already open, close it. Otherwise, open it.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Find answers to the most common questions about our platform and services.
          </p>
        </div>

        {/* Accordion Section */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex justify-between items-center text-left p-6 focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-500 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}