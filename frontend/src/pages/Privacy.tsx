import React from 'react';

/**
 * Privacy Policy page component.
 * Displays the company's privacy policy.
 */
const Privacy: React.FC = () => (
  <div className="min-h-screen bg-[#FFF2EB] py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
      <h1 className="text-6xl font-bold text-gray-800 mb-6 font-gwendolyn">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">Prime Wraps is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.</p>
      
      {/* Section for information collection */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>Information you provide via our contact form (name, email, event details, message, and any other information you choose to share).</li>
        <li>Basic technical information (such as cookies for site functionality and analytics).</li>
      </ul>

      {/* Section for information usage */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>To respond to your inquiries and provide information about our services.</li>
        <li>To improve our website and user experience.</li>
        <li>We do not sell, rent, or share your personal information with third parties for marketing purposes.</li>
      </ul>

      {/* Section for cookie policy */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Cookies</h2>
      <p className="mb-4 text-gray-700">We use cookies only for basic site functionality and analytics. You can disable cookies in your browser settings, but some features of the site may not work as intended.</p>

      {/* Section for data security */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Data Security</h2>
      <p className="mb-4 text-gray-700">We take reasonable measures to protect your information from unauthorized access, disclosure, or misuse.</p>

      {/* Section for user rights */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Your Rights</h2>
      <p className="mb-4 text-gray-700">You may request to view, update, or delete your personal information by contacting us at <a href="mailto:primewraps.co@gmail.com" className="text-primary-600 underline">primewraps.co@gmail.com</a>.</p>

      {/* Section for contact information */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:primewraps.co@gmail.com" className="text-primary-600 underline">primewraps.co@gmail.com</a>.</p>
      
      <p className="mt-8 text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  </div>
);

export default Privacy;