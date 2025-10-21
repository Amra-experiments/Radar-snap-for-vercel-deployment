<template>
    <div class="login-view min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div class="max-w-md w-full mx-4">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Radar-Snap</h1>
                    <p class="text-gray-600">Sign in to your analytics dashboard</p>
                </div>

                <form class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" class="input-field" placeholder="Enter your email" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" class="input-field" placeholder="Enter your password" />
                    </div>

                    <button type="submit" class="w-full btn-primary">
                        Sign In
                    </button>
                </form>


            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Login logic will be implemented here
</script>