import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home page component.
 * This is the main landing page of the application.
 */
const Home: React.FC = () => {
  // Array of services offered
  const services = [
    {
      title: 'Floor Wraps',
      description: 'Transform any surface with custom vinyl floor graphics',
      image: 'Floor wrap installation',
      icon: '🎵'
    },
    {
      title: 'Welcome Signs',
      description: 'Personalized entrance displays for special events',
      image: 'Elegant welcome sign',
      icon: '🎉'
    },
    {
      title: 'Mirror Decals',
      description: 'Beautiful custom designs for mirrors and glass surfaces',
      image: 'Mirror decal design',
      icon: '✨'
    },
    {
      title: 'Wall Graphics',
      description: 'Large-scale wall murals and decorative vinyl',
      image: 'Wall graphic installation',
      icon: '🎨'
    },
    {
      title: 'Wedding Portrait Prints',
      description: 'Large-format portrait printing for engagement photos, family portraits, and special moments.',
      image: 'Wedding portrait print',
      icon: '💕'
    },
    {
      title: 'Event Backdrops',
      description: 'Stunning backdrops for photo booths, stages, and special event areas.',
      image: 'Event backdrop',
      icon: '📸'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/floral-bg.svg)',
          backgroundSize: '175% 175%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-cream-100 opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-200/20 to-cream-200/20 opacity-60"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <h1 className="text-9xl md:text-9xl text-gray-800 font-brand leading-tight mb-6">
            Prime Wraps
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Creating unforgettable moments through elegant event decor and premium large-format printing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-primary-300 hover:bg-primary-400 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Request a Quote
            </Link>
            <Link 
              to="/gallery" 
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-cream-200 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary-300 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-20 animate-bounce">
          <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <span className="mt-2 text-primary-500 font-medium">Scroll down to see more</span>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF2EB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-8xl font-bold text-gray-800 mb-6 font-gwendolyn">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From elegant wedding decor to professional commercial graphics, we bring your vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-100 to-cream-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-4xl font-semibold text-gray-800 mb-4 font-gwendolyn">{service.title}</h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <Link to="/services" className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF2EB]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-7xl font-bold text-gray-800 mb-6 font-gwendolyn">
                About Prime Wraps
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We are a premier wedding and event decor business specializing in the art of large-format 
                printing and installation. Based in Northern California, we serve couples and event planners 
                throughout the region.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our passion is transforming ordinary spaces into extraordinary venues that capture the magic 
                of your special moments. From dance floor wraps to elegant welcome signs, we bring your 
                vision to life with premium materials and expert craftsmanship.
              </p>
              <Link 
                to="/about" 
                className="bg-primary-300 hover:bg-primary-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-200 to-cream-200 rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square bg-white rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-40 h-40 bg-gradient-to-br from-primary-300 to-cream-300 rounded-full flex items-center justify-center mx-auto mb-6">
                      <img src="/logo.svg" alt="Prime Wraps Logo" className="w-36 h-36 object-contain" />
                    </div>
                    <h3 className="text-6xl font-bold text-gray-800 font-gwendolyn mb-2">Prime Wraps</h3>
                    <p className="text-gray-600 text-lg">Event Decor & Printing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-200 to-cream-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-7xl font-bold text-gray-800 mb-6 font-gwendolyn">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss your event decor and printing needs. We're here to bring your vision to life 
            with premium materials and expert craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-primary-300 hover:bg-primary-400 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Get Started Today
            </Link>
            <Link 
              to="/gallery" 
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              View Our Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;