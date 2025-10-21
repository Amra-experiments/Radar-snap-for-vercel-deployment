<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="text-sm breadcrumb mb-4">
          <router-link to="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</router-link>
          <span class="mx-2 text-gray-400">/</span>
          <router-link :to="`/projects/${projectId}`" class="text-blue-600 hover:text-blue-800">{{ project?.name
          }}</router-link>
          <span class="mx-2 text-gray-400">/</span>
          <span class="text-gray-600">Team</span>
        </nav>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Team Management</h1>
            <p class="text-gray-600 mt-2">Manage team members and their access levels</p>
          </div>
          <Button @click="showInviteModal = true" :disabled="!canInviteMembers">
            <i class="pi pi-user-plus mr-1"></i>
            Invite Member
          </Button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Team Members -->
        <Card>
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-users text-blue-600"></i>
                Team Members
                <Badge :value="projectMembers.length" severity="info" />
              </div>
              <div class="flex items-center gap-2">
                <Button @click="refreshMembers" size="small" severity="secondary" outlined :loading="membersLoading">
                  <i class="pi pi-refresh mr-1"></i>
                  Refresh
                </Button>
              </div>
            </div>
          </template>
          <template #content>
            <div v-if="membersLoading" class="text-center py-8">
              <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
              <p class="text-gray-500 mt-2">Loading team members...</p>
            </div>

            <div v-else-if="projectMembers.length === 0" class="text-center py-8">
              <i class="pi pi-users text-4xl text-gray-300"></i>
              <p class="text-gray-500 mt-2">No team members yet</p>
              <Button @click="showInviteModal = true" class="mt-4" size="small" outlined>
                <i class="pi pi-user-plus mr-1"></i>
                Invite First Member
              </Button>
            </div>

            <div v-else class="space-y-4">
              <div v-for="member in projectMembers" :key="member.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <Avatar :label="getInitials(`${member.user.first_name} ${member.user.last_name}`)" shape="circle"
                    class="bg-blue-500 text-white" />
                  <div>
                    <div class="font-medium text-gray-900">{{ member.user.first_name }} {{ member.user.last_name }}
                    </div>
                    <div class="text-sm text-gray-600">{{ member.user.email }}</div>
                    <div class="flex items-center gap-2 mt-1">
                      <Badge :value="member.role" :severity="getRoleSeverity(member.role)" />
                      <Badge :value="member.joined_at ? 'active' : 'pending'"
                        :severity="getStatusSeverity(member.joined_at ? 'active' : 'pending')" />
                      <span v-if="member.invited_by" class="text-xs text-gray-500">
                        Invited by {{ member.invited_by.first_name }} {{ member.invited_by.last_name }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <Button v-if="canManageMembers && !member.joined_at" @click="resendInvite(member)" size="small"
                    severity="secondary" outlined :loading="resendingInvite[member.id]">
                    <i class="pi pi-send mr-1"></i>
                    Resend
                  </Button>

                  <Dropdown v-if="canManageMembers && member.role !== 'owner'" v-model="member.role"
                    :options="roleOptions" optionLabel="label" optionValue="value" @change="updateMemberRole(member)"
                    class="w-32">
                    <template #value="slotProps">
                      <span class="text-sm">{{ formatRole(slotProps.value) }}</span>
                    </template>
                  </Dropdown>

                  <Button v-if="canRemoveMembers && member.role !== 'owner'" @click="confirmRemoveMember(member)"
                    size="small" severity="danger" outlined>
                    <i class="pi pi-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Pending Invitations -->
        <Card v-if="pendingInvitations.length > 0">
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-clock text-orange-600"></i>
              Pending Invitations
              <Badge :value="pendingInvitations.length" severity="warning" />
            </div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div v-for="invite in pendingInvitations" :key="invite.id"
                class="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <div class="font-medium text-gray-900">{{ invite.email }}</div>
                  <div class="text-sm text-gray-600">
                    Invited {{ formatDate(invite.created_at) }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Badge :value="invite.role" severity="info" />
                  <Button @click="resendInvite(invite)" size="small" severity="secondary" outlined
                    :loading="resendingInvite[invite.id]">
                    Resend
                  </Button>
                  <Button @click="cancelInvite(invite)" size="small" severity="danger" outlined>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Invite Member Modal -->
    <Dialog v-model:visible="showInviteModal" modal header="Invite Team Member" :style="{ width: '32rem' }"
      :closable="!inviting">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Email Address</label>
          <InputText v-model="inviteForm.email" type="email" placeholder="colleague@example.com" class="w-full"
            :class="{ 'p-invalid': inviteErrors.email }" />
          <small class="p-error" v-if="inviteErrors.email">{{ inviteErrors.email }}</small>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Role</label>
          <Dropdown v-model="inviteForm.role" :options="roleOptions" optionLabel="label" optionValue="value"
            placeholder="Select Role" class="w-full" />
          <small class="text-gray-500">
            Choose the appropriate role for the new team member.
          </small>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button @click="showInviteModal = false" severity="secondary" outlined :disabled="inviting">
            Cancel
          </Button>
          <Button @click="sendInvite" :loading="inviting">
            <i class="pi pi-send mr-1"></i>
            Send Invite
          </Button>
        </div>
      </template>
    </Dialog>

    <!-- Remove Member Confirmation -->
    <Dialog v-model:visible="showRemoveModal" modal header="Remove Team Member" :style="{ width: '28rem' }">
      <div class="space-y-4" v-if="memberToRemove">
        <div class="flex items-start gap-3">
          <i class="pi pi-exclamation-triangle text-orange-500 text-xl mt-1"></i>
          <div>
            <p class="text-gray-900 font-medium">Remove {{ memberToRemove.name }}?</p>
            <p class="text-gray-600 text-sm mt-1">
              This person will lose access to the project and all associated data.
              They can be re-invited later if needed.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button @click="showRemoveModal = false" severity="secondary" outlined>
            Cancel
          </Button>
          <Button @click="removeMember" severity="danger" :loading="removing">
            <i class="pi pi-trash mr-1"></i>
            Remove Member
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useToast } from '@/composables/useToast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

const route = useRoute()
const projectsStore = useProjectsStore()
const { showSuccess, showError } = useToast()

const projectId = route.params.id as string
const showInviteModal = ref(false)
const showRemoveModal = ref(false)
const inviting = ref(false)
const removing = ref(false)
const memberToRemove = ref<any>(null)
const resendingInvite = ref<Record<string, boolean>>({})

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Developer', value: 'developer' },
  { label: 'Viewer', value: 'viewer' }
]

const inviteForm = ref({
  email: '',
  role: 'developer' as 'admin' | 'developer' | 'viewer'
})

const inviteErrors = ref<Record<string, string>>({})

const project = computed(() =>
  projectsStore.projects.find(p => p.id === projectId)
)

const projectMembers = computed(() => projectsStore.members)
const membersLoading = computed(() => projectsStore.loading)

const pendingInvitations = computed(() =>
  projectsStore.invitations
)

const canInviteMembers = computed(() => {
  if (!project.value?.role) return false
  return ['owner', 'admin'].includes(project.value.role)
})

const canManageMembers = computed(() => {
  if (!project.value?.role) return false
  return ['owner', 'admin'].includes(project.value.role)
})

const canRemoveMembers = computed(() => {
  if (!project.value?.role) return false
  return project.value.role === 'owner'
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

function getRoleSeverity(role: string) {
  const severityMap: Record<string, any> = {
    owner: 'success',
    admin: 'info',
    developer: 'secondary',
    viewer: 'warning'
  }
  return severityMap[role] || 'secondary'
}

function getStatusSeverity(status: string) {
  const severityMap: Record<string, any> = {
    active: 'success',
    pending: 'warning',
    inactive: 'danger'
  }
  return severityMap[status] || 'secondary'
}

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

async function refreshMembers() {
  if (!project.value) return

  try {
    console.log('🔄 Refreshing team members...')
    const result = await projectsStore.fetchMembers(project.value.id)

    if (result.success) {
      console.log('✅ Team members refreshed successfully')
    } else {
      showError('Failed to refresh team members', 'Refresh Failed')
      console.error('❌ Failed to refresh team members:', result.error)
    }
  } catch (error) {
    console.error('❌ Exception refreshing team members:', error)
    showError('An unexpected error occurred', 'Refresh Failed')
  }
}

function validateInviteForm(): boolean {
  inviteErrors.value = {}

  if (!inviteForm.value.email.trim()) {
    inviteErrors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.value.email)) {
    inviteErrors.value.email = 'Please enter a valid email address'
  }

  // Check if email is already invited or a member
  const existingMember = projectMembers.value.find(
    m => m.user.email.toLowerCase() === inviteForm.value.email.toLowerCase()
  )
  const existingInvite = pendingInvitations.value.find(
    i => i.email.toLowerCase() === inviteForm.value.email.toLowerCase()
  )
  if (existingMember || existingInvite) {
    inviteErrors.value.email = 'This email is already invited or a member'
  }

  return Object.keys(inviteErrors.value).length === 0
}

async function sendInvite() {
  if (!validateInviteForm() || !project.value) return

  try {
    inviting.value = true
    console.log('🔄 Sending invitation to:', inviteForm.value.email)

    const result = await projectsStore.inviteTeamMember(project.value.id, {
      email: inviteForm.value.email,
      role: inviteForm.value.role
    })

    if (result.success) {
      showSuccess(`Invitation sent to ${inviteForm.value.email}!`, 'Invite Sent')

      showInviteModal.value = false
      inviteForm.value = {
        email: '',
        role: 'developer'
      }
      inviteErrors.value = {}

      // Refresh invitations list
      await projectsStore.fetchInvitations(project.value.id)
      console.log('✅ Invitation sent successfully')
    } else {
      showError(result.error || 'Failed to send invitation', 'Invite Failed')
      console.error('❌ Failed to send invitation:', result.error)
    }
  } catch (error) {
    console.error('❌ Exception sending invitation:', error)
    showError('An unexpected error occurred', 'Invite Failed')
  } finally {
    inviting.value = false
  }
}

async function resendInvite(member: any) {
  if (!project.value) return

  try {
    resendingInvite.value[member.id] = true
    console.log('🔄 Resending invitation for:', member.email || member.user?.email)

    // For now, we'll send a new invitation with the same email and role
    // In future, implement a dedicated resend API endpoint
    const email = member.email || member.user?.email
    const role = member.role

    if (email && role) {
      const result = await projectsStore.inviteTeamMember(project.value.id, {
        email: email,
        role: role
      })

      if (result.success) {
        showSuccess(`Invitation resent to ${email}!`, 'Invite Resent')
        console.log('✅ Invitation resent successfully')

        // Refresh invitations
        await projectsStore.fetchInvitations(project.value.id)
      } else {
        showError(result.error || 'Failed to resend invitation', 'Resend Failed')
        console.error('❌ Failed to resend invitation:', result.error)
      }
    } else {
      showError('Invalid invitation data', 'Resend Failed')
    }
  } catch (error) {
    console.error('❌ Exception resending invitation:', error)
    showError('An unexpected error occurred', 'Resend Failed')
  } finally {
    resendingInvite.value[member.id] = false
  }
}

async function updateMemberRole(member: any) {
  if (!project.value) return

  try {
    console.log('🔄 Updating member role:', member.user.email, 'to', member.role)

    const result = await projectsStore.updateMemberRole(project.value.id, member.id, {
      role: member.role
    })

    if (result.success) {
      showSuccess(`${member.user.first_name}'s role updated to ${member.role}`, 'Role Updated')
      console.log('✅ Member role updated successfully')
    } else {
      showError(result.error || 'Failed to update member role', 'Update Failed')
      console.error('❌ Failed to update member role:', result.error)
    }
  } catch (error) {
    console.error('❌ Exception updating member role:', error)
    showError('An unexpected error occurred', 'Update Failed')
  }
}

function confirmRemoveMember(member: any) {
  memberToRemove.value = member
  showRemoveModal.value = true
}

async function removeMember() {
  if (!memberToRemove.value || !project.value) return

  try {
    removing.value = true
    console.log('🔄 Removing member:', memberToRemove.value.user.email)

    const result = await projectsStore.removeMember(project.value.id, memberToRemove.value.id)

    if (result.success) {
      showSuccess(`${memberToRemove.value.user.first_name} removed from project`, 'Member Removed')

      showRemoveModal.value = false
      memberToRemove.value = null

      // Refresh members list
      await projectsStore.fetchMembers(project.value.id)
      console.log('✅ Member removed successfully')
    } else {
      showError(result.error || 'Failed to remove member', 'Remove Failed')
      console.error('❌ Failed to remove member:', result.error)
    }
  } catch (error) {
    console.error('❌ Exception removing member:', error)
    showError('An unexpected error occurred', 'Remove Failed')
  } finally {
    removing.value = false
  }
}

async function cancelInvite(invite: any) {
  if (!project.value) return

  try {
    console.log('🔄 Cancelling invitation for:', invite.email)

    const result = await projectsStore.cancelInvitation(project.value.id, invite.id)

    if (result.success) {
      showSuccess(`Invitation cancelled for ${invite.email}`, 'Invite Cancelled')

      // Refresh invitations list
      await projectsStore.fetchInvitations(project.value.id)
      console.log('✅ Invitation cancelled successfully')
    } else {
      showError(result.error || 'Failed to cancel invitation', 'Cancel Failed')
      console.error('❌ Failed to cancel invitation:', result.error)
    }
  } catch (error) {
    console.error('❌ Exception cancelling invitation:', error)
    showError('An unexpected error occurred', 'Cancel Failed')
  }
}

onMounted(async () => {
  if (project.value) {
    await Promise.all([
      projectsStore.fetchMembers(project.value.id),
      projectsStore.fetchInvitations(project.value.id)
    ])
  }
})
</script>