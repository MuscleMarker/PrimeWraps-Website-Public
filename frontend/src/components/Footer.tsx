import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component for the application.
 * Displays company information, navigation links, contact details, and social media links.
 */
const Footer: React.FC = () => {
  return (
    // Footer container with background color and top border
    <footer className="bg-[#FFF2EB] border-t border-primary-200">
      {/* Content wrapper with max-width and padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grid layout for footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Information Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {/* Logo */}
              <img src="/logo.svg" alt="Prime Wraps Logo" className="w-12 h-12 object-contain rounded-xl shadow-md" />
              <div>
                {/* Company Name */}
                <h3 className="text-4xl font-bold text-gray-800 font-gwendolyn">Prime Wraps</h3>
                {/* Tagline */}
                <p className="text-sm text-gray-600">Event Decor & Printing</p>
              </div>
            </div>
            {/* Company Description */}
            <p className="text-gray-600 mb-4 max-w-md">
              Specializing in elegant event decor and large-format printing for weddings, 
              parties, and commercial spaces throughout Northern California.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/primewraps.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors duration-200"
              >
                {/* Instagram Icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-3xl font-semibold text-gray-800 mb-4 font-gwendolyn">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">About</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">Services</Link></li>
              {/*<li><Link to="/gallery" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">Gallery</Link></li>*/}
              <li><Link to="/contact" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div>
            <h4 className="text-3xl font-semibold text-gray-800 mb-4 font-gwendolyn">Contact</h4>
            <div className="space-y-3">
              {/* Email Address */}
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600">primewraps.co@gmail.com</p>
              </div>
              {/* Location */}
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-600">Northern California</p>
              </div>
              {/* Instagram Handle */}
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <p className="text-gray-600">@primewraps.co</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright and Legal Links */}
        <div className="border-t border-primary-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          {/* Copyright Notice */}
          <p className="text-gray-600 text-sm">
            © 2025 Prime Wraps. All rights reserved.
          </p>
          {/* Legal Links */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-600 hover:text-primary-500 text-sm transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-primary-500 text-sm transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;