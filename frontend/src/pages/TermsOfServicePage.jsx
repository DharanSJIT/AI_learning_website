import React from 'react';
import { FileText, Mail } from 'lucide-react';

// Reusable component for section headings
const SectionHeader = ({ title }) => (
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
    {title}
  </h2>
);

// Reusable component for paragraphs
const Paragraph = ({ children }) => (
  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
    {children}
  </p>
);

export default function MinimalisticTermsOfService() {
  const effectiveDate = "September 12, 2025";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-8 mb-12">
          {/* <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" /> */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Effective Date: {effectiveDate}
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <Paragraph>
            Welcome to AI-Powered Learning. By using our service, you agree to these terms. Please read them carefully.
          </Paragraph>

          <SectionHeader title="1. Account Registration" />
          <Paragraph>
            You must provide accurate information when creating an account. You're responsible for keeping your account secure and for all activities under your account.
          </Paragraph>

          <SectionHeader title="2. Acceptable Use" />
          <Paragraph>
            Use our service for educational purposes only. Don't upload illegal content, spam, or violate others' rights. Our AI tools are meant to assist learning, not replace your own work.
          </Paragraph>

          <SectionHeader title="3. Your Content" />
          <Paragraph>
            You own the content you upload. By using our service, you give us permission to process your content through our AI systems to provide our educational features.
          </Paragraph>

          <SectionHeader title="4. Subscription & Payment" />
          <Paragraph>
            Subscription fees are billed in advance. You can cancel anytime, but we don't provide refunds for unused portions. We may change pricing with 30 days notice.
          </Paragraph>

          <SectionHeader title="5. Service Availability" />
          <Paragraph>
            We provide the service "as is" and can't guarantee it will always be available. AI-generated content may contain errors, so always verify important information.
          </Paragraph>

          <SectionHeader title="6. Privacy" />
          <Paragraph>
            We protect your privacy as described in our Privacy Policy, which is part of these terms.
          </Paragraph>

          <SectionHeader title="7. Termination" />
          <Paragraph>
            Either of us can end this agreement anytime. We may suspend your account if you violate these terms. Upon termination, you lose access to your account.
          </Paragraph>

          <SectionHeader title="8. Changes to Terms" />
          <Paragraph>
            We may update these terms occasionally. We'll notify you of significant changes. Continued use means you accept the updated terms.
          </Paragraph>

          <SectionHeader title="9. Limitation of Liability" />
          <Paragraph>
            We're not liable for any indirect damages or losses. Our total liability is limited to the amount you paid us in the past 12 months.
          </Paragraph>

          {/* Contact Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-500" />
              Questions?
            </h2>
            <Paragraph className="mb-0">
              Contact us at{' '}
              <a href="mailto:support@aipoweredlearning.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                dharan.mj05@gmail.com
              </a>
            </Paragraph>
          </div>

         
        </div>
      </div>
    </div>
  );
}