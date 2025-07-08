import React from 'react';

/**
 * Terms of Service page component.
 * Displays the terms and conditions for using the website.
 */
const Terms: React.FC = () => (
  <div className="min-h-screen bg-[#FFF2EB] py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
      <h1 className="text-6xl font-bold text-gray-800 mb-6 font-gwendolyn">Terms of Service</h1>
      <p className="mb-4 text-gray-700">Welcome to Prime Wraps! By using our website, you agree to the following terms and conditions. Please read them carefully.</p>
      
      {/* Section for website usage */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">1. Use of Website</h2>
      <p className="mb-4 text-gray-700">This website is for informational purposes only. You may browse, view content, and contact us for services. You may not use this site for unlawful purposes.</p>
      
      {/* Section for intellectual property */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">2. Intellectual Property</h2>
      <p className="mb-4 text-gray-700">All content, images, and designs on this site are the property of Prime Wraps or its licensors. You may not copy, reproduce, or use our content without written permission.</p>
      
      {/* Section for user responsibilities */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">3. User Responsibilities</h2>
      <p className="mb-4 text-gray-700">You agree to provide accurate information when using our contact form and to use the site in a respectful and lawful manner.</p>
      
      {/* Section for limitation of liability */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">4. Limitation of Liability</h2>
      <p className="mb-4 text-gray-700">Prime Wraps is not liable for any damages resulting from your use of this website. The site is provided "as is" without warranties of any kind.</p>
      
      {/* Section for changes to terms */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">5. Changes to Terms</h2>
      <p className="mb-4 text-gray-700">We may update these terms from time to time. Continued use of the site means you accept any changes.</p>
      
      {/* Section for contact information */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">6. Contact Us</h2>
      <p className="text-gray-700">If you have any questions about these Terms of Service, please contact us at <a href="mailto:primewraps.co@gmail.com" className="text-primary-600 underline">primewraps.co@gmail.com</a>.</p>
      
      <p className="mt-8 text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  </div>
);

export default Terms;