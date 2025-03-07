import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ContactUs = () => {
  // Current date and user information
  const currentDateTime = "2025-03-07 00:22:51";
  const currentUser = "megafemworld";
  
  // Form state
  const [formData, setFormData] = useState({
    name: currentUser,
    email: '',
    subject: '',
    message: ''
  });
  
  // Form submission state
  const [submitted, setSubmitted] = useState(false);
  
  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // In a real app, you would send this data to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            We'd love to hear from you. Please fill out the form below or use our contact information.
          </p>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Contact Information */}
            <div className="bg-blue-600 text-white p-8 md:w-1/3">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <PhoneIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+11234567890" className="text-blue-100 hover:text-white">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <EnvelopeIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:info@foodiezone.com" className="text-blue-100 hover:text-white">
                      info@foodiezone.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-blue-100">
                      123 Food Street<br />
                      Delicious City, TC 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ClockIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-blue-100">
                      Monday - Friday: 9am - 10pm<br />
                      Saturday - Sunday: 10am - 11pm
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-6 border-t border-blue-500">
                <p className="text-xs opacity-80">
                  Logged in as: {currentUser}<br />
                  {currentDateTime}
                </p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="p-8 md:w-2/3">
              {submitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-1">
                      Thank you for your message!
                    </h3>
                    <p className="text-gray-600">
                      We've received your inquiry and will respond shortly.
                    </p>
                    <button 
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: currentUser,
                          email: '',
                          subject: '',
                          message: ''
                        });
                      }}
                      className="mt-6 text-blue-600 hover:text-blue-800"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Send Us a Message
                  </h2>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Map (Optional) */}
        <div className="mt-12">
          <div className="bg-gray-300 h-80 rounded-xl overflow-hidden">
            {/* In a real project, you would embed a Google Map or other map service here */}
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-600">Interactive Map Goes Here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;