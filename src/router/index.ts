import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layout
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

// Views
import DashboardView from '@/views/DashboardView.vue'
import SessionsView from '@/views/SessionsView.vue'
import SessionDetailView from '@/views/SessionDetailView.vue'
import PerformanceView from '@/views/PerformanceView.vue'
import ErrorsView from '@/views/ErrorsView.vue'
import UsersView from '@/views/UsersView.vue'
import IntegrationView from '@/views/IntegrationView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: {
          title: 'Dashboard',
          icon: 'pi pi-home',
          description: 'Overview of analytics and key metrics',
          requiresAuth: true
        }
      },
      {
        path: '/sessions',
        name: 'Sessions',
        component: SessionsView,
        meta: {
          title: 'Sessions',
          icon: 'pi pi-users',
          description: 'User session tracking and analysis',
          requiresAuth: true
        }
      },
      {
        path: '/sessions/:id',
        name: 'SessionDetail',
        component: SessionDetailView,
        meta: {
          title: 'Session Details',
          icon: 'pi pi-eye',
          description: 'Detailed session information and replay',
          hideInNav: true,
          requiresAuth: true
        },
        props: true
      },
      {
        path: '/performance',
        name: 'Performance',
        component: PerformanceView,
        meta: {
          title: 'Performance',
          icon: 'pi pi-chart-line',
          description: 'Performance metrics and optimization insights',
          requiresAuth: true
        }
      },
      {
        path: '/errors',
        name: 'Errors',
        component: ErrorsView,
        meta: {
          title: 'Errors',
          icon: 'pi pi-exclamation-triangle',
          description: 'Error tracking and debugging tools',
          requiresAuth: true
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: UsersView,
        meta: {
          title: 'Users',
          icon: 'pi pi-user',
          description: 'User analytics and behavior insights',
          requiresAuth: true
        }
      },
      {
        path: '/integration',
        name: 'Integration',
        component: IntegrationView,
        meta: {
          title: 'SDK Integration',
          icon: 'pi pi-code',
          description: 'Integration script and API configuration',
          requiresAuth: true
        }
      }
    ]
  },
  // Authentication Routes
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
      layout: 'auth',
      requiresGuest: true
    }
  },
  {
    path: '/auth/signup',
    name: 'Signup',
    component: () => import('@/views/auth/SignupView.vue'),
    meta: {
      title: 'Sign Up',
      layout: 'auth',
      requiresGuest: true
    }
  },
  {
    path: '/auth/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: {
      title: 'Forgot Password',
      layout: 'auth',
      requiresGuest: true
    }
  },
  {
    path: '/auth/change-password',
    name: 'ChangePassword',
    component: () => import('@/views/auth/ChangePasswordView.vue'),
    meta: {
      title: 'Change Password',
      layout: 'auth',
      requiresAuth: true
    }
  },
  
  // Onboarding Route
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/views/onboarding/OnboardingView.vue'),
    meta: {
      title: 'Project Onboarding',
      requiresAuth: true,
      layout: 'minimal'
    }
  },
  
  // Project Routes
  {
    path: '/projects/:id/setup',
    name: 'ProjectSetup',
    component: () => import('@/views/onboarding/OnboardingViewSimple.vue'),
    meta: {
      title: 'Project Setup',
      requiresAuth: true
    }
  },
  {
    path: '/projects/:id/settings',
    name: 'ProjectSettings',
    component: () => import('@/views/projects/ProjectSettingsView.vue'),
    meta: {
      title: 'Project Settings',
      requiresAuth: true
    }
  },
  {
    path: '/projects/:id/team',
    name: 'TeamManagement',
    component: () => import('@/views/projects/TeamManagementView.vue'),
    meta: {
      title: 'Team Management',
      requiresAuth: true
    }
  },
  // Catch-all route for 404 pages
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  console.log('🔀 Router Guard - Navigating to:', to.path, 'from:', _from.path)
  
  // Set page title
  const title = to.meta?.title as string
  if (title) {
    document.title = `${title} - Radar-Snap`
  } else {
    document.title = 'Radar-Snap - Analytics Dashboard'
  }

  // Initialize auth store
  const authStore = useAuthStore()
  
  // Check if user is authenticated (but don't fetch user data yet to avoid loops)
  const isAuthenticated = authStore.isAuthenticated
  
  console.log('🔐 Auth State:', {
    isAuthenticated,
    hasUser: !!authStore.user,
    hasToken: !!authStore.token,
    requiresAuth: to.meta?.requiresAuth
  })
  
  // Handle routes that require authentication
  if (to.meta?.requiresAuth) {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Ensure user data is loaded for authenticated routes
    if (!authStore.user && authStore.token) {
      try {
        await authStore.fetchUser()
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        // Clear invalid token and redirect to login
        authStore.logout()
        next({
          name: 'Login',
          query: { redirect: to.fullPath }
        })
        return
      }
    }

    // Initialize projects store for authenticated users
    const { useProjectsStore } = await import('@/stores/projects')
    const projectsStore = useProjectsStore()
    
    // Only initialize if not already done
    if (!projectsStore.isInitialized) {
      console.log('🔄 Initializing projects store in router guard...')
      try {
        await projectsStore.initialize()
        console.log('📊 Projects initialization result:', {
          projectCount: projectsStore.projects.length,
          hasCurrentProject: !!projectsStore.currentProject
        })
      } catch (error) {
        console.error('Failed to initialize projects:', error)
        // Don't block navigation on project initialization failure
        // Let the components handle the error state
      }
    }
    
    // Handle project-specific routes (routes that need a current project)
    const projectSpecificRoutes = ['/dashboard', '/sessions', '/performance', '/errors', '/users', '/integration']
    const needsProject = projectSpecificRoutes.some(route => to.path.startsWith(route))
    
    if (needsProject && projectsStore.projects.length === 0 && to.path !== '/onboarding') {
      console.log('➡️ No projects found, redirecting to onboarding...')
      next('/onboarding')
      return
    }
  }
  
  // Handle routes that require guest (unauthenticated) access
  if (to.meta?.requiresGuest && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    const redirectPath = (to.query.redirect as string) || '/dashboard'
    next(redirectPath)
    return
  }
  
  // Handle root path redirect
  if (to.path === '/') {
    if (isAuthenticated) {
      next('/dashboard')
    } else {
      next('/auth/login')
    }
    return
  }
  
  // Handle legacy route redirects
  if (to.path === '/login') {
    next('/auth/login')
    return
  }
  
  if (to.path === '/signup') {
    next('/auth/signup')
    return
  }
  
  next()
})

// Global after hook for loading states
router.afterEach(() => {
  // Can be used for analytics, loading indicators, etc.
})

export default router

// Export route utilities
export const getMainRoutes = () => {
  return routes[0].children?.filter(route => !route.meta?.hideInNav) || []
}

export const findRouteByName = (name: string) => {
  const findInRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw | undefined => {
    for (const route of routes) {
      if (route.name === name) {
        return route
      }
      if (route.children) {
        const found = findInRoutes(route.children)
        if (found) return found
      }
    }
    return undefined
  }
  return findInRoutes(routes)
}