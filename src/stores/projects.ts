import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface Project {
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

interface ProjectMember {
  id: string
  user_id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'developer' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  joined_at: string
  invited_by?: string
}

interface CreateProjectData {
  name: string
  website_url: string
  description?: string
}

interface UpdateProjectData {
  name?: string
  website_url?: string
  description?: string
}

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const projectMembers = ref<ProjectMember[]>([])
  const loading = ref(false)
  const membersLoading = ref(false)

  // Computed
  const hasProjects = computed(() => projects.value.length > 0)
  const canCreateProjects = computed(() => {
    // Could implement project limits based on user plan
    return true
  })

  // Fetch all user projects
  async function fetchProjects() {
    loading.value = true
    try {
      const response = await axios.get('/api/v1/projects')
      projects.value = response.data
      
      // Set current project from localStorage or first project
      const savedProjectId = localStorage.getItem('current_project_id')
      if (savedProjectId) {
        const savedProject = projects.value.find(p => p.id === savedProjectId)
        if (savedProject) {
          currentProject.value = savedProject
        }
      }
      
      // Set first project as current if none selected and projects exist
      if (!currentProject.value && projects.value.length > 0) {
        currentProject.value = projects.value[0]
        localStorage.setItem('current_project_id', projects.value[0].id)
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Failed to fetch projects:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch projects' 
      }
    } finally {
      loading.value = false
    }
  }

  // Create new project
  async function createProject(data: CreateProjectData) {
    loading.value = true
    try {
      const response = await axios.post('/api/v1/projects', data)
      const newProject = response.data
      
      projects.value.push(newProject)
      currentProject.value = newProject
      localStorage.setItem('current_project_id', newProject.id)
      
      return { success: true, project: newProject }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          'Failed to create project'
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Update project
  async function updateProject(projectId: string, data: UpdateProjectData) {
    loading.value = true
    try {
      const response = await axios.put(`/api/v1/projects/${projectId}`, data)
      const updatedProject = response.data
      
      // Update in projects array
      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
      
      // Update current project if it's the one being updated
      if (currentProject.value?.id === projectId) {
        currentProject.value = updatedProject
      }
      
      return { success: true, project: updatedProject }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update project' 
      }
    } finally {
      loading.value = false
    }
  }

  // Switch current project
  function switchProject(projectId: string) {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      currentProject.value = project
      localStorage.setItem('current_project_id', projectId)
      
      // Clear cached project-specific data
      projectMembers.value = []
      
      return { success: true }
    }
    return { success: false, error: 'Project not found' }
  }

  // Delete project
  async function deleteProject(projectId: string) {
    loading.value = true
    try {
      await axios.delete(`/api/v1/projects/${projectId}`)
      
      // Remove from projects array
      projects.value = projects.value.filter(p => p.id !== projectId)
      
      // If deleted project was current, switch to another or clear
      if (currentProject.value?.id === projectId) {
        if (projects.value.length > 0) {
          currentProject.value = projects.value[0]
          localStorage.setItem('current_project_id', projects.value[0].id)
        } else {
          currentProject.value = null
          localStorage.removeItem('current_project_id')
        }
      }
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete project' 
      }
    } finally {
      loading.value = false
    }
  }

  // Fetch project members
  async function fetchProjectMembers(projectId?: string) {
    const targetProjectId = projectId || currentProject.value?.id
    if (!targetProjectId) {
      return { success: false, error: 'No project selected' }
    }
    
    membersLoading.value = true
    try {
      const response = await axios.get(`/api/v1/projects/${targetProjectId}/members`)
      projectMembers.value = response.data
      return { success: true }
    } catch (error: any) {
      console.error('Failed to fetch project members:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch members' 
      }
    } finally {
      membersLoading.value = false
    }
  }

  // Invite team member
  async function inviteTeamMember(email: string, role: string, projectId?: string) {
    const targetProjectId = projectId || currentProject.value?.id
    if (!targetProjectId) {
      return { success: false, error: 'No project selected' }
    }
    
    try {
      const response = await axios.post(`/api/v1/projects/${targetProjectId}/invitations`, {
        email,
        role
      })
      
      // Optionally refresh members list
      await fetchProjectMembers(targetProjectId)
      
      return { success: true, invitation: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send invitation' 
      }
    }
  }

  // Remove team member
  async function removeTeamMember(userId: string, projectId?: string) {
    const targetProjectId = projectId || currentProject.value?.id
    if (!targetProjectId) {
      return { success: false, error: 'No project selected' }
    }
    
    try {
      await axios.delete(`/api/v1/projects/${targetProjectId}/members/${userId}`)
      
      // Remove from local state
      projectMembers.value = projectMembers.value.filter(m => m.user_id !== userId)
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove member' 
      }
    }
  }

  // Update member role
  async function updateMemberRole(userId: string, role: string, projectId?: string) {
    const targetProjectId = projectId || currentProject.value?.id
    if (!targetProjectId) {
      return { success: false, error: 'No project selected' }
    }
    
    try {
      await axios.put(`/api/v1/projects/${targetProjectId}/members/${userId}`, {
        role
      })
      
      // Update local state
      const memberIndex = projectMembers.value.findIndex(m => m.user_id === userId)
      if (memberIndex !== -1) {
        projectMembers.value[memberIndex].role = role as any
      }
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update member role' 
      }
    }
  }

  // Regenerate API key
  async function regenerateApiKey(projectId?: string) {
    const targetProjectId = projectId || currentProject.value?.id
    if (!targetProjectId) {
      return { success: false, error: 'No project selected' }
    }
    
    loading.value = true
    try {
      const response = await axios.post(`/api/v1/projects/${targetProjectId}/regenerate-api-key`)
      const { api_key } = response.data
      
      // Update local state
      const project = projects.value.find(p => p.id === targetProjectId)
      if (project) {
        project.api_key = api_key
      }
      
      if (currentProject.value?.id === targetProjectId) {
        currentProject.value.api_key = api_key
      }
      
      return { success: true, api_key }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to regenerate API key' 
      }
    } finally {
      loading.value = false
    }
  }

  // Clear project data (useful for logout)
  function clearProjectData() {
    projects.value = []
    currentProject.value = null
    projectMembers.value = []
    localStorage.removeItem('current_project_id')
  }

  // Initialize current project from localStorage
  function initializeCurrentProject() {
    const savedProjectId = localStorage.getItem('current_project_id')
    if (savedProjectId && projects.value.length > 0) {
      const savedProject = projects.value.find(p => p.id === savedProjectId)
      if (savedProject) {
        currentProject.value = savedProject
      }
    }
  }

  return {
    // State
    projects,
    currentProject,
    projectMembers,
    loading,
    membersLoading,
    
    // Computed
    hasProjects,
    canCreateProjects,
    
    // Actions
    fetchProjects,
    createProject,
    updateProject,
    switchProject,
    deleteProject,
    fetchProjectMembers,
    inviteTeamMember,
    removeTeamMember,
    updateMemberRole,
    regenerateApiKey,
    clearProjectData,
    initializeCurrentProject
  }
})