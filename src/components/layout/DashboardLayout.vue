<template>
    <div class="dashboard-layout flex h-screen bg-gray-50">
        <!-- Sidebar -->
        <div class="sidebar flex-shrink-0 w-64 bg-white shadow-lg">
            <!-- Logo -->
            <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center">
                    <div
                        class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <i class="pi pi-chart-bar text-white"></i>
                    </div>
                    <h1 class="text-xl font-bold text-gradient">Radar-Snap</h1>
                </div>
            </div>

            <!-- Project Switcher -->
            <div class="px-4 py-4 border-b border-gray-200">
                <ProjectSwitcher @project-change="handleProjectChange" @create-project="handleCreateProject" />
            </div>

            <!-- Navigation Menu -->
            <nav class="flex-1 px-4 py-6 space-y-2">
                <router-link v-for="route in navigationRoutes" :key="route.name" :to="route.path" class="nav-item"
                    :class="{ 'nav-item-active': isActiveRoute(route.path) }">
                    <i :class="route.meta?.icon" class="text-lg mr-3"></i>
                    <span>{{ route.meta?.title }}</span>
                </router-link>
            </nav>

            <!-- User Profile -->
            <div class="px-4 py-4 border-t border-gray-200">
                <div class="flex items-center">
                    <div
                        class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                        <span class="text-white text-sm font-semibold">{{ getUserInitials() }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ (user?.first_name || '') + ' ' +
                            (user?.last_name || 'User') }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ user?.email || '' }}</p>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600" @click="router.push('/settings')"
                        title="Settings">
                        <i class="pi pi-cog"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0">
            <!-- Top Header -->
            <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <button class="md:hidden text-gray-600 hover:text-gray-900 mr-4" @click="toggleMobileSidebar">
                            <i class="pi pi-bars"></i>
                        </button>
                        <div>
                            <div class="flex items-center gap-2">
                                <h2 class="text-lg font-semibold text-gray-900">{{ currentPageTitle }}</h2>
                                <span v-if="currentProject" class="text-sm text-gray-500">- {{ currentProject.name
                                }}</span>
                            </div>
                            <p class="text-sm text-gray-500">{{ currentPageDescription }}</p>
                        </div>
                    </div>

                    <!-- Header Actions -->
                    <div class="flex items-center space-x-4">
                        <!-- Notifications -->
                        <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                            <i class="pi pi-bell"></i>
                            <span
                                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>

                        <!-- Search -->
                        <div class="relative hidden md:block">
                            <input type="search" placeholder="Search..."
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            <i
                                class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>

                        <!-- Profile Dropdown -->
                        <div class="relative">
                            <button
                                class="flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                @click="toggleProfileMenu">
                                <div
                                    class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-2">
                                    <span class="text-white text-xs font-semibold">{{ getUserInitials() }}</span>
                                </div>
                                <span class="hidden md:block text-sm font-medium">{{ (user?.first_name || '') + ' ' +
                                    (user?.last_name || 'User') }}</span>
                                <i class="pi pi-chevron-down ml-2 text-xs"></i>
                            </button>

                            <!-- Profile Dropdown Menu -->
                            <div v-if="showProfileMenu"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                                @click.stop>
                                <router-link to="/profile"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    @click="showProfileMenu = false">
                                    <i class="pi pi-user mr-3"></i>Profile
                                </router-link>
                                <router-link to="/settings"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    @click="showProfileMenu = false">
                                    <i class="pi pi-cog mr-3"></i>Settings
                                </router-link>
                                <hr class="my-2 border-gray-200">
                                <button @click="handleLogout"
                                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <i class="pi pi-sign-out mr-3"></i>Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto p-6">
                <router-view />
            </main>
        </div>

        <!-- Mobile Sidebar Overlay -->
        <div v-if="showMobileSidebar" class="fixed inset-0 z-50 md:hidden" @click="closeMobileSidebar">
            <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
            <div class="relative flex flex-col w-64 h-full bg-white shadow-xl">
                <!-- Mobile sidebar content would go here -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { getMainRoutes } from '@/router'
import ProjectSwitcher from '@/components/projects/ProjectSwitcher.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()

// Mobile sidebar state
const showMobileSidebar = ref(false)
const showProfileMenu = ref(false)

// Navigation routes
const navigationRoutes = getMainRoutes()

// User and project data
const user = computed(() => authStore.user)
const currentProject = computed(() => projectsStore.currentProject)

// Current page info
const currentPageTitle = computed(() => {
    return route.meta?.title as string || 'Dashboard'
})

const currentPageDescription = computed(() => {
    return route.meta?.description as string || ''
})

// Check if route is active
const isActiveRoute = (path: string) => {
    return route.path === path || route.path.startsWith(path + '/')
}

// Mobile sidebar controls
const toggleMobileSidebar = () => {
    showMobileSidebar.value = !showMobileSidebar.value
}

const closeMobileSidebar = () => {
    showMobileSidebar.value = false
}

// Profile menu controls
const toggleProfileMenu = (event: Event) => {
    event.stopPropagation()
    showProfileMenu.value = !showProfileMenu.value
}

// Close profile menu when clicking outside
const closeProfileMenu = () => {
    showProfileMenu.value = false
}

// User utilities
function getUserInitials(): string {
    if (!user.value?.first_name || !user.value?.last_name) return 'U'
    return (user.value.first_name.charAt(0) + user.value.last_name.charAt(0))
        .toUpperCase()
}

// Project handlers
function handleProjectChange(projectId: string) {
    projectsStore.switchProject(projectId)
}

function handleCreateProject() {
    router.push('/onboarding')
}

// Logout handler
async function handleLogout() {
    try {
        await authStore.logout()
        router.push('/login')
    } catch (error) {
        console.error('Logout failed:', error)
    }
}

// Load initial data
onMounted(async () => {
    document.addEventListener('click', closeProfileMenu)

    console.log('🏠 DashboardLayout mounted, auth state:', {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user?.email
    })

    // Initialize projects store if user is authenticated
    if (authStore.isAuthenticated) {
        console.log('🔄 Initializing projects store...')
        await projectsStore.initialize()

        console.log('📊 Projects loaded:', {
            projectCount: projectsStore.projects.length,
            projects: projectsStore.projects.map(p => ({ id: p.id, name: p.name }))
        })

        // If user has no projects, redirect to onboarding
        if (projectsStore.projects.length === 0) {
            console.log('➡️ No projects found, redirecting to onboarding...')
            // Temporarily test with a different route
            router.push('/onboarding')
        } else {
            console.log('✅ User has projects, staying on dashboard')
        }
    } else {
        console.log('❌ User not authenticated in DashboardLayout')
    }
})

onUnmounted(() => {
    document.removeEventListener('click', closeProfileMenu)
});
</script>

<style scoped>
.nav-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    border-radius: 0.5rem;
    transition: all 0.2s ease-in-out;
}

.nav-item:hover {
    background-color: #eff6ff;
    color: #1d4ed8;
}

.nav-item-active {
    background-color: #dbeafe;
    color: #1d4ed8;
    border-right: 2px solid #3b82f6;
}

.sidebar {
    display: flex;
    flex-direction: column;
}

@media (max-width: 768px) {
    .sidebar {
        display: none;
    }
}
</style>