import React from 'react';

/**
 * About page component.
 * Displays information about the company, its story, values, and services.
 */
const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF2EB]">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <img src="/logo.svg" alt="Prime Wraps Logo" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-7xl md:text-8xl font-bold text-gray-800 mb-6 font-gwendolyn">
              About Prime Wraps
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Creating unforgettable moments through elegant event decor and premium large-format printing
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFF2EB]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Our Story */}
            <div className="space-y-6">
              <h2 className="text-6xl font-bold text-gray-800 font-gwendolyn">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Prime Wraps is a premier wedding and event decor business specializing in the art of 
                  large-format printing and installation. We are passionate about transforming ordinary 
                  spaces into extraordinary venues that capture the magic of your special moments.
                </p>
                <p>
                  Based in Northern California, we serve couples and event planners throughout the region, 
                  bringing their vision to life through our expertise in dance floor wraps, custom portrait 
                  printing, elegant welcome signs, and stunning mirror decals.
                </p>
                <p>
                  While our primary focus is creating breathtaking wedding and event decor, our capabilities 
                  extend far beyond. We offer comprehensive printing solutions for commercial spaces, 
                  corporate events, and special occasions, always maintaining the same level of quality 
                  and attention to detail that has made us a trusted name in the industry.
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-200 to-cream-200 rounded-2xl p-8 shadow-xl">
                <div className="aspect-square bg-white rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-300 to-cream-300 rounded-full flex items-center justify-center mx-auto mb-6">
                      <img src="/logo.svg" alt="Prime Wraps Logo" className="w-28 h-28 object-contain" />
                    </div>
                    <h3 className="text-5xl font-bold text-gray-800 font-gwendolyn mb-2">Prime Wraps</h3>
                    <p className="text-gray-600">Event Decor & Printing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold text-gray-800 mb-4 font-gwendolyn">
              What Sets Us Apart
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence and attention to detail ensures every project exceeds expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Creative Excellence */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary-100 to-cream-100">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-4xl font-semibold text-gray-800 mb-2 font-gwendolyn">Creative Excellence</h3>
              <p className="text-gray-600">
                Every design is crafted with passion and precision, ensuring your event decor reflects your unique vision.
              </p>
            </div>

            {/* Timely Delivery */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary-100 to-cream-100">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-semibold text-gray-800 mb-2 font-gwendolyn">Timely Delivery</h3>
              <p className="text-gray-600">
                We understand the importance of deadlines and ensure your decor is ready when you need it.
              </p>
            </div>

            {/* Quality Materials */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary-100 to-cream-100">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-semibold text-gray-800 mb-2 font-gwendolyn">Quality Materials</h3>
              <p className="text-gray-600">
                We use only the finest materials and printing technology to ensure lasting beauty and durability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFF2EB]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold text-gray-800 mb-8 font-gwendolyn">
            Serving Northern California
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Our Expertise */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-100 to-cream-100">
              <h3 className="text-4xl font-semibold text-gray-800 mb-4 font-gwendolyn">Our Expertise</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• Dance Floor Wraps</li>
                <li>• Wedding Portrait Printing</li>
                <li>• Welcome Signs & Banners</li>
                <li>• Mirror Decals & Graphics</li>
                <li>• Wall Graphics & Murals</li>
                <li>• Event Backdrops</li>
              </ul>
            </div>
            {/* Our Promise */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-100 to-cream-100">
              <h3 className="text-4xl font-semibold text-gray-800 mb-4 font-gwendolyn">Our Promise</h3>
              <p className="text-gray-600 text-left">
                We are committed to bringing your vision to life with the highest quality materials, 
                expert installation, and exceptional customer service. Every project is treated with 
                the care and attention it deserves, ensuring your special day is as beautiful as you imagined.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;