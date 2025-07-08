import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import axios from 'axios';

/**
 * Contact page component.
 * Displays a contact form and contact information.
 */
const Contact: React.FC = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    endDate: '',
    message: '',
    services: [] as string[]
  });

  // State for the "Other" service text field
  const [otherText, setOtherText] = useState('');
  // State for loading and form submission messages
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Array of available services
  const serviceOptions = [
    'Dance Floor Wraps',
    'Wedding Portrait Prints',
    'Mirror Decals',
    'Welcome Signs',
    'Wall Graphics & Murals',
    'Event Backdrops',
    'Corporate Event Decor',
    'Retail & Restaurant Graphics',
    'Other',
  ];

  /**
   * Handles changes to the selected services.
   * @param service - The service to add or remove from the selection.
   */
  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service) // Remove service if already selected
        : [...prev.services, service] // Add service if not selected
    }));
  };

  /**
   * Handles the contact form submission.
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Prepare the payload for the API request
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.services.join(', ') + (formData.services.includes('Other') ? `: ${otherText}` : ''),
        message: `Event Start Date: ${formData.eventDate}\nEvent End Date: ${formData.endDate || 'N/A'}\n\n${formData.message}`
      };

      // Send the contact form data to the backend
      const response = await axios.post('/api/contact/submit', payload);
      
      if (response.data.success) {
        // Set success message and reset the form
        setSuccessMessage(response.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          endDate: '',
          message: '',
          services: []
        });
        setOtherText('');
      } else {
        // Set error message if submission fails
        setErrorMessage(response.data.message || 'Failed to send message. Please try again.');
      }
    } catch (error: unknown) {
      // Handle different types of errors
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 429) {
          setErrorMessage('Too many requests. Please try again later.');
        } else {
          setErrorMessage(error.response.data.message || 'An unexpected error occurred. Please try again.');
        }
      } else if (error instanceof Error) {
        setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF2EB]">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-bold text-gray-800 mb-6 font-gwendolyn">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to bring your vision to life? Let's discuss your event decor and printing needs.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFF2EB]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-5xl font-bold text-gray-800 mb-6 font-gwendolyn">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" id="name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-colors" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" id="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-colors" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" id="phone" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-colors" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">Event Start Date *</label>
                    <input type="date" id="eventDate" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-colors" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Event End Date</label>
                    <input type="date" id="endDate" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-colors" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Services Needed (Select all that apply)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceOptions.map((service) => (
                      <label key={service} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" checked={formData.services.includes(service)} onChange={() => handleServiceChange(service)} className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-200" />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.services.includes('Other') && (
                  <div className="mt-3">
                    <label htmlFor="otherText" className="block text-sm font-medium text-gray-700 mb-2">Please describe your request:</label>
                    <textarea id="otherText" rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-colors resize-none" placeholder="Describe your custom request..." value={otherText} onChange={e => setOtherText(e.target.value)} />
                  </div>
                )}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Tell us more about your event... *</label>
                  <textarea id="message" required rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-colors resize-none" placeholder="Tell us more about your event, venue, theme, and any specific requirements..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                </div>
                {successMessage && <div className="p-3 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}
                {errorMessage && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{errorMessage}</div>}
                <button type="submit" className="w-full bg-primary-300 hover:bg-primary-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold text-gray-800 mb-6 font-gwendolyn">Get in Touch</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">Ready to create something beautiful for your special day? We'd love to hear from you and discuss how we can bring your vision to life with our premium event decor and printing services.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800 mb-1 font-gwendolyn">Email</h3>
                    <p className="text-gray-600">primewraps.co@gmail.com</p>
                    <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800 mb-1 font-gwendolyn">Location</h3>
                    <p className="text-gray-600">Northern California</p>
                    <p className="text-sm text-gray-500">Serving the entire Northern California region</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold text-gray-800 mb-1 font-gwendolyn">Instagram</h3>
                    <a href="https://instagram.com/primewraps.co" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-500 transition-colors">@primewraps.co</a>
                    <p className="text-sm text-gray-500">Follow us for inspiration and updates</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary-100 to-cream-100 rounded-2xl p-6">
                <h3 className="text-3xl font-semibold text-gray-800 mb-3 font-gwendolyn">Why Choose Prime Wraps?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><svg className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Premium materials and expert craftsmanship</li>
                  <li className="flex items-center"><svg className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Custom design consultation</li>
                  <li className="flex items-center"><svg className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Professional installation service</li>
                  <li className="flex items-center"><svg className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Timely delivery guaranteed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;