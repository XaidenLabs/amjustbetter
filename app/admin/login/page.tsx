'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authenticateAdmin, initializeAdminStore } from '@/lib/admin-store'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Initialize store on mount
  useState(() => {
    initializeAdminStore()
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const admin = authenticateAdmin(email, password)
    
    if (admin) {
      localStorage.setItem('ggnf_current_admin', JSON.stringify(admin))
      router.push('/admin/dashboard')
    } else {
      setError('Invalid email or password')
    }
    
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-2xl">GG</span>
          </div>
          <h1 className="text-3xl font-bold text-white">GGNF Admin</h1>
          <p className="text-white/80 mt-2">Dashboard Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg text-sm text-foreground">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Email: superadmin@ggnf.org</p>
            <p>Password: password123</p>
            <p className="mt-2 text-xs text-muted-foreground">Or use admin@ggnf.org</p>
          </div>
        </form>
      </div>
    </main>
  )
}
