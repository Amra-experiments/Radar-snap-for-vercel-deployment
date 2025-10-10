<template>
    <Card class="mt-6 border border-blue-200 bg-blue-50">
        <template #title>
            <div class="flex items-center gap-2 text-blue-800">
                <i class="pi pi-info-circle"></i>
                Demo Login Credentials
            </div>
        </template>

        <template #content>
            <div class="space-y-4">
                <p class="text-blue-700 text-sm">
                    Use these demo accounts to test the authentication system:
                </p>

                <div class="grid gap-3">
                    <div v-for="(credential, index) in demoCredentials" :key="index"
                        class="bg-white rounded-lg p-3 border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                        @click="$emit('useCredential', credential)">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-medium text-gray-900">{{ credential.email }}</div>
                                <div class="text-sm text-gray-600">{{ credential.description }}</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    Password: <code class="bg-gray-100 px-1 rounded">{{ credential.password }}</code>
                                </div>
                            </div>
                            <Button size="small" text @click.stop="copyCredentials(credential)">
                                <i class="pi pi-copy"></i>
                            </Button>
                        </div>
                    </div>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <div class="flex gap-2">
                        <i class="pi pi-exclamation-triangle text-yellow-600 mt-0.5"></i>
                        <div class="text-sm text-yellow-800">
                            <p class="font-medium">Development Mode</p>
                            <p>These are mock credentials for testing. In production, you would register with your own
                                email.</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { MOCK_CREDENTIALS } from '@/services/mockAuth'
import Card from 'primevue/card'
import Button from 'primevue/button'

defineEmits<{
    useCredential: [credential: { email: string; password: string; description: string }]
}>()

const demoCredentials = MOCK_CREDENTIALS.map(cred => ({
    email: cred.email,
    password: cred.password,
    description: cred.description
}))

function copyCredentials(credential: typeof demoCredentials[0]) {
    const text = `Email: ${credential.email}\nPassword: ${credential.password}`
    navigator.clipboard.writeText(text).then(() => {
        console.log('Credentials copied to clipboard')
    }).catch(() => {
        console.error('Failed to copy credentials')
    })
}
</script>

<style scoped>
code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>