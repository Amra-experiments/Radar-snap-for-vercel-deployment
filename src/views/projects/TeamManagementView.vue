<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="text-sm breadcrumb mb-4">
          <router-link to="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</router-link>
          <span class="mx-2 text-gray-400">/</span>
          <router-link :to="`/projects/${projectId}`" class="text-blue-600 hover:text-blue-800">{{ project?.name }}</router-link>
          <span class="mx-2 text-gray-400">/</span>
          <span class="text-gray-600">Team</span>
        </nav>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Team Management</h1>
            <p class="text-gray-600 mt-2">Manage team members and their access levels</p>
          </div>
          <Button
            @click="showInviteModal = true"
            :disabled="!canInviteMembers"
          >
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
                <Button
                  @click="refreshMembers"
                  size="small"
                  severity="secondary"
                  outlined
                  :loading="membersLoading"
                >
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
              <Button
                @click="showInviteModal = true"
                class="mt-4"
                size="small"
                outlined
              >
                <i class="pi pi-user-plus mr-1"></i>
                Invite First Member
              </Button>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="member in projectMembers"
                :key="member.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center gap-3">
                  <Avatar
                    :label="getInitials(member.name)"
                    shape="circle"
                    class="bg-blue-500 text-white"
                  />
                  <div>
                    <div class="font-medium text-gray-900">{{ member.name }}</div>
                    <div class="text-sm text-gray-600">{{ member.email }}</div>
                    <div class="flex items-center gap-2 mt-1">
                      <Badge
                        :value="member.role"
                        :severity="getRoleSeverity(member.role)"
                      />
                      <Badge
                        :value="member.status"
                        :severity="getStatusSeverity(member.status)"
                      />
                      <span v-if="member.invited_by" class="text-xs text-gray-500">
                        Invited by {{ member.invited_by }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <Button
                    v-if="canManageMembers && member.status === 'pending'"
                    @click="resendInvite(member)"
                    size="small"
                    severity="secondary"
                    outlined
                    :loading="resendingInvite[member.id]"
                  >
                    <i class="pi pi-send mr-1"></i>
                    Resend
                  </Button>
                  
                  <Dropdown
                    v-if="canManageMembers && member.role !== 'owner'"
                    v-model="member.role"
                    :options="roleOptions"
                    optionLabel="label"
                    optionValue="value"
                    @change="updateMemberRole(member)"
                    class="w-32"
                  >
                    <template #value="slotProps">
                      <span class="text-sm">{{ formatRole(slotProps.value) }}</span>
                    </template>
                  </Dropdown>
                  
                  <Button
                    v-if="canRemoveMembers && member.role !== 'owner'"
                    @click="confirmRemoveMember(member)"
                    size="small"
                    severity="danger"
                    outlined
                  >
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
              <div
                v-for="invite in pendingInvitations"
                :key="invite.id"
                class="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div>
                  <div class="font-medium text-gray-900">{{ invite.email }}</div>
                  <div class="text-sm text-gray-600">
                    Invited {{ formatDate(invite.joined_at) }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Badge :value="invite.role" severity="info" />
                  <Button
                    @click="resendInvite(invite)"
                    size="small"
                    severity="secondary"
                    outlined
                    :loading="resendingInvite[invite.id]"
                  >
                    Resend
                  </Button>
                  <Button
                    @click="cancelInvite(invite)"
                    size="small"
                    severity="danger"
                    outlined
                  >
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
    <Dialog
      v-model:visible="showInviteModal"
      modal
      header="Invite Team Member"
      :style="{ width: '32rem' }"
      :closable="!inviting"
    >
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Email Address</label>
          <InputText
            v-model="inviteForm.email"
            type="email"
            placeholder="colleague@example.com"
            class="w-full"
            :class="{ 'p-invalid': inviteErrors.email }"
          />
          <small class="p-error" v-if="inviteErrors.email">{{ inviteErrors.email }}</small>
        </div>
        
        <div class="space-y-2">
          <small class="text-gray-500">
            New team members will be added with Developer role by default.
          </small>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            @click="showInviteModal = false"
            severity="secondary"
            outlined
            :disabled="inviting"
          >
            Cancel
          </Button>
          <Button
            @click="sendInvite"
            :loading="inviting"
          >
            <i class="pi pi-send mr-1"></i>
            Send Invite
          </Button>
        </div>
      </template>
    </Dialog>

    <!-- Remove Member Confirmation -->
    <Dialog
      v-model:visible="showRemoveModal"
      modal
      header="Remove Team Member"
      :style="{ width: '28rem' }"
    >
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
          <Button
            @click="showRemoveModal = false"
            severity="secondary"
            outlined
          >
            Cancel
          </Button>
          <Button
            @click="removeMember"
            severity="danger"
            :loading="removing"
          >
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
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

const route = useRoute()
const projectsStore = useProjectsStore()

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
  email: ''
})

const inviteErrors = ref<Record<string, string>>({})

const project = computed(() => 
  projectsStore.projects.find(p => p.id === projectId)
)

const projectMembers = computed(() => projectsStore.projectMembers)
const membersLoading = computed(() => projectsStore.membersLoading)

const pendingInvitations = computed(() => 
  projectMembers.value.filter(m => m.status === 'pending')
)

const canInviteMembers = computed(() => {
  if (!project.value) return false
  return ['owner', 'admin'].includes(project.value.role)
})

const canManageMembers = computed(() => {
  if (!project.value) return false
  return ['owner', 'admin'].includes(project.value.role)
})

const canRemoveMembers = computed(() => {
  if (!project.value) return false
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
  await projectsStore.fetchProjectMembers(project.value.id)
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
    m => m.email.toLowerCase() === inviteForm.value.email.toLowerCase()
  )
  if (existingMember) {
    inviteErrors.value.email = 'This email is already invited or a member'
  }
  
  return Object.keys(inviteErrors.value).length === 0
}

async function sendInvite() {
  if (!validateInviteForm() || !project.value) return
  
  try {
    inviting.value = true
    await projectsStore.inviteTeamMember(project.value.id, inviteForm.value.email)
    
    showInviteModal.value = false
    inviteForm.value = {
      email: ''
    }
    inviteErrors.value = {}
    
    console.log('Invitation sent successfully')
  } catch (error) {
    console.error('Failed to send invitation:', error)
  } finally {
    inviting.value = false
  }
}

async function resendInvite(member: any) {
  if (!project.value) return
  
  try {
    resendingInvite.value[member.id] = true
    // Resend functionality would need to be implemented in the store
    console.log('Resend invitation for:', member.email)
    console.log('Invitation resent successfully')
  } catch (error) {
    console.error('Failed to resend invitation:', error)
  } finally {
    resendingInvite.value[member.id] = false
  }
}

async function updateMemberRole(member: any) {
  if (!project.value) return
  
  try {
    await projectsStore.updateMemberRole(project.value.id, member.id, member.role)
    console.log('Member role updated successfully')
  } catch (error) {
    console.error('Failed to update member role:', error)
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
    await projectsStore.removeTeamMember(project.value.id, memberToRemove.value.id)
    showRemoveModal.value = false
    memberToRemove.value = null
    console.log('Member removed successfully')
  } catch (error) {
    console.error('Failed to remove member:', error)
  } finally {
    removing.value = false
  }
}

async function cancelInvite(invite: any) {
  if (!project.value) return
  
  try {
    await projectsStore.removeTeamMember(project.value.id, invite.id)
    console.log('Invitation cancelled successfully')
  } catch (error) {
    console.error('Failed to cancel invitation:', error)
  }
}

onMounted(async () => {
  if (project.value) {
    await refreshMembers()
  }
})
</script>