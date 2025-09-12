import React, { useState } from 'react';
import { ShieldCheck, Eye, Lock, Users, FileText, Globe, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react';

// Collapsible section component
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200 flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );
};

// Reusable paragraph component
const Paragraph = ({ children, className = "" }) => (
  <p className={`text-gray-600 dark:text-gray-300 leading-relaxed mb-4 ${className}`}>
    {children}
  </p>
);

// List component
const BulletList = ({ items }) => (
  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4 ml-4">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

// Highlight box component
const HighlightBox = ({ title, children, variant = "info" }) => {
  const variants = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
  };

  return (
    <div className={`border rounded-lg p-4 mb-6 ${variants[variant]}`}>
      {title && (
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      )}
      <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
};

export default function ComprehensivePrivacyPolicy() {
  const lastUpdated = "September 12, 2025";
  const effectiveDate = "September 12, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
            <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          {/* <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Last Updated:</strong> {lastUpdated}</p>
            <p><strong>Effective Date:</strong> {effectiveDate}</p>
          </div> */}
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Introduction</h2>
          <Paragraph>
            Welcome to AI-Powered Learning ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and AI-powered educational services.
          </Paragraph>
          
          <HighlightBox title="Key Points" variant="info">
            <ul className="space-y-1 text-sm">
              <li>• We only collect information necessary to provide our services</li>
              <li>• Your data is encrypted and securely stored</li>
              <li>• You have full control over your personal information</li>
              <li>• We never sell your personal data to third parties</li>
            </ul>
          </HighlightBox>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          
          <CollapsibleSection title=" Information We Collect" icon={FileText}>
            <Paragraph>We collect information to provide better services to our users. The types of information we collect include:</Paragraph>
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
            <BulletList items={[
              "Name, email address, and contact information when you create an account",
              "Educational background and learning preferences",
              "Profile information you choose to provide",
              "Payment information for premium services (processed securely through third-party providers)"
            ]} />

            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Usage Information</h3>
            <BulletList items={[
              "How you interact with our AI tools and features",
              "Learning progress, quiz results, and performance analytics",
              "Time spent on different sections and learning paths",
              "Device information, IP address, and browser type"
            ]} />

            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Content You Provide</h3>
            <BulletList items={[
              "Documents, images, and text uploaded for AI analysis",
              "Questions asked to our AI tutoring system",
              "Notes, annotations, and study materials you create",
              "Feedback and communications with our support team"
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title=" How We Use Your Information" icon={Eye}>
            <Paragraph>We use the collected information for the following purposes:</Paragraph>
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Service Provision</h3>
            <BulletList items={[
              "Provide personalized AI-powered learning experiences",
              "Generate customized study plans and recommendations",
              "Process and analyze your uploaded content using AI",
              "Track learning progress and provide performance insights"
            ]} />

            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Communication</h3>
            <BulletList items={[
              "Send important updates about our services",
              "Respond to your inquiries and provide customer support",
              "Send educational content and learning tips (with your consent)",
              "Notify you about new features and improvements"
            ]} />

            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Improvement and Analytics</h3>
            <BulletList items={[
              "Analyze usage patterns to improve our AI algorithms",
              "Conduct research to enhance educational effectiveness",
              "Monitor and maintain the security of our platform",
              "Comply with legal obligations and prevent fraud"
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title=" Data Security & Protection" icon={Lock}>
            <Paragraph>We implement comprehensive security measures to protect your information:</Paragraph>
            
            <HighlightBox title="Security Measures" variant="success">
              <BulletList items={[
                "End-to-end encryption for all data transmission",
                "Secure servers with regular security audits",
                "Access controls and authentication protocols",
                "Regular backups and disaster recovery procedures",
                "Compliance with industry security standards"
              ]} />
            </HighlightBox>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Data Retention</h3>
            <Paragraph>
              We retain your personal information only as long as necessary to provide our services and fulfill legal obligations. Learning data and progress are kept to maintain continuity of your educational experience.
            </Paragraph>
          </CollapsibleSection>

          <CollapsibleSection title=" Data Sharing & Disclosure" icon={Users}>
            <Paragraph>We do not sell, trade, or rent your personal information. We may share information only in these limited circumstances:</Paragraph>
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Service Providers</h3>
            <Paragraph>
              We work with trusted third-party service providers who assist in operating our platform (hosting, payment processing, analytics). These providers are bound by strict confidentiality agreements.
            </Paragraph>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Legal Requirements</h3>
            <Paragraph>
              We may disclose information when required by law, court order, or to protect the rights, property, or safety of our users and the public.
            </Paragraph>

            <HighlightBox title="Important Note" variant="warning">
              We will never sell your personal data to advertisers or use it for marketing purposes without your explicit consent.
            </HighlightBox>
          </CollapsibleSection>

          <CollapsibleSection title=" Your Privacy Rights" icon={ShieldCheck}>
            <Paragraph>You have significant control over your personal information:</Paragraph>
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Access and Control</h3>
            <BulletList items={[
              "View and download all personal data we have about you",
              "Update or correct your account information at any time",
              "Delete specific content or your entire account",
              "Control email preferences and notification settings"
            ]} />

            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Regional Rights</h3>
            <Paragraph>
              Depending on your location, you may have additional rights under GDPR, CCPA, or other privacy regulations, including the right to portability, rectification, and erasure of your data.
            </Paragraph>
          </CollapsibleSection>

          <CollapsibleSection title=" Cookies & Tracking" icon={Globe}>
            <Paragraph>We use cookies and similar technologies to enhance your experience:</Paragraph>
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Types of Cookies</h3>
            <BulletList items={[
              "Essential cookies for basic website functionality",
              "Performance cookies to understand how you use our site",
              "Preference cookies to remember your settings",
              "Marketing cookies (only with your consent)"
            ]} />

            <Paragraph>
              You can control cookie settings through your browser preferences. Note that disabling certain cookies may limit website functionality.
            </Paragraph>
          </CollapsibleSection>

          <CollapsibleSection title=" International Data Transfers" icon={Globe}>
            <Paragraph>
              Our services are global, and your data may be transferred and processed in countries other than your own. We ensure adequate protection through:
            </Paragraph>
            
            <BulletList items={[
              "Standard Contractual Clauses approved by regulatory authorities",
              "Adequacy decisions for data transfers to certain countries",
              "Additional safeguards and security measures for international transfers"
            ]} />
          </CollapsibleSection>

          <CollapsibleSection title=" Children's Privacy" icon={Users}>
            <HighlightBox title="Age Restrictions" variant="warning">
              Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13 without parental consent.
            </HighlightBox>
            
            <Paragraph>
              If you are between 13-18 years old, please ensure you have parental permission before using our services. Parents can contact us to review, modify, or delete their child's information.
            </Paragraph>
          </CollapsibleSection>

          <CollapsibleSection title=" Updates to This Policy" icon={FileText}>
            <Paragraph>
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes through:
            </Paragraph>
            
            <BulletList items={[
              "Email notification to registered users",
              "Prominent notice on our website",
              "In-app notifications for mobile users"
            ]} />
            
            <Paragraph>
              Continued use of our services after policy updates constitutes acceptance of the revised terms.
            </Paragraph>
          </CollapsibleSection>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Mail className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
            Contact Us
          </h2>
          
          <Paragraph>
            If you have questions about this Privacy Policy or how we handle your information, please contact us:
          </Paragraph>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">General Inquiries</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:privacy@aipoweredlearning.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    dharan.mj05@gmail.com
                  </a>
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 9942548955
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Data Protection Officer</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:dpo@aipoweredlearning.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    dharan.mj05@gmail.com
                  </a>
                </p>
                <p className="text-sm mt-2">
                  For GDPR-related inquiries and data subject requests
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}