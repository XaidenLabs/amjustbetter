'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Admin, Transaction, getTransactions, getAdmins } from '@/lib/admin-store'
import { LogOut, Users, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'donation' | 'volunteer'>('all')
  const [admins, setAdmins] = useState<Admin[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentAdmin = localStorage.getItem('ggnf_current_admin')
    if (!currentAdmin) {
      router.push('/admin/login')
      return
    }

    const adminData = JSON.parse(currentAdmin)
    setAdmin(adminData)
    setTransactions(getTransactions())
    setAdmins(getAdmins())
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('ggnf_current_admin')
    router.push('/admin/login')
  }

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter)

  const stats = {
    totalDonations: transactions
      .filter(t => t.type === 'donation')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    totalVolunteers: transactions.filter(t => t.type === 'volunteer').length,
    totalTransactions: transactions.length,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length
  }

  if (!admin) return null

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">GGNF Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'} • {admin.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalTransactions}</p>
              </div>
              <TrendingUp size={32} className="text-primary/20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Donations</p>
                <p className="text-3xl font-bold text-foreground">₦{(stats.totalDonations / 1000).toFixed(0)}K</p>
              </div>
              <TrendingUp size={32} className="text-secondary/20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Volunteers</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalVolunteers}</p>
              </div>
              <Users size={32} className="text-accent/20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending</p>
                <p className="text-3xl font-bold text-foreground">{stats.pendingTransactions}</p>
              </div>
              <Clock size={32} className="text-red-500/20" />
            </div>
          </div>
        </div>

        {/* Super Admin Only Section */}
        {admin.role === 'super_admin' && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8 border-2 border-primary/20">
            <h2 className="text-xl font-bold text-primary mb-4">Admin Management</h2>
            <div className="space-y-2">
              {admins.map(a => (
                <div key={a.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{a.email}</p>
                    <p className="text-xs text-muted-foreground uppercase">{a.role}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    a.role === 'super_admin' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary/20 text-secondary'
                  }`}>
                    {a.role === 'super_admin' ? '👑 Super Admin' : '⚙️ Admin'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Transactions</h2>
            
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'donation', 'volunteer'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                    filter === type
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Details</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(transaction => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="px-6 py-3 text-sm text-foreground font-semibold">{transaction.name}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{transaction.email}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'donation'
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-accent/20 text-accent'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">
                        {transaction.amount ? `₦${transaction.amount.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{transaction.details}</td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {transaction.status === 'completed' && (
                            <>
                              <CheckCircle size={16} className="text-green-600" />
                              <span className="text-green-600 font-semibold">Completed</span>
                            </>
                          )}
                          {transaction.status === 'pending' && (
                            <>
                              <Clock size={16} className="text-yellow-600" />
                              <span className="text-yellow-600 font-semibold">Pending</span>
                            </>
                          )}
                          {transaction.status === 'failed' && (
                            <>
                              <XCircle size={16} className="text-red-600" />
                              <span className="text-red-600 font-semibold">Failed</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No {filter !== 'all' ? filter : ''} transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
