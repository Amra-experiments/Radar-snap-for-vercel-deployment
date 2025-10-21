import apiClient from './client'
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectMember,
  ProjectInvitation,
  InviteTeamMemberRequest,
  UpdateMemberRoleRequest,
  RegenerateApiKeyResponse,
} from '@/types/api'

/**
 * Projects API Service
 * Handles all project management API calls
 */

export const projectsAPI = {
  /**
   * List all projects for the authenticated user
   */
  async listProjects(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>('/api/v1/projects/')
    return response.data
  },

  /**
   * Get a specific project by ID
   */
  async getProject(projectId: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/api/v1/projects/${projectId}`)
    return response.data
  },

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>('/api/v1/projects/', data)
    return response.data
  },

  /**
   * Update a project
   */
  async updateProject(projectId: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await apiClient.put<Project>(`/api/v1/projects/${projectId}`, data)
    return response.data
  },

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    await apiClient.delete(`/api/v1/projects/${projectId}`)
  },

  /**
   * Regenerate project API key
   */
  async regenerateApiKey(projectId: string): Promise<RegenerateApiKeyResponse> {
    const response = await apiClient.post<RegenerateApiKeyResponse>(
      `/api/v1/projects/${projectId}/regenerate-key`
    )
    return response.data
  },

  /**
   * List project members
   */
  async listMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await apiClient.get<ProjectMember[]>(
      `/api/v1/projects/${projectId}/members`
    )
    return response.data
  },

  /**
   * Invite team member to project
   */
  async inviteTeamMember(
    projectId: string,
    data: InviteTeamMemberRequest
  ): Promise<ProjectInvitation> {
    const response = await apiClient.post<ProjectInvitation>(
      `/api/v1/projects/${projectId}/invitations`,
      data
    )
    return response.data
  },

  /**
   * List pending invitations
   */
  async listInvitations(projectId: string): Promise<ProjectInvitation[]> {
    const response = await apiClient.get<ProjectInvitation[]>(
      `/api/v1/projects/${projectId}/invitations`
    )
    return response.data
  },

  /**
   * Cancel an invitation
   */
  async cancelInvitation(projectId: string, invitationId: string): Promise<void> {
    await apiClient.delete(`/api/v1/projects/${projectId}/invitations/${invitationId}`)
  },

  /**
   * Accept an invitation
   */
  async acceptInvitation(token: string): Promise<{ project: Project; role: string }> {
    const response = await apiClient.post(`/api/v1/projects/invitations/${token}/accept`)
    return response.data
  },

  /**
   * Update member role
   */
  async updateMemberRole(
    projectId: string,
    memberId: string,
    data: UpdateMemberRoleRequest
  ): Promise<ProjectMember> {
    const response = await apiClient.put<ProjectMember>(
      `/api/v1/projects/${projectId}/members/${memberId}`,
      data
    )
    return response.data
  },

  /**
   * Remove member from project
   */
  async removeMember(projectId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/api/v1/projects/${projectId}/members/${memberId}`)
  },
}

export default projectsAPI