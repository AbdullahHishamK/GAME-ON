import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Field, Form } from 'formik'
import toast, { Toaster } from "react-hot-toast"
import * as Yup from "yup"
import { useAuth } from '../auth/AuthContext'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const initialValues = {
    email: "",
    password: "",
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  })

  async function handleLogin(values) {
    setIsLoading(true)
    try {
      console.log('Login attempt with:', values) // Debug log
      
      // Check if user exists in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const user = registeredUsers.find(u => u.email === values.email)
      
      if (!user) {
        toast.error('Account not found. Please register first.')
        setIsLoading(false)
        return
      }
      
      // Check if password matches (in a real app, this would be hashed)
      if (user.password !== values.password) {
        toast.error('Invalid password. Please try again.')
        setIsLoading(false)
        return
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create user object for login
      const loginUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'user'
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      console.log('Login successful')
      toast.success('Login successful!')
      login(loginUser, mockToken)
      navigate("/home")
      
      /* Uncomment this when you want to use the real API
      const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(values)
      })
      
      console.log('Response status:', response.status) // Debug log
      
      const data = await response.json()
      console.log('API Response:', data) // Debug log
      
      if (response.ok) {
        toast.success('Login successful!')
        login(data.user, data.token)
        navigate("/home")
      } else {
        let errorMessage = 'Login failed'
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
      console.error('Login error:', error)
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
        <h1 className='text-8xl m-5'>Login</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form className='flex flex-col gap-4 w-80'>
              <div className='flex flex-col'>
                <label htmlFor="email">Email:</label>
                <Field 
                  type="email" 
                  id="email" 
                  name="email" 
                  className='p-2 rounded text-black'
                  required 
                />
                {errors.email && touched.email && (
                  <div className='text-red-400 text-sm'>{errors.email}</div>
                )}
              </div>
              <div className='flex flex-col'>
                <label htmlFor="password">Password:</label>
                <Field 
                  type="password" 
                  id="password" 
                  name="password" 
                  className='p-2 rounded text-black'
                  required 
                />
                {errors.password && touched.password && (
                  <div className='text-red-400 text-sm'>{errors.password}</div>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 p-2 rounded font-semibold'
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div className='text-center mt-4'>
                <span className='text-gray-300'>Don't have an account? </span>
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  className='text-blue-400 hover:text-blue-300 underline'
                >
                  Register here
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div> 
    </>
  )
}

export default Login
