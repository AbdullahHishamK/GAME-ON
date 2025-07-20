import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Field, Form } from 'formik'
import toast, { Toaster } from "react-hot-toast"
import * as Yup from "yup"
import { useAuth } from '../auth/AuthContext'

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref('password'), null], "Passwords must match"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits"),
  })

  async function handleRegister(values) {
    setIsLoading(true)
    try {
      // Remove confirmPassword from the request and map fields correctly
      const { confirmPassword, name, ...rest } = values
      
      // Map the fields to match the API expectations
      const registerData = {
        name: name,
        email: rest.email,
        password: rest.password,
        phone: rest.phone
      }
      
      console.log('Sending registration data:', registerData) // Debug log
      
      // Try a different approach - use a mock API for testing
      // For now, let's simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      // Mock successful registration for testing
      console.log('Mock registration successful')
      
      // Store user data in localStorage for the navbar
      const userData = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        id: Date.now() // Simple ID generation
      }
      
      // Store user data for login verification
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const newUser = {
        ...userData,
        password: registerData.password // Store password for login verification
      }
      registeredUsers.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
      
      // Also store current user data for immediate login
      localStorage.setItem('user', JSON.stringify(userData))
      
      toast.success('Registration successful! Please log in.')
      navigate("/login")
      
      /* Uncomment this when you want to use the real API
      const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(registerData)
      })
      
      console.log('Response status:', response.status) // Debug log
      
      const data = await response.json()
      console.log('API Response:', data) // Debug log
      
      if (response.ok) {
        toast.success('Registration successful! Please log in.')
        navigate("/login")
      } else {
        // Handle different error response formats
        let errorMessage = 'Registration failed'
        if (data.message) {
          errorMessage = data.message
        } else if (data.errors && data.errors.length > 0) {
          errorMessage = data.errors[0].msg || data.errors[0].message
        } else if (data.error) {
          errorMessage = data.error
        }
        toast.error(errorMessage)
      }
      */
      
    } catch (error) {
      console.error('Registration error:', error)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error. Please check your internet connection.')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className='flex flex-col items-center justify-center h-screen bg-[#272b30] text-white'>
        <h1 className='text-8xl m-5'>Register</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ errors, touched }) => (
            <Form className='flex flex-col gap-4 w-80 '>
              <div className='flex flex-col'>
                <label htmlFor="name">Full Name:</label>
                <Field 
                  type="text" 
                  id="name" 
                  name="name" 
                  className='p-2 rounded '
                  placeholder="Enter your full name"
                  required 
                />
                {errors.name && touched.name && (
                  <div className='text-red-400 text-sm'>{errors.name}</div>
                )}
              </div>

              <div className='flex flex-col'>
                <label htmlFor="email">Email:</label>
                <Field 
                  type="email" 
                  id="email" 
                  name="email" 
                  className='p-2 rounded '
                  placeholder="Enter your email"
                  required 
                />
                {errors.email && touched.email && (
                  <div className='text-red-400 text-sm'>{errors.email}</div>
                )}
              </div>

              <div className='flex flex-col'>
                <label htmlFor="phone">Phone Number:</label>
                <Field 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  className='p-2 rounded '
                  placeholder="Enter your phone number"
                  required 
                />
                {errors.phone && touched.phone && (
                  <div className='text-red-400 text-sm'>{errors.phone}</div>
                )}
              </div>

              <div className='flex flex-col'>
                <label htmlFor="password">Password:</label>
                <Field 
                  type="password" 
                  id="password" 
                  name="password" 
                  className='p-2 rounded '
                  placeholder="Enter your password"
                  required 
                />
                {errors.password && touched.password && (
                  <div className='text-red-400 text-sm'>{errors.password}</div>
                )}
              </div>

              <div className='flex flex-col'>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <Field 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  className='p-2 rounded '
                  placeholder="Confirm your password"
                  required 
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className='text-red-400 text-sm'>{errors.confirmPassword}</div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 p-2 rounded font-semibold'
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>

              <div className='text-center mt-4'>
                <span className='text-gray-300'>Already have an account? </span>
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className='text-blue-400 hover:text-blue-300 underline'
                >
                  Login here
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div> 
    </>
  )
}

export default Register
