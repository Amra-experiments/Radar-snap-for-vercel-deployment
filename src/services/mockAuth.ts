// Mock authentication service for development
// This simulates the backend API responses for testing the frontend

export interface MockUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

export interface MockProject {
  id: string
  name: string
  website_url: string
  api_key: string
  created_at: string
  updated_at: string
  role: 'owner' | 'admin' | 'developer' | 'viewer'
  status: 'active' | 'inactive' | 'setup_pending'
  member_count?: number
}

// Mock users for testing
const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@radar-snap.com',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2', 
    name: 'John Smith',
    email: 'john@example.com',
    role: 'user',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Sarah Johnson', 
    email: 'sarah@company.com',
    role: 'admin',
    created_at: '2024-02-01T00:00:00Z'
  }
]

// Mock projects
const mockProjects: MockProject[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Website',
    website_url: 'https://shop.example.com',
    api_key: 'rs_test_1234567890abcdef',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    role: 'owner',
    status: 'active',
    member_count: 3
  },
  {
    id: 'proj-2',
    name: 'Mobile App Analytics',
    website_url: 'https://app.example.com', 
    api_key: 'rs_test_fedcba0987654321',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
    role: 'admin',
    status: 'active',
    member_count: 2
  },
  {
    id: 'proj-3',
    name: 'Blog Analytics',
    website_url: 'https://blog.example.com',
    api_key: 'rs_test_abcd1234efgh5678',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z', 
    role: 'developer',
    status: 'setup_pending',
    member_count: 1
  }
]

// Mock authentication credentials
export const MOCK_CREDENTIALS = [
  {
    email: 'demo@radar-snap.com',
    password: 'demo123',
    user: mockUsers[0],
    description: 'Demo admin user with full access'
  },
  {
    email: 'john@example.com', 
    password: 'password123',
    user: mockUsers[1],
    description: 'Regular user account'
  },
  {
    email: 'sarah@company.com',
    password: 'admin2024',
    user: mockUsers[2], 
    description: 'Admin user with project management access'
  }
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock login function
export async function mockLogin(email: string, password: string) {
  await delay(800) // Simulate network delay
  
  const credential = MOCK_CREDENTIALS.find(
    cred => cred.email === email && cred.password === password
  )
  
  if (!credential) {
    throw new Error('Invalid email or password')
  }
  
  const token = `mock_jwt_token_${credential.user.id}_${Date.now()}`
  
  return {
    token,
    user: credential.user
  }
}

// Mock register function  
export async function mockRegister(name: string, email: string, _password: string) {
  await delay(1000)
  
  // Check if email already exists
  if (MOCK_CREDENTIALS.some(cred => cred.email === email)) {
    throw new Error('Email already registered')
  }
  
  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: 'user',
    created_at: new Date().toISOString()
  }
  
  const token = `mock_jwt_token_${newUser.id}_${Date.now()}`
  
  return {
    token,
    user: newUser
  }
}

// Mock projects fetch
export async function mockFetchProjects(_userId: string) {
  await delay(500)
  
  // Return projects based on user
  return mockProjects.filter(_project => {
    // All demo users can see all projects for testing
    return true
  })
}

// Mock project creation
export async function mockCreateProject(name: string, websiteUrl: string, _userId: string) {
  await delay(800)
  
  const newProject: MockProject = {
    id: `proj-${Date.now()}`,
    name,
    website_url: websiteUrl,
    api_key: `rs_test_${Math.random().toString(36).substring(2, 18)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    role: 'owner',
    status: 'setup_pending',
    member_count: 1
  }
  
  return newProject
}