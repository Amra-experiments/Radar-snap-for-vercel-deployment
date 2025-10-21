import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectsAPI } from '@/api/projects'
import { storage } from '@/utils/storage'
import { getErrorMessage } from '@/utils/errors'
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectMember,
  ProjectInvitation,
  InviteTeamMemberRequest,
  UpdateMemberRoleRequest,
} from '@/types/api'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const members = ref<ProjectMember[]>([])
  const invitations = ref<ProjectInvitation[]>([])
  const loading = ref(false)
  const isInitialized = ref(false)

  // Computed
  const hasProjects = computed(() => projects.value.length > 0)
  const currentProjectId = computed(() => currentProject.value?.id || null)
  const currentProjectRole = computed(() => currentProject.value?.role || null)
  const isOwner = computed(() => currentProjectRole.value === 'owner')
  const isAdmin = computed(() => 
    currentProjectRole.value === 'owner' || currentProjectRole.value === 'admin'
  )
  const canManageMembers = computed(() => isAdmin.value)

  /**
   * Initialize projects from API
   */
  async function initialize() {
    if (isInitialized.value) return

    await fetchProjects()
    
    // Restore current project from storage
    const savedProjectId = storage.currentProject.getId()
    if (savedProjectId && projects.value.length > 0) {
      const project = projects.value.find(p => p.id === savedProjectId)
      if (project) {
        currentProject.value = project
      } else {
        // Saved project not found, use first available
        currentProject.value = projects.value[0]
        storage.currentProject.setId(projects.value[0].id)
      }
    } else if (projects.value.length > 0) {
      // No saved project, use first available
      currentProject.value = projects.value[0]
      storage.currentProject.setId(projects.value[0].id)
    }

    isInitialized.value = true
  }

  /**
   * Fetch all projects for current user
   */
  async function fetchProjects() {
    loading.value = true
    try {
      const data = await projectsAPI.listProjects()
      projects.value = data
      return { success: true, projects: data }
    } catch (error) {
      const message = getErrorMessage(error)
      console.error('Failed to fetch projects:', error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch single project details
   */
  async function fetchProject(projectId: string) {
    loading.value = true
    try {
      const data = await projectsAPI.getProject(projectId)
      
      // Update in projects list
      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = data
      } else {
        projects.value.push(data)
      }
      
      // Update current project if it's the active one
      if (currentProject.value?.id === projectId) {
        currentProject.value = data
      }
      
      return { success: true, project: data }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Create new project
   */
  async function createProject(data: CreateProjectRequest) {
    loading.value = true
    try {
      const newProject = await projectsAPI.createProject(data)
      projects.value.push(newProject)
      
      // Set as current project
      currentProject.value = newProject
      storage.currentProject.setId(newProject.id)
      
      return { success: true, project: newProject }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update project
   */
  async function updateProject(projectId: string, data: UpdateProjectRequest) {
    loading.value = true
    try {
      const updatedProject = await projectsAPI.updateProject(projectId, data)
      
      // Update in projects list
      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
      
      // Update current project if it's the active one
      if (currentProject.value?.id === projectId) {
        currentProject.value = updatedProject
      }
      
      return { success: true, project: updatedProject }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete project
   */
  async function deleteProject(projectId: string) {
    loading.value = true
    try {
      await projectsAPI.deleteProject(projectId)
      
      // Remove from projects list
      projects.value = projects.value.filter(p => p.id !== projectId)
      
      // If deleted project was current, switch to another
      if (currentProject.value?.id === projectId) {
        if (projects.value.length > 0) {
          currentProject.value = projects.value[0]
          storage.currentProject.setId(projects.value[0].id)
        } else {
          currentProject.value = null
          storage.currentProject.clear()
        }
      }
      
      return { success: true }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Switch current project
   */
  function switchProject(projectId: string) {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      currentProject.value = project
      storage.currentProject.setId(projectId)
      
      // Clear cached members when switching projects
      members.value = []
      invitations.value = []
      
      return { success: true, project }
    }
    return { success: false, error: 'Project not found' }
  }

  /**
   * Regenerate project API key
   */
  async function regenerateApiKey(projectId: string) {
    loading.value = true
    try {
      const response = await projectsAPI.regenerateApiKey(projectId)
      
      // Update project with new API key
      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index].api_key = response.api_key
      }
      
      if (currentProject.value?.id === projectId) {
        currentProject.value.api_key = response.api_key
      }
      
      return { success: true, api_key: response.api_key }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch project members
   */
  async function fetchMembers(projectId: string) {
    loading.value = true
    try {
      const data = await projectsAPI.listMembers(projectId)
      members.value = data
      return { success: true, members: data }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Invite team member
   */
  async function inviteTeamMember(projectId: string, data: InviteTeamMemberRequest) {
    loading.value = true
    try {
      const invitation = await projectsAPI.inviteTeamMember(projectId, data)
      invitations.value.push(invitation)
      return { success: true, invitation }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch pending invitations
   */
  async function fetchInvitations(projectId: string) {
    loading.value = true
    try {
      const data = await projectsAPI.listInvitations(projectId)
      invitations.value = data
      return { success: true, invitations: data }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancel invitation
   */
  async function cancelInvitation(projectId: string, invitationId: string) {
    loading.value = true
    try {
      await projectsAPI.cancelInvitation(projectId, invitationId)
      invitations.value = invitations.value.filter(i => i.id !== invitationId)
      return { success: true }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Accept invitation
   */
  async function acceptInvitation(token: string) {
    loading.value = true
    try {
      const response = await projectsAPI.acceptInvitation(token)
      
      // Add to projects list
      projects.value.push(response.project)
      
      // Set as current project
      currentProject.value = response.project
      storage.currentProject.setId(response.project.id)
      
      return { success: true, project: response.project }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Update member role
   */
  async function updateMemberRole(
    projectId: string,
    memberId: string,
    data: UpdateMemberRoleRequest
  ) {
    loading.value = true
    try {
      const updatedMember = await projectsAPI.updateMemberRole(projectId, memberId, data)
      
      // Update in members list
      const index = members.value.findIndex(m => m.id === memberId)
      if (index !== -1) {
        members.value[index] = updatedMember
      }
      
      return { success: true, member: updatedMember }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove member from project
   */
  async function removeMember(projectId: string, memberId: string) {
    loading.value = true
    try {
      await projectsAPI.removeMember(projectId, memberId)
      members.value = members.value.filter(m => m.id !== memberId)
      return { success: true }
    } catch (error) {
      const message = getErrorMessage(error)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear all project data (on logout)
   */
  function clearProjects() {
    projects.value = []
    currentProject.value = null
    members.value = []
    invitations.value = []
    isInitialized.value = false
    storage.currentProject.clear()
  }

  return {
    // State
    projects,
    currentProject,
    members,
    invitations,
    loading,
    isInitialized,

    // Computed
    hasProjects,
    currentProjectId,
    currentProjectRole,
    isOwner,
    isAdmin,
    canManageMembers,

    // Actions
    initialize,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    switchProject,
    regenerateApiKey,
    fetchMembers,
    inviteTeamMember,
    fetchInvitations,
    cancelInvitation,
    acceptInvitation,
    updateMemberRole,
    removeMember,
    clearProjects,
  }
})