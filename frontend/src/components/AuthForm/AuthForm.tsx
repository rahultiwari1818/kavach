'use client'

import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import "./authform.css"

type AuthMode = 'login' | 'register'

interface AuthFormProps {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${mode}`

    const payload = mode === 'register'
      ? { name, email, password }
      : { email, password }

    try {
      await axios.post(url, payload, { withCredentials: true })
      router.push('/home')
    } catch (err: unknown) {
         const error = err as AxiosError<{ message: string }>;
   
         if (error.response) {
           const { status, data } = error.response;
   
           if (status === 400) {
             toast.error(data.message);
           } else if (status === 500) {
             toast.info(data.message);
           }
         } else {
           console.error("Unexpected error:", err);
         }
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="bg-image"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {mode === 'login' ? 'Login to Kavach' : 'Register for Kavach'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
          >
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/" className="text-blue-600 hover:underline">Login here</Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
