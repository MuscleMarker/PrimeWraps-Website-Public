import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Services page component.
 * Displays the services offered by the company, categorized into wedding/event and commercial services.
 */
const Services: React.FC = () => {
  // Array of wedding and event services
  const services = [
    {
      title: "Dance Floor Wraps",
      description: "Transform your dance floor with custom printed vinyl wraps featuring your names, monogram, or unique design.",
      icon: "🎵",
      features: [
        "Custom design consultation",
        "Premium vinyl materials",
        "Professional installation",
        "Non-slip finish options"
      ]
    },
    {
      title: "Wedding Portrait Prints",
      description: "Large-format portrait printing for engagement photos, family portraits, and special moments.",
      icon: "💕",
      features: [
        "High-resolution printing",
        "Multiple size options",
        "Premium paper selection",
        "Custom framing available"
      ]
    },
    {
      title: "Welcome Signs & Banners",
      description: "Elegant welcome signs and banners to greet your guests and set the tone for your event.",
      icon: "🎉",
      features: [
        "Custom typography",
        "Weather-resistant materials",
        "Stand and mounting options",
        "Quick turnaround times"
      ]
    },
    {
      title: "Mirror Decals",
      description: "Beautiful mirror decals and graphics to add personality and elegance to your venue.",
      icon: "✨",
      features: [
        "Removable vinyl options",
        "Custom designs",
        "Professional installation",
        "Long-lasting durability"
      ]
    },
    {
      title: "Wall Graphics & Murals",
      description: "Transform blank walls into stunning focal points with custom wall graphics and murals.",
      icon: "🎨",
      features: [
        "Full-wall coverage",
        "Custom artwork creation",
        "Professional installation",
        "Easy removal options"
      ]
    },
    {
      title: "Event Backdrops",
      description: "Stunning backdrops for photo booths, stages, and special event areas.",
      icon: "📸",
      features: [
        "Custom design work",
        "Multiple material options",
        "Portable and reusable",
        "Professional setup"
      ]
    }
  ];

  // Array of commercial services
  const commercialServices = [
    {
      title: "Commercial Vinyl Graphics",
      description: "Professional vinyl graphics for businesses, retail spaces, and commercial applications.",
      icon: "🏢",
      features: [
        "Window graphics and decals",
        "Wall murals and signage",
        "Floor graphics and wayfinding",
        "Trade show displays"
      ]
    },
    {
      title: "Corporate Event Decor",
      description: "Professional decor solutions for corporate events, conferences, and business functions.",
      icon: "💼",
      features: [
        "Branded signage and banners",
        "Conference room graphics",
        "Trade show materials",
        "Corporate photography backdrops"
      ]
    },
    {
      title: "Retail & Restaurant Graphics",
      description: "Eye-catching graphics to enhance your retail space or restaurant atmosphere.",
      icon: "🛍️",
      features: [
        "Store window graphics",
        "Menu boards and signage",
        "Interior wall graphics",
        "Promotional displays"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF2EB]">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-bold text-gray-800 mb-6 font-gwendolyn">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From elegant wedding decor to professional commercial graphics, we bring your vision to life 
            with premium large-format printing and expert installation.
          </p>
        </div>
      </section>

      {/* Wedding & Event Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFF2EB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold text-gray-800 mb-4 font-gwendolyn">
              Wedding & Event Decor
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create unforgettable moments with our premium event decor and printing services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-4xl font-semibold text-gray-800 mb-3 font-gwendolyn">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold text-gray-800 mb-4 font-gwendolyn">
              Commercial & Business Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional printing and graphics solutions for businesses and commercial spaces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commercialServices.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-100 to-cream-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-4xl font-semibold text-gray-800 mb-3 font-gwendolyn">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFF2EB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold text-gray-800 mb-4 font-gwendolyn">
              Our Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From concept to completion, we guide you through every step of your project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-800">1</span>
              </div>
              <h3 className="text-3xl font-semibold text-gray-800 mb-2 font-gwendolyn">Consultation</h3>
              <p className="text-gray-600 text-sm">
                We discuss your vision, requirements, and timeline to create the perfect solution.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-800">2</span>
              </div>
              <h3 className="text-3xl font-semibold text-gray-800 mb-2 font-gwendolyn">Design</h3>
              <p className="text-gray-600 text-sm">
                Our design team creates custom artwork that perfectly matches your vision.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-800">3</span>
              </div>
              <h3 className="text-3xl font-semibold text-gray-800 mb-2 font-gwendolyn">Production</h3>
              <p className="text-gray-600 text-sm">
                We print your design using premium materials and state-of-the-art equipment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-800">4</span>
              </div>
              <h3 className="text-3xl font-semibold text-gray-800 mb-2 font-gwendolyn">Installation</h3>
              <p className="text-gray-600 text-sm">
                Our expert team installs your graphics with precision and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-200 to-cream-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold text-gray-800 mb-6 font-gwendolyn">
            Ready to Bring Your Vision to Life?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your project and get a custom quote for your event decor or commercial graphics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-primary-300 hover:bg-primary-400 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get a Quote
            </Link>
            <Link 
              to="/gallery" 
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;