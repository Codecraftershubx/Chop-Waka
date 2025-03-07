import React, { useState } from 'react';
import { 
  CalendarIcon, UserGroupIcon, CakeIcon, BuildingOfficeIcon,
  CheckIcon, ChevronDownIcon, ChevronUpIcon, PhotoIcon,
  MusicalNoteIcon, MicrophoneIcon, UserIcon,
  PlusIcon, CurrencyDollarIcon, CameraIcon, ArrowRightIcon
} from '@heroicons/react/24/outline';

const EventBooking = () => {
  // Current date and user info - updated with the latest values
  const currentDateTime = "2025-03-07 00:11:11";
  const currentUser = "megafemworld";

  // Section expansion state
  const [expandedSections, setExpandedSections] = useState({
    contact: true, eventDetails: true, venue: true, 
    catering: true, menuPreferences: false, 
    additionalServices: false, budgetNotes: true
  });
  
  // Form data state
  const [formData, setFormData] = useState({
    name: currentUser, email: '', phone: '', eventType: '',
    customEventType: '', eventDate: '', eventStartTime: '',
    eventEndTime: '', guestCount: 50, venueType: 'on-site',
    venueAddress: '', cateringPackage: '', dietaryRestrictions: [],
    customDietaryRestrictions: '', appetizers: [], mainCourses: [],
    desserts: [], beverages: [], additionalServices: [],
    budget: '', specialRequests: '',
  });
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Data for form options
  const eventTypes = ['Corporate Meeting', 'Conference', 'Wedding Reception', 'Birthday Party', 
    'Anniversary', 'Graduation Party', 'Holiday Party', 'Retirement Party', 'Baby Shower',
    'Bridal Shower', 'Reunion', 'Fundraiser', 'Product Launch', 'Workshop', 'Other'];

  const cateringPackages = [
    { id: 'basic', name: 'Basic Package', 
      description: 'Simple buffet with appetizers, main course, and non-alcoholic drinks', 
      pricePerPerson: 25 },
    { id: 'standard', name: 'Standard Package',
      description: 'Full buffet with appetizers, salads, main courses, desserts, and standard bar', 
      pricePerPerson: 45 },
    { id: 'premium', name: 'Premium Package',
      description: 'Gourmet plated service with premium appetizers, entrees, desserts, and full open bar', 
      pricePerPerson: 75 },
    { id: 'custom', name: 'Custom Package',
      description: 'Build your own custom menu with our catering specialist', 
      pricePerPerson: null }
  ];

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free',
    'Kosher', 'Halal', 'Low Sodium', 'Diabetic-Friendly', 'Other'];

  const menuOptions = {
    appetizers: ['Bruschetta', 'Shrimp Cocktail', 'Spring Rolls', 'Caprese Skewers', 
      'Stuffed Mushrooms', 'Spinach & Artichoke Dip', 'Chicken Satay', 'Sushi Rolls'],
    mainCourses: ['Grilled Salmon', 'Filet Mignon', 'Roast Chicken', 'Pasta Primavera',
      'Vegetable Lasagna', 'Eggplant Parmesan', 'Beef Wellington', 'Risotto'],
    desserts: ['Chocolate Cake', 'Cheesecake', 'Fruit Tart', 'Ice Cream Bar',
      'Tiramisu', 'Crème Brûlée', 'Chocolate Fondue', 'Assorted Cookies'],
    beverages: ['Coffee & Tea', 'Soft Drinks', 'Fruit Juices', 'Bottled Water',
      'Wine Selection', 'Beer Selection', 'Full Bar', 'Signature Cocktails']
  };

  const additionalServiceOptions = [
    { id: 'decoration', name: 'Event Decoration', icon: <PhotoIcon className="h-5 w-5" />, price: 500 },
    { id: 'music', name: 'Live Music', icon: <MusicalNoteIcon className="h-5 w-5" />, price: 800 },
    { id: 'photography', name: 'Photography', icon: <CameraIcon className="h-5 w-5" />, price: 1200 },
    { id: 'audioVisual', name: 'Audio/Visual Equipment', icon: <MicrophoneIcon className="h-5 w-5" />, price: 350 },
    { id: 'staffing', name: 'Additional Staffing', icon: <UserGroupIcon className="h-5 w-5" />, 
      price: 30, perUnit: 'per staff/hour' }
  ];

  const budgetRanges = ['Under $1,000', '$1,000 - $3,000', '$3,000 - $5,000', 
    '$5,000 - $10,000', '$10,000 - $20,000', '$20,000+'];

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox arrays
    if (type === 'checkbox') {
      if (name.startsWith('appetizers') || name.startsWith('mainCourses') || 
          name.startsWith('desserts') || name.startsWith('beverages')) {
        const category = name.split('_')[0];
        const item = name.split('_')[1];
        setFormData(prev => ({
          ...prev,
          [category]: checked 
            ? [...prev[category], item] 
            : prev[category].filter(i => i !== item)
        }));
      }
      else if (name.startsWith('additionalServices')) {
        const service = name.split('_')[1];
        setFormData(prev => ({
          ...prev,
          additionalServices: checked 
            ? [...prev.additionalServices, service] 
            : prev.additionalServices.filter(s => s !== service)
        }));
      }
      else if (name.startsWith('dietaryRestrictions')) {
        const restriction = name.split('_')[1];
        setFormData(prev => ({
          ...prev,
          dietaryRestrictions: checked 
            ? [...prev.dietaryRestrictions, restriction] 
            : prev.dietaryRestrictions.filter(r => r !== restriction)
        }));
      }
    }
    // Handle regular inputs
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate estimated cost
  const calculateEstimatedCost = () => {
    let totalCost = 0;
    
    if (formData.cateringPackage && formData.cateringPackage !== 'custom') {
      const selectedPackage = cateringPackages.find(pkg => pkg.id === formData.cateringPackage);
      if (selectedPackage?.pricePerPerson) {
        totalCost += selectedPackage.pricePerPerson * formData.guestCount;
      }
    }
    
    formData.additionalServices.forEach(service => {
      const serviceDetails = additionalServiceOptions.find(opt => opt.id === service);
      if (serviceDetails) {
        if (serviceDetails.id === 'staffing') {
          const staffCount = Math.ceil(formData.guestCount / 25);
          const hours = 4;
          totalCost += serviceDetails.price * staffCount * hours;
        } else {
          totalCost += serviceDetails.price;
        }
      }
    });
    
    return totalCost;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Event booking submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Section header component
  const SectionHeader = ({ title, expanded, toggleFn, icon }) => (
    <div
      className="flex items-center justify-between bg-blue-50 p-4 rounded-lg cursor-pointer"
      onClick={toggleFn}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <h2 className="text-lg font-semibold text-blue-900">{title}</h2>
      </div>
      <div>
        {expanded ? <ChevronUpIcon className="h-5 w-5 text-blue-700" /> : 
                    <ChevronDownIcon className="h-5 w-5 text-blue-700" />}
      </div>
    </div>
  );

  // Success view
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-green-50 text-center">
            <div className="mx-auto rounded-full bg-green-100 p-4 w-20 h-20 flex items-center justify-center">
              <CheckIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-green-800">Booking Request Submitted!</h2>
            <p className="mt-2 text-green-700">
              Thank you for your event booking request. Our team will contact you within 24 hours.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Booking Details</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Event Type:</p>
                  <p className="font-medium">{formData.eventType === 'Other' ? formData.customEventType : formData.eventType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date:</p>
                  <p className="font-medium">{formData.eventDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time:</p>
                  <p className="font-medium">{formData.eventStartTime} - {formData.eventEndTime}</p>
                </div>
                <div>
                  <p className="text-gray-600">Guests:</p>
                  <p className="font-medium">{formData.guestCount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Venue:</p>
                  <p className="font-medium">{formData.venueType === 'on-site' ? 'Our Restaurant' : 'Off-site Location'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Package:</p>
                  <p className="font-medium">
                    {formData.cateringPackage ? 
                      cateringPackages.find(pkg => pkg.id === formData.cateringPackage).name : 'Not selected'}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                A confirmation email has been sent to: <span className="font-medium">{formData.email}</span>
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Reference #: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
              <div className="mt-6">
                <a 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Booking & Catering Services</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Let us make your next event memorable! Fill out the form below to request catering services
            or to book our venue for your special occasion.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
            <h2 className="text-2xl font-bold">Event Booking Request</h2>
            <p className="mt-2 opacity-90">Complete the form below and our event coordinator will contact you within 24 hours</p>
            <p className="mt-2 text-xs opacity-75">
              Request submitted by: {currentUser} • {currentDateTime}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <SectionHeader 
                title="Contact Information" 
                expanded={expandedSections.contact}
                toggleFn={() => toggleSection('contact')}
                icon={<UserIcon className="h-5 w-5 text-blue-700" />}
              />
              
              {expandedSections.contact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Event Details */}
            <div className="space-y-4">
              <SectionHeader 
                title="Event Details" 
                expanded={expandedSections.eventDetails}
                toggleFn={() => toggleSection('eventDetails')}
                icon={<CalendarIcon className="h-5 w-5 text-blue-700" />}
              />
              
              {expandedSections.eventDetails && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Event Type</option>
                        {eventTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    {formData.eventType === 'Other' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify Event Type</label>
                        <input
                          type="text"
                          name="customEventType"
                          value={formData.customEventType}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Please specify your event type"
                          required
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                      <input
                        type="number"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleInputChange}
                        min="10"
                        max="500"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        name="eventStartTime"
                        value={formData.eventStartTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        name="eventEndTime"
                        value={formData.eventEndTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Venue Information */}
            <div className="space-y-4">
              <SectionHeader 
                title="Venue Information" 
                expanded={expandedSections.venue}
                toggleFn={() => toggleSection('venue')}
                icon={<BuildingOfficeIcon className="h-5 w-5 text-blue-700" />}
              />
              
              {expandedSections.venue && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <label className={`cursor-pointer rounded-lg border p-4 flex items-start space-x-3 flex-1
                      ${formData.venueType === 'on-site' 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                      <input
                        type="radio"
                        name="venueType"
                        value="on-site"
                        checked={formData.venueType === 'on-site'}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 mt-1"
                      />
                      <div className="flex-1">
                        <span className="font-medium block">Our Restaurant Venue</span>
                        <span className="text-sm text-gray-600">
                          Host your event in our elegant restaurant space with full service and amenities.
                        </span>
                      </div>
                    </label>
                    
                    <label className={`cursor-pointer rounded-lg border p-4 flex items-start space-x-3 flex-1
                      ${formData.venueType === 'off-site' 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-300 hover:bg-gray-50'
                      }`}>
                      <input
                        type="radio"
                        name="venueType"
                        value="off-site"
                        checked={formData.venueType === 'off-site'}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 mt-1"
                      />
                      <div className="flex-1">
                        <span className="font-medium block">Off-site Catering</span>
                        <span className="text-sm text-gray-600">
                          We'll bring our catering services to your chosen location.
                        </span>
                      </div>
                    </label>
                  </div>
                  
                  {formData.venueType === 'off-site' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
                      <textarea
                        name="venueAddress"
                        value={formData.venueAddress}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please provide the complete address of your event venue"
                        required={formData.venueType === 'off-site'}
                      ></textarea>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Catering Options */}
            <div className="space-y-4">
              <SectionHeader 
                title="Catering Package" 
                expanded={expandedSections.catering}
                toggleFn={() => toggleSection('catering')}
                icon={<CakeIcon className="h-5 w-5 text-blue-700" />}
              />
              
              {expandedSections.catering && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {cateringPackages.map((pkg) => (
                      <label key={pkg.id} className={`cursor-pointer rounded-lg border p-4
                        ${formData.cateringPackage === pkg.id 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : 'border-gray-300 hover:bg-gray-50'
                        }`}>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="cateringPackage"
                            value={pkg.id}
                            checked={formData.cateringPackage === pkg.id}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-blue-600"
                          />
                          <div className="flex-1">
                            <span className="font-medium block">{pkg.name}</span>
                            <span className="text-sm text-gray-600 block">{pkg.description}</span>
                            {pkg.pricePerPerson ? (
                              <span className="text-blue-600 mt-1 block">
                                ${pkg.pricePerPerson} per person
                              </span>
                            ) : (
                              <span className="text-blue-600 mt-1 block">
                                Custom pricing
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {/* Dietary Restrictions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Dietary Restrictions</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                      {dietaryOptions.map(option => (
                        <label key={option} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            name={`dietaryRestrictions_${option}`}
                            checked={formData.dietaryRestrictions.includes(option)}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Budget and Special Requests */}
            <div className="space-y-4">
              <SectionHeader 
                title="Budget & Special Requests" 
                expanded={expandedSections.budgetNotes}
                toggleFn={() => toggleSection('budgetNotes')}
                icon={<CurrencyDollarIcon className="h-5 w-5 text-blue-700" />}
              />
              
              {expandedSections.budgetNotes && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Budget Range</option>
                        {budgetRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {formData.cateringPackage && formData.guestCount > 0 && formData.cateringPackage !== 'custom' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h3 className="font-medium text-blue-800 mb-2">Estimated Base Cost</h3>
                      <p className="text-blue-700">
                        ${calculateEstimatedCost().toLocaleString()} for {formData.guestCount} guests
                        {formData.additionalServices.length > 0 && ' (including selected additional services)'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        * Final price may vary based on specific requirements and customizations
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any specific requirements, questions, or additional information..."
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center py-3 px-6 rounded-md text-white font-medium 
                  ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                  transition-colors shadow-md`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                {!isSubmitting && <ArrowRightIcon className="ml-2 h-5 w-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventBooking;