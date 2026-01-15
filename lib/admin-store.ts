// Admin authentication and transaction storage using localStorage
export interface Transaction {
  id: string
  type: 'donation' | 'volunteer'
  name: string
  email: string
  amount?: number
  date: string
  status: 'pending' | 'completed' | 'failed'
  details: string
}

export interface Admin {
  id: string
  email: string
  role: 'super_admin' | 'admin'
}

const ADMINS_KEY = 'ggnf_admins'
const TRANSACTIONS_KEY = 'ggnf_transactions'

// Initialize default super admin
export function initializeAdminStore() {
  const existing = localStorage.getItem(ADMINS_KEY)
  if (!existing) {
    const defaultAdmin: Admin[] = [
      { id: '1', email: 'superadmin@ggnf.org', role: 'super_admin' },
      { id: '2', email: 'admin@ggnf.org', role: 'admin' }
    ]
    localStorage.setItem(ADMINS_KEY, JSON.stringify(defaultAdmin))
  }

  const existingTransactions = localStorage.getItem(TRANSACTIONS_KEY)
  if (!existingTransactions) {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'donation',
        name: 'John Doe',
        email: 'john@example.com',
        amount: 5000,
        date: new Date().toISOString(),
        status: 'completed',
        details: 'One-time donation for education'
      },
      {
        id: '2',
        type: 'volunteer',
        name: 'Jane Smith',
        email: 'jane@example.com',
        date: new Date().toISOString(),
        status: 'completed',
        details: 'Healthcare volunteer - 10 hours/week'
      }
    ]
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mockTransactions))
  }
}

export function getAdmins(): Admin[] {
  const data = localStorage.getItem(ADMINS_KEY)
  return data ? JSON.parse(data) : []
}

export function getTransactions(): Transaction[] {
  const data = localStorage.getItem(TRANSACTIONS_KEY)
  return data ? JSON.parse(data) : []
}

export function addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
  const transactions = getTransactions()
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString()
  }
  transactions.push(newTransaction)
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  return newTransaction
}

export function authenticateAdmin(email: string, password: string): Admin | null {
  // Simple authentication - in production, use proper auth
  const admins = getAdmins()
  const admin = admins.find(a => a.email === email)
  
  // For demo: password is "password123"
  if (admin && password === 'password123') {
    return admin
  }
  return null
}
