import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import oyoLogo from '../../assets/images/oyo-logo.png'
import { LoginMutation } from '@/services/mutation'
import toast from 'react-hot-toast'
import Auth from '@/services/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const useLogin = LoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('')
    try {
       useLogin.mutate({email, password}, 
        {
          onSuccess: (data) => {
            console.log(data)
            Auth.setRefreshToken(data.refreshToken)
            Auth.setToken(data.token)

            navigate('/')
            toast.success("Login Successful");
          },
          onError: (error: any) => {
            const detail = error?.response?.data?.detail || error?.message || 'Login failed';
            toast.error(detail);
            setError(detail);
          },
        }
      )
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally {
      setTimeout(() => {
        setError('')
      }, 3000)
    }
  }

  return (
    <div style={{ backgroundImage: `url(${oyoLogo})` }} className="bg-cover bg-center bg-no-repeat flex min-h-screen items-center justify-center bg-[#700002] dark:bg-gray-900">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow rounded-md p-8 w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src={oyoLogo}
            alt="Oyo State Logo"
            className="h-20 w-20 mb-2"
            style={{ objectFit: 'contain' }}
          />
          <h2 className="text-2xl font-bold text-center">Oyo State Vehicle Inspection Service</h2>
          <span className="text-lg font-semibold text-[#700002] mt-2">Sign In</span>
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#700002] bg-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#700002] bg-white pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye-off SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M6.343 6.343A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.234-.336 4.675-.938M17.657 17.657A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.234.336-4.675.938M3 3l18 18" />
                </svg>
              ) : (
                // Eye SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[#700002] hover:bg-[#700002] text-white font-semibold py-2 rounded transition"
          disabled={useLogin.isPending}
        >
          {useLogin.isPending ? 'Signing in...' : 'Sign In'}
        </button>
        {/* <div className="flex justify-between mt-4 text-sm">
          <a href="/forgot-password" className="text-[#700002]600 hover:underline">Forgot password?</a>
          <a href="/register" className="text-[#700002]600 hover:underline">Create account</a>
        </div> */}
      </form>
    </div>
  )
}
