import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const EditUser = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
      .min(10, 'Phone number must be at least 10 digits'),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = {
        ...user,
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      
      // Update in AuthContext and localStorage
      updateUser(updatedUser);
      
      // Navigate back to user profile
      navigate('/user');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl bg-gray-800 bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 z-10 bg-black bg-opacity-60 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Edit Header */}
          <div className="w-full h-32 bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-white mx-auto mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            </div>
          </div>
        </div>
        
        {/* Edit Form */}
        <div className="p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form className="space-y-6">
                {/* Name Field */}
                <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <label htmlFor="name" className="font-semibold text-blue-300">Full Name</label>
                  </div>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-400 text-sm mt-2">{errors.name}</div>
                  )}
                </div>

                {/* Email Field */}
                <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <label htmlFor="email" className="font-semibold text-blue-300">Email Address</label>
                  </div>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email address"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-400 text-sm mt-2">{errors.email}</div>
                  )}
                </div>

                {/* Phone Field */}
                <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <label htmlFor="phone" className="font-semibold text-blue-300">Phone Number</label>
                  </div>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && touched.phone && (
                    <div className="text-red-400 text-sm mt-2">{errors.phone}</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => navigate('/user')}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isValid || !dirty}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>

                {/* Help Text */}
                <div className="text-center text-gray-400 text-sm">
                  <p>All fields are required. Changes will be saved immediately.</p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
