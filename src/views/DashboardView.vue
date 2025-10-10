<template>
    <div class="dashboard-view">
        <!-- Header Section -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p class="text-gray-600">Real-time insights and performance metrics</p>
            </div>

            <div class="flex items-center space-x-3">
                <Button :loading="isRefreshing" icon="pi pi-refresh" label="Refresh" @click="handleRefresh"
                    class="p-button-outlined" />
                <Button icon="pi pi-download" label="Export" @click="handleExport" class="p-button-outlined" />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="dataStatus.isLoading" class="flex items-center justify-center py-16">
            <ProgressSpinner class="w-12 h-12" strokeWidth="3" />
        </div>

        <!-- Error State -->
        <div v-else-if="dataStatus.hasError" class="mb-6">
            <Message severity="error" :closable="false" class="mb-4">
                Failed to load dashboard data. Please try refreshing the page.
            </Message>
        </div>

        <!-- Main Dashboard Content -->
        <div v-else>
            <!-- KPI Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                <KPICard v-for="kpi in kpiMetrics" :key="kpi.id" :metric="kpi" />
            </div>

            <!-- Dashboard Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <!-- Session Overview Card -->
                <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Session Overview</h3>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-sm"
                            @click="showSessionMenu = !showSessionMenu" />
                    </div>

                    <!-- Session Metrics Grid -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 rounded-lg p-4">
                            <p class="text-sm text-blue-600 font-medium mb-1">Total Sessions</p>
                            <p class="text-2xl font-bold text-blue-900">{{ formatNumber(sessionMetrics?.totalSessions)
                                }}</p>
                        </div>

                        <div class="bg-green-50 rounded-lg p-4">
                            <p class="text-sm text-green-600 font-medium mb-1">Error-Free</p>
                            <p class="text-2xl font-bold text-green-900">{{
                                formatNumber(sessionMetrics?.errorFreeSessions) }}</p>
                        </div>

                        <div class="bg-purple-50 rounded-lg p-4">
                            <p class="text-sm text-purple-600 font-medium mb-1">Successful Actions</p>
                            <p class="text-2xl font-bold text-purple-900">{{
                                formatNumber(sessionMetrics?.successfulActions) }}</p>
                        </div>

                        <div class="bg-orange-50 rounded-lg p-4">
                            <p class="text-sm text-orange-600 font-medium mb-1">Avg Duration</p>
                            <p class="text-2xl font-bold text-orange-900">{{
                                formatDuration(sessionMetrics?.averageDuration) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats Sidebar -->
                <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>

                    <!-- Success Rate -->
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700">Success Rate</span>
                            <span class="text-sm font-bold text-green-600">{{ sessionMetrics?.successRate.toFixed(1)
                                }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-green-500 h-2 rounded-full transition-all duration-300"
                                :style="{ width: `${sessionMetrics?.successRate}%` }"></div>
                        </div>
                    </div>

                    <!-- Error Rate -->
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700">Error Rate</span>
                            <span class="text-sm font-bold text-red-600">{{ sessionMetrics?.errorRate.toFixed(1)
                                }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-red-500 h-2 rounded-full transition-all duration-300"
                                :style="{ width: `${sessionMetrics?.errorRate}%` }"></div>
                        </div>
                    </div>

                    <!-- Live Activity Indicator -->
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Live Users</span>
                        <div class="flex items-center">
                            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                            <span class="text-sm font-bold text-gray-900">{{ liveUserCount }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- Session Trends -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-900">Session Trends</h2>
                        <span class="text-xs text-gray-500">Last 7 days</span>
                    </div>
                    <LineChart :data="sessionTrendsData" color="#3B82F6" height="250px" />
                </div>

                <!-- Error Rate Trends -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-900">Error Rate Trends</h2>
                        <span class="text-xs text-gray-500">Last 7 days</span>
                    </div>
                    <LineChart :data="errorTrendsData" color="#EF4444" height="250px" />
                </div>
            </div>

            <!-- Performance Timeline -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">Performance Metrics Timeline</h2>
                        <p class="text-sm text-gray-600 mt-1">FCP, LCP, and TTI throughout the day</p>
                    </div>
                    <span class="text-xs text-gray-500">Today</span>
                </div>
                <MultiLineChart :xAxisData="mockPerformanceTrends.labels" :series="mockPerformanceTrends.series"
                    yAxisLabel="Time (ms)" height="280px" />
            </div>

            <!-- Feature Usage Section -->
            <div class="mb-8 space-y-6">

                <!-- Feature Engagement Trends Chart -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">Feature Engagement Trends</h2>
                            <p class="text-sm text-gray-600 mt-1">Top 3 features usage over time</p>
                        </div>
                        <span class="text-xs text-gray-500">Last 7 days</span>
                    </div>
                    <MultiLineChart :xAxisData="mockFeatureEngagementTrends.labels"
                        :series="mockFeatureEngagementTrends.series" yAxisLabel="Usage Count" height="280px" />
                </div>

                <!-- Feature Usage Cards -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-star text-xl text-purple-600"></i>
                            <h2 class="text-xl font-semibold text-gray-900">Feature Usage Analytics</h2>
                            <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                {{ displayedFeatures.length }} Features
                            </span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Dropdown v-model="selectedView" :options="viewOptions" optionLabel="label"
                                optionValue="value" placeholder="Select view" class="w-48" />
                            <Button label="Feature Details" icon="pi pi-arrow-right" iconPos="right" text
                                size="small" />
                        </div>
                    </div>

                    <p class="text-sm text-gray-600 mb-6">
                        Track feature adoption, engagement, and success rates across your application
                    </p>

                    <!-- Summary Stats -->
                    <div class="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div class="text-center">
                            <p class="text-2xl font-bold text-blue-600">
                                {{ data?.featureUsage?.length || 0 }}
                            </p>
                            <p class="text-xs text-gray-600 mt-1">Total Features</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-green-600">
                                {{ getTopFeatures(3).length }}
                            </p>
                            <p class="text-xs text-gray-600 mt-1">High Adoption</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-orange-600">
                                {{ getLowAdoptionFeatures(30).length }}
                            </p>
                            <p class="text-xs text-gray-600 mt-1">Needs Attention</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-purple-600">
                                {{((data?.featureUsage?.reduce((sum, f) => sum + f.successRate, 0) || 0) /
                                    (data?.featureUsage?.length || 1)).toFixed(1)}}%
                            </p>
                            <p class="text-xs text-gray-600 mt-1">Avg Success Rate</p>
                        </div>
                    </div>

                    <!-- Feature Cards Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <FeatureCard v-for="feature in displayedFeatures" :key="feature.featureId" :feature="feature" />
                    </div>

                    <!-- Empty State -->
                    <div v-if="displayedFeatures.length === 0" class="text-center py-12">
                        <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                        <p class="text-gray-600">No features match the selected filter</p>
                    </div>

                    <!-- Category Breakdown (Collapsible) -->
                    <details class="mt-6 pt-6 border-t border-gray-200">
                        <summary
                            class="text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 flex items-center gap-2">
                            <i class="pi pi-list"></i>
                            View by Category
                        </summary>
                        <div class="mt-4 space-y-4">
                            <div v-for="(features, category) in getFeaturesByCategory()" :key="category"
                                class="border border-gray-200 rounded-lg p-4">
                                <div class="flex items-center justify-between mb-3">
                                    <h4 class="font-semibold text-gray-900">{{ category }}</h4>
                                    <span class="text-sm text-gray-600">{{ features.length }} features</span>
                                </div>
                                <div class="space-y-2">
                                    <div v-for="feature in features" :key="feature.featureId"
                                        class="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                                        <span class="text-gray-700">{{ feature.featureName }}</span>
                                        <div class="flex items-center gap-4">
                                            <span class="text-gray-600">
                                                {{ feature.usageCount.toLocaleString() }} uses
                                            </span>
                                            <span :class="[
                                                'font-semibold',
                                                feature.adoptionRate >= 70 ? 'text-green-600' :
                                                    feature.adoptionRate >= 40 ? 'text-orange-600' : 'text-red-600'
                                            ]">
                                                {{ feature.adoptionRate.toFixed(1) }}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>

                </div>

            </div>

            <!-- Recent Sessions Table -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                        <router-link to="/sessions" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </router-link>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Session ID
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Page Views
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Browser
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="session in recentSessions" :key="session.id"
                                class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                @click="viewSessionDetail(session.id)">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                    {{ session.id }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-8 w-8">
                                            <div
                                                class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span class="text-xs font-medium text-gray-600">
                                                    {{ session.userName.charAt(0).toUpperCase() }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-3">
                                            <div class="text-sm font-medium text-gray-900">{{ session.userName }}</div>
                                            <div class="text-sm text-gray-500">{{ session.geography }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ formatDuration(session.duration) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ session.pageViews }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ session.browser }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                        :class="getStatusClass(session.status)">
                                        {{ session.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Interaction Challenges Section - Critical UX Issues -->
            <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">



                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-exclamation-triangle text-xl text-orange-600"></i>
                        <h2 class="text-xl font-semibold text-gray-900">Interaction Challenges</h2>
                        <span class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            {{ data?.interactionChallenges?.length || 0 }} Issues
                        </span>
                    </div>
                    <Button label="View All" icon="pi pi-arrow-right" iconPos="right" text size="small" />
                </div>



                <p class="text-sm text-gray-600 mb-6">
                    Tracking user frustration indicators: rage clicks and dead clicks that signal UX problems
                </p>

                <div class="mt-6 mb-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
                    <div class="text-center">
                        <p class="text-2xl font-bold text-red-600">
                            {{data?.interactionChallenges?.filter(c => c.type === 'rage_click').length || 0}}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Rage Click Issues</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-gray-600">
                            {{data?.interactionChallenges?.filter(c => c.type === 'dead_click').length || 0}}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Dead Click Issues</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-orange-600">
                            {{data?.interactionChallenges?.reduce((sum, c) => sum + c.affectedUsers, 0) || 0}}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Total Affected Users</p>
                    </div>
                </div>


                <!-- Challenges Grid -->
                <div class="space-y-4">
                    <div v-for="challenge in data?.interactionChallenges?.slice(0, 5)"
                        :key="`${challenge.page}-${challenge.element}`"
                        class="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-sm transition-all">
                        <div class="flex items-start justify-between gap-4">

                            <!-- Left: Issue Details -->
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <!-- Issue Type Badge -->
                                    <span :class="[
                                        'px-2 py-1 text-xs font-semibold rounded',
                                        challenge.type === 'rage_click'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-gray-700'
                                    ]">
                                        <i :class="[
                                            'pi text-xs mr-1',
                                            challenge.type === 'rage_click' ? 'pi-bolt' : 'pi-times-circle'
                                        ]"></i>
                                        {{ challenge.type === 'rage_click' ? 'Rage Click' : 'Dead Click' }}
                                    </span>

                                    <!-- Impact Badge -->
                                    <span v-if="challenge.impact" :class="[
                                        'px-2 py-1 text-xs font-semibold rounded',
                                        challenge.impact === 'high'
                                            ? 'bg-red-50 text-red-600 border border-red-200'
                                            : challenge.impact === 'medium'
                                                ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                                : 'bg-blue-50 text-blue-600 border border-blue-200'
                                    ]">
                                        {{ challenge.impact }} Impact
                                    </span>
                                </div>

                                <!-- Element Info -->
                                <h3 class="text-base font-semibold text-gray-900 mb-1">
                                    {{ challenge.elementLabel || challenge.element }}
                                </h3>

                                <p class="text-sm text-gray-600 mb-2">
                                    <i class="pi pi-map-marker text-gray-400 text-xs mr-1"></i>
                                    {{ challenge.page }}
                                </p>

                                <!-- Issue Description -->
                                <p v-if="challenge.description"
                                    class="text-sm text-gray-500 italic mb-3 pl-4 border-l-2 border-gray-200">
                                    {{ challenge.description }}
                                </p>

                                <!-- Stats Row -->
                                <div class="flex items-center gap-6 text-sm">
                                    <div class="flex items-center gap-1">
                                        <i class="pi pi-mouse text-gray-400 text-xs"></i>
                                        <span class="text-gray-600">
                                            <strong class="text-gray-900">{{ challenge.count }}</strong> clicks
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <i class="pi pi-users text-gray-400 text-xs"></i>
                                        <span class="text-gray-600">
                                            <strong class="text-gray-900">{{ challenge.affectedUsers }}</strong> users
                                        </span>
                                    </div>
                                    <div v-if="challenge.avgClicksPerUser" class="flex items-center gap-1">
                                        <i class="pi pi-chart-line text-gray-400 text-xs"></i>
                                        <span class="text-gray-600">
                                            <strong class="text-gray-900">{{ challenge.avgClicksPerUser }}</strong>
                                            avg/user
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Frustration Score -->
                            <div class="flex flex-col items-center justify-center min-w-[80px]">
                                <div :class="[
                                    'w-16 h-16 rounded-full flex items-center justify-center border-4',
                                    challenge.frustrationScore >= 8
                                        ? 'border-red-500 bg-red-50'
                                        : challenge.frustrationScore >= 6
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-yellow-500 bg-yellow-50'
                                ]">
                                    <span :class="[
                                        'text-xl font-bold',
                                        challenge.frustrationScore >= 8
                                            ? 'text-red-600'
                                            : challenge.frustrationScore >= 6
                                                ? 'text-orange-600'
                                                : 'text-yellow-600'
                                    ]">
                                        {{ challenge.frustrationScore.toFixed(1) }}
                                    </span>
                                </div>
                                <span class="text-xs text-gray-500 mt-2 text-center">Frustration Score</span>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Summary Stats Footer -->
                <!-- <div class="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
                    <div class="text-center">
                        <p class="text-2xl font-bold text-red-600">
                            {{ data?.interactionChallenges?.filter(c => c.type === 'rage_click').length || 0 }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Rage Click Issues</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-gray-600">
                            {{ data?.interactionChallenges?.filter(c => c.type === 'dead_click').length || 0 }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Dead Click Issues</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-orange-600">
                            {{ data?.interactionChallenges?.reduce((sum, c) => sum + c.affectedUsers, 0) || 0 }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Total Affected Users</p>
                    </div>
                </div> -->

            </div>

            <!-- API Error Tracking Section -->
            <div class="mt-8 space-y-6">

                <!-- Error Trends Chart -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">API Error Trends</h2>
                            <p class="text-sm text-gray-600 mt-1">Error distribution by HTTP status code category</p>
                        </div>
                        <span class="text-xs text-gray-500">Last 7 days</span>
                    </div>
                    <MultiLineChart :xAxisData="mockAPIErrorTrends.labels" :series="mockAPIErrorTrends.series"
                        yAxisLabel="Error Count" height="280px" />
                </div>

                <!-- Error Analytics Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <!-- Status Code Distribution -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <PieChart :data="getErrorsByStatusCode()" title="Errors by Status Code" height="280px"
                            :colors="['#EF4444', '#F59E0B', '#3B82F6']" />
                    </div>

                    <!-- Error Type Distribution -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <PieChart :data="getErrorsByType()" title="Errors by Type" height="280px" :isDonut="true"
                            :colors="['#EF4444', '#F59E0B', '#3B82F6']" />
                    </div>

                    <!-- Response Time by Endpoint -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <BarChart :data="responseTimeData" title="Avg Response Time" height="280px" color="#8B5CF6"
                            :horizontal="true" />
                    </div>

                </div>

                <!-- Error Details Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-exclamation-circle text-xl text-red-600"></i>
                            <h2 class="text-xl font-semibold text-gray-900">API Error Log</h2>
                            <span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                {{ displayedErrors.length }} Errors
                            </span>
                        </div>
                        <div class="flex items-center gap-3">
                            <Dropdown v-model="selectedErrorView" :options="errorViewOptions" optionLabel="label"
                                optionValue="value" placeholder="Filter errors" class="w-48" />
                            <Button label="Export Log" icon="pi pi-download" outlined size="small" />
                        </div>
                    </div>

                    <p class="text-sm text-gray-600 mb-6">
                        Monitor API failures, response times, and error patterns to identify backend issues
                    </p>

                    <!-- Summary Stats -->
                    <div class="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div class="text-center">
                            <p class="text-2xl font-bold text-red-600">
                                {{data?.topErrors?.filter(e => e.statusCode >= 500).length || 0}}
                            </p>
                            <p class="text-xs text-gray-600 mt-1">5xx Errors</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-orange-600">
                                {{data?.topErrors?.filter(e => e.statusCode >= 400 && e.statusCode < 500).length || 0}}
                                    </p>
                                    <p class="text-xs text-gray-600 mt-1">4xx Errors</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-purple-600">
                                {{ getTopErrorEndpoints(10).length }}
                            </p>
                            <p class="text-xs text-gray-600 mt-1">Affected Endpoints</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-blue-600">
                                {{data?.topErrors?.reduce((sum, e) => sum + e.count, 0) || 0}}
                            </p>
                            <p class="text-xs text-gray-600 mt-1">Total Occurrences</p>
                        </div>
                    </div>

                    <!-- Error Cards -->
                    <div class="space-y-4">
                        <ErrorCard v-for="error in displayedErrors" :key="error.id" :error="error"
                            @view-details="handleViewErrorDetails" />
                    </div>

                    <!-- Empty State -->
                    <div v-if="displayedErrors.length === 0" class="text-center py-12">
                        <i class="pi pi-check-circle text-4xl text-green-300 mb-3"></i>
                        <p class="text-gray-600">No errors found for the selected filter</p>
                    </div>

                    <!-- Top Problematic Endpoints -->
                    <details class="mt-6 pt-6 border-t border-gray-200">
                        <summary
                            class="text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 flex items-center gap-2">
                            <i class="pi pi-chart-bar"></i>
                            Top Problematic Endpoints
                        </summary>
                        <div class="mt-4 space-y-3">
                            <div v-for="(item, index) in getTopErrorEndpoints(5)" :key="item.endpoint"
                                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">
                                        {{ index + 1 }}
                                    </div>
                                    <div>
                                        <code class="text-sm font-mono text-gray-900">{{ item.endpoint }}</code>
                                        <p class="text-xs text-gray-500 mt-0.5">
                                            {{ item.uniqueErrorTypes }} unique error types
                                        </p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-lg font-bold text-red-600">{{ item.totalErrors }}</p>
                                    <p class="text-xs text-gray-500">errors</p>
                                </div>
                            </div>
                        </div>
                    </details>

                </div>

                <!-- Error Details Dialog -->
                <Dialog v-model:visible="showErrorDialog" modal header="Error Details" :style="{ width: '50rem' }"
                    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div v-if="selectedError" class="space-y-4">
                        <!-- Error Info -->
                        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                            <div>
                                <p class="text-xs text-gray-600 mb-1">Endpoint</p>
                                <code class="text-sm font-mono text-gray-900">{{ selectedError.endpoint }}</code>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600 mb-1">Method</p>
                                <span class="text-sm font-semibold">{{ selectedError.method }}</span>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600 mb-1">Status Code</p>
                                <span class="text-sm font-semibold">{{ selectedError.statusCode }}</span>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600 mb-1">Occurrences</p>
                                <span class="text-sm font-semibold">{{ selectedError.count }}</span>
                            </div>
                        </div>

                        <!-- Error Message -->
                        <div>
                            <p class="text-sm font-semibold text-gray-700 mb-2">Error Message</p>
                            <div class="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                                <p class="text-sm text-gray-800">{{ selectedError.errorMessage }}</p>
                            </div>
                        </div>

                        <!-- Stack Trace -->
                        <div v-if="selectedError.stackTrace">
                            <p class="text-sm font-semibold text-gray-700 mb-2">Stack Trace</p>
                            <pre
                                class="p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">{{ selectedError.stackTrace }}</pre>
                        </div>

                        <!-- Session Info -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs text-gray-600 mb-1">Session ID</p>
                                <code class="text-sm">{{ selectedError.sessionId }}</code>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600 mb-1">User ID</p>
                                <code class="text-sm">{{ selectedError.userId }}</code>
                            </div>
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Close" @click="showErrorDialog = false" text />
                        <Button label="View Full Session" icon="pi pi-external-link" />
                    </template>
                </Dialog>

            </div>

            <!-- User Demographics Section with Charts -->
            <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center gap-2 mb-6">
                    <i class="pi pi-users text-xl text-blue-600"></i>
                    <h2 class="text-xl font-semibold text-gray-900">User Demographics</h2>
                    <span class="text-xs text-gray-500 ml-2">(Last 30 days)</span>
                </div>

                <!-- Demographics Charts Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <!-- Browser Distribution Pie Chart -->
                    <div>
                        <PieChart :data="getBrowserChartData()" title="Browser Distribution" height="300px" />
                    </div>

                    <!-- Device Distribution Donut Chart -->
                    <div>
                        <PieChart :data="getDeviceChartData()" title="Device Type" height="300px" :isDonut="true"
                            :colors="['#8B5CF6', '#3B82F6', '#10B981']" />
                    </div>

                    <!-- Top Locations Bar Chart -->
                    <div>
                        <BarChart :data="getGeographyChartData()" title="Top Locations" height="300px" color="#10B981"
                            :horizontal="true" />
                    </div>

                </div>

                <!-- User Stats Row (keep existing stats) -->
                <div class="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-blue-50 rounded-lg text-center">
                        <p class="text-sm text-gray-600 mb-1">New Users</p>
                        <p class="text-2xl font-bold text-blue-600">
                            {{ data?.userDemographics?.newUsers?.toLocaleString() }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                            {{ calculatePercentage(data?.userDemographics?.newUsers || 0,
                                data?.userDemographics?.totalUsers || 1) }}% of total
                        </p>
                    </div>

                    <div class="p-4 bg-green-50 rounded-lg text-center">
                        <p class="text-sm text-gray-600 mb-1">Returning Users</p>
                        <p class="text-2xl font-bold text-green-600">
                            {{ data?.userDemographics?.returningUsers?.toLocaleString() }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                            {{ calculatePercentage(data?.userDemographics?.returningUsers || 0,
                                data?.userDemographics?.totalUsers || 1) }}% of total
                        </p>
                    </div>

                    <div class="p-4 bg-purple-50 rounded-lg text-center">
                        <p class="text-sm text-gray-600 mb-1">Avg Sessions/User</p>
                        <p class="text-2xl font-bold text-purple-600">
                            {{ data?.userDemographics?.averageSessionsPerUser?.toFixed(1) }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">per user</p>
                    </div>
                </div>

            </div>

            <!-- Storage & Cookie Analytics Section -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-900">Storage & Cookie Analytics</h2>
                    <Button icon="pi pi-cog" class="p-button-text p-button-sm"
                        @click="showStorageSettings = !showStorageSettings" />
                </div>

                <!-- Storage Overview Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div class="p-4 bg-blue-50 rounded-lg text-center">
                        <p class="text-sm text-gray-600 mb-1">Total Items</p>
                        <p class="text-2xl font-bold text-blue-600">{{ data?.storageAnalytics?.totalItems || 0 }}</p>
                        <p class="text-xs text-gray-500 mt-1">across all storage</p>
                    </div>

                    <div class="p-4 bg-green-50 rounded-lg text-center">
                        <p class="text-sm text-gray-600 mb-1">Total Size</p>
                        <p class="text-2xl font-bold text-green-600">{{
                            formatStorageSize(data?.storageAnalytics?.totalSize || 0) }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">used storage</p>
                    </div>

                    <div class="p-4 bg-purple-50 rounded-lg text-center">
                        <p class="text-sm text-gray-600 mb-1">Cookie Consents</p>
                        <p class="text-2xl font-bold text-purple-600">{{ data?.storageAnalytics?.cookieConsent?.accepted
                            || 0 }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ ((data?.storageAnalytics?.cookieConsent?.accepted || 0)
                            /
                            (data?.storageAnalytics?.cookieConsent?.total || 1) * 100).toFixed(1) }}% acceptance</p>
                    </div>

                    <div class="p-4 bg-orange-50 rounded-lg text-center">
                        <p class="text-sm text-gray-600 mb-1">Storage Errors</p>
                        <p class="text-2xl font-bold text-orange-600">{{ getTotalStorageErrors() }}</p>
                        <p class="text-xs text-gray-500 mt-1">quota & access errors</p>
                    </div>
                </div>

                <!-- Storage Analytics Tabs -->
                <TabView class="mb-6">
                    <!-- Usage Overview Tab -->
                    <TabPanel header="Usage Overview">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Storage Usage by Type Chart -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="font-medium text-gray-900 mb-4">Storage Usage by Type</h4>
                                <PieChart :data="storageUsageChartData" title="Storage Usage by Type" height="280px" />
                            </div>

                            <!-- Storage Quotas -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="font-medium text-gray-900 mb-4">Storage Quotas</h4>
                                <div class="space-y-3">
                                    <div v-for="quota in data?.storageQuotas" :key="quota.type"
                                        class="flex items-center justify-between p-3 bg-white rounded border">
                                        <div class="flex items-center space-x-3">
                                            <i :class="getStorageTypeIcon(quota.type)"
                                                class="text-lg text-gray-600"></i>
                                            <div>
                                                <p class="font-medium text-gray-900">{{ formatStorageType(quota.type) }}
                                                </p>
                                                <p class="text-sm text-gray-500">{{ formatStorageSize(quota.used) }} /
                                                    {{
                                                    formatStorageSize(quota.quota) }}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <ProgressBar :value="quota.percentage"
                                                :class="getQuotaStatusColor(quota.status)" class="w-24"
                                                :show-value="false" />
                                            <span class="text-sm font-medium" :class="getQuotaTextColor(quota.status)">
                                                {{ quota.percentage }}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cookie Consent Analytics -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="font-medium text-gray-900 mb-4">Cookie Consent by Category</h4>
                                <BarChart :data="cookieConsentChartData" title="Cookie Consent by Category"
                                    height="280px" />
                            </div>

                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="font-medium text-gray-900 mb-4">Consent Trends</h4>
                                <LineChart :data="consentTrendsChartData" title="Consent Trends" height="280px" />
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Storage Items Tab -->
                    <TabPanel header="Storage Items">
                        <div class="mb-4 flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-sm text-gray-600">Filter by type:</span>
                                <Dropdown v-model="selectedStorageType" :options="storageTypeOptions"
                                    placeholder="All Types" class="w-40" show-clear />
                                <span class="text-sm text-gray-600">Category:</span>
                                <Dropdown v-model="selectedCategory" :options="categoryOptions"
                                    placeholder="All Categories" class="w-40" show-clear />
                            </div>
                            <div class="text-sm text-gray-600">
                                Showing {{ filteredStorageItems.length }} of {{ data?.storageItems?.length || 0 }} items
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StorageItemCard v-for="item in filteredStorageItems" :key="item.id" :item="item"
                                @inspect="handleInspectItem" @copy="handleCopyItem" @delete="handleDeleteItem" />
                        </div>

                        <div v-if="filteredStorageItems.length === 0" class="text-center py-8">
                            <i class="pi pi-inbox text-4xl text-gray-400 mb-3"></i>
                            <p class="text-gray-500">No storage items found matching your filters.</p>
                        </div>
                    </TabPanel>

                    <!-- Events Tab -->
                    <TabPanel header="Recent Events">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Key</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Page</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="event in recentStorageEvents" :key="event.id" class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <i :class="getEventIcon(event.type)" class="mr-2 text-gray-600"></i>
                                                <span class="text-sm text-gray-900">{{ formatEventType(event.type)
                                                    }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                :class="getStorageTypeColor(event.storageType)">
                                                {{ formatStorageType(event.storageType) }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ event.key || '-' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ event.page }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatRelativeTime(event.timestamp) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span v-if="event.error"
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <i class="pi pi-exclamation-triangle mr-1"></i>
                                                Error
                                            </span>
                                            <span v-else
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <i class="pi pi-check mr-1"></i>
                                                Success
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </TabPanel>

                    <!-- Compliance Tab -->
                    <TabPanel header="Compliance">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Compliance Score -->
                            <div class="bg-gray-50 rounded-lg p-6">
                                <h4 class="font-medium text-gray-900 mb-4">Compliance Score</h4>
                                <div class="text-center mb-4">
                                    <div class="text-4xl font-bold text-green-600 mb-2">{{ getComplianceScore() }}%
                                    </div>
                                    <p class="text-gray-600">Overall compliance rating</p>
                                </div>

                                <div class="space-y-3">
                                    <div class="flex items-center justify-between p-3 bg-white rounded border">
                                        <div class="flex items-center space-x-2">
                                            <i class="pi pi-shield text-green-600"></i>
                                            <span class="font-medium">GDPR Compliance</span>
                                        </div>
                                        <span class="text-green-600 font-medium">
                                            {{ data?.storageAnalytics?.compliance?.gdprCompliant ? 'Compliant' :
                                            'Non-compliant' }}
                                        </span>
                                    </div>

                                    <div class="flex items-center justify-between p-3 bg-white rounded border">
                                        <div class="flex items-center space-x-2">
                                            <i class="pi pi-shield text-green-600"></i>
                                            <span class="font-medium">CCPA Compliance</span>
                                        </div>
                                        <span class="text-green-600 font-medium">
                                            {{ data?.storageAnalytics?.compliance?.ccpaCompliant ? 'Compliant' :
                                            'Non-compliant' }}
                                        </span>
                                    </div>

                                    <div class="flex items-center justify-between p-3 bg-white rounded border">
                                        <div class="flex items-center space-x-2">
                                            <i class="pi pi-bookmark text-blue-600"></i>
                                            <span class="font-medium">Cookie Consent</span>
                                        </div>
                                        <span class="text-blue-600 font-medium">
                                            {{ data?.storageAnalytics?.compliance?.cookieConsentRequired ? 'Required' :
                                            'Optional'
                                            }}
                                        </span>
                                    </div>

                                    <div class="flex items-center justify-between p-3 bg-white rounded border">
                                        <div class="flex items-center space-x-2">
                                            <i class="pi pi-calendar text-purple-600"></i>
                                            <span class="font-medium">Data Retention</span>
                                        </div>
                                        <span class="text-purple-600 font-medium">
                                            {{ data?.storageAnalytics?.compliance?.dataRetentionPolicy }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Privacy Settings -->
                            <div class="bg-gray-50 rounded-lg p-6">
                                <h4 class="font-medium text-gray-900 mb-4">Privacy & Cookie Settings</h4>

                                <div class="space-y-4">
                                    <div class="flex items-center justify-between">
                                        <label class="font-medium text-gray-700">Essential Cookies</label>
                                        <InputSwitch v-model="privacySettings.essential" :disabled="true" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <label class="font-medium text-gray-700">Functional Cookies</label>
                                        <InputSwitch v-model="privacySettings.functional" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <label class="font-medium text-gray-700">Analytics Cookies</label>
                                        <InputSwitch v-model="privacySettings.analytics" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <label class="font-medium text-gray-700">Marketing Cookies</label>
                                        <InputSwitch v-model="privacySettings.marketing" />
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <label class="font-medium text-gray-700">Preference Cookies</label>
                                        <InputSwitch v-model="privacySettings.preferences" />
                                    </div>
                                </div>

                                <div class="mt-6 pt-4 border-t border-gray-200">
                                    <Button label="Update Privacy Settings" class="w-full"
                                        @click="updatePrivacySettings" />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ProgressBar from 'primevue/progressbar'
import InputSwitch from 'primevue/inputswitch'
import KPICard from '@/components/common/KPICard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import MultiLineChart from '@/components/charts/MultiLineChart.vue'
import FeatureCard from '@/components/dashboard/FeatureCard.vue'
import ErrorCard from '@/components/dashboard/ErrorCard.vue'
import StorageItemCard from '@/components/dashboard/StorageItemCard.vue'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import { useKPIs, useSessionMetrics, useSessions, useRefreshDashboard, useDataStatus, useDashboardData } from '@/composables/useDashboard'
import {
    mockSessionTrends,
    mockErrorRateTrends,
    mockPerformanceTrends,
    getBrowserChartData,
    getDeviceChartData,
    getGeographyChartData,
    mockFeatureEngagementTrends,
    getTopFeatures,
    getLowAdoptionFeatures,
    getFeaturesByCategory,
    mockAPIErrorTrends,
    mockAPIResponseTimes,
    getErrorsByStatusCode,
    getTopErrorEndpoints,
    getErrorsByType,
    getStorageUsageByType,
    formatStorageSize,
    getCookieConsentTrends,
    getStorageEvents
} from '@/api/mockData'
import type { APIError } from '@/types/analytics'// Router
const router = useRouter()

// Data fetching
const { data: kpiData, isLoading: _kpiLoading } = useKPIs()
const { data: sessionMetrics, isLoading: _sessionLoading } = useSessionMetrics()
const { data: sessions, isLoading: _sessionsLoading } = useSessions()
const { data } = useDashboardData()
const { refreshAll } = useRefreshDashboard()
const dataStatus = useDataStatus()

// Local state
const isRefreshing = ref(false)
const showSessionMenu = ref(false)
const liveUserCount = ref(247)

// Feature usage state
const selectedView = ref<'all' | 'top' | 'low'>('all')
const viewOptions = [
    { label: 'All Features', value: 'all' },
    { label: 'Top Performers', value: 'top' },
    { label: 'Low Adoption', value: 'low' }
]

// API Error tracking state
const selectedErrorView = ref<'all' | 'critical' | 'recent'>('all')
const errorViewOptions = [
    { label: 'All Errors', value: 'all' },
    { label: 'Critical (5xx)', value: 'critical' },
    { label: 'Recent', value: 'recent' }
]

const showErrorDialog = ref(false)
const selectedError = ref<APIError | null>(null)

// Computed values
const kpiMetrics = computed(() => kpiData.value || [])
const recentSessions = computed(() => sessions.value?.slice(0, 5) || [])

// Chart data computed properties
const sessionTrendsData = computed(() =>
    mockSessionTrends.map(item => ({
        x: item.label || item.timestamp,
        y: item.value
    }))
)

const errorTrendsData = computed(() =>
    mockErrorRateTrends.labels.map((x, i) => ({ x, y: mockErrorRateTrends.data[i] }))
)

// Feature usage computed properties
const displayedFeatures = computed(() => {
    if (selectedView.value === 'top') return getTopFeatures(5)
    if (selectedView.value === 'low') return getLowAdoptionFeatures(30)
    return data.value?.featureUsage || []
})

// API Error computed properties
const displayedErrors = computed(() => {
    const errors = data.value?.topErrors || []
    if (selectedErrorView.value === 'critical') {
        return errors.filter(e => e.statusCode >= 500)
    }
    if (selectedErrorView.value === 'recent') {
        return [...errors].sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 5)
    }
    return errors
})

const responseTimeData = computed(() =>
    mockAPIResponseTimes.map(item => ({
        name: item.endpoint.split('/').pop() || item.endpoint,
        value: item.avgTime
    }))
)// Helper functions
const formatNumber = (num?: number): string => {
    if (!num) return '0'
    return num.toLocaleString()
}

const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0s'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes === 0) {
        return `${remainingSeconds}s`
    } else if (remainingSeconds === 0) {
        return `${minutes}m`
    } else {
        return `${minutes}m ${remainingSeconds}s`
    }
}

const getStatusClass = (status: string): string => {
    const classes = {
        success: 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800',
        incomplete: 'bg-orange-100 text-orange-800'
    }
    return classes[status as keyof typeof classes] || classes.incomplete
}

const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1)
}

// Storage Analytics State
const showStorageSettings = ref(false)
const selectedStorageType = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)

const storageTypeOptions = [
    { label: 'Local Storage', value: 'localStorage' },
    { label: 'Session Storage', value: 'sessionStorage' },
    { label: 'IndexedDB', value: 'indexedDB' },
    { label: 'Cookies', value: 'cookie' }
]

const categoryOptions = [
    { label: 'Essential', value: 'essential' },
    { label: 'Functional', value: 'functional' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Preferences', value: 'preferences' }
]

const privacySettings = ref({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false,
    preferences: true
})

// Storage Analytics Computed Properties
const storageUsageChartData = computed(() => {
    return getStorageUsageByType()
})

const cookieConsentChartData = computed(() => {
    const consentData = data.value?.storageAnalytics?.cookieConsent?.byCategory
    if (!consentData) return []

    return Object.entries(consentData).map(([name, value]) => ({ name, value }))
})

const consentTrendsChartData = computed(() => {
    return getCookieConsentTrends().map(item => ({
        x: item.timestamp,
        y: item.value
    }))
})

const filteredStorageItems = computed(() => {
    let items = data.value?.storageItems || []

    if (selectedStorageType.value) {
        items = items.filter(item => item.type === selectedStorageType.value)
    }

    if (selectedCategory.value) {
        items = items.filter(item => item.category === selectedCategory.value)
    }

    return items.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
})

const recentStorageEvents = computed(() => {
    return getStorageEvents(20)
})

// Storage Helper Methods
const getTotalStorageErrors = (): number => {
    const errors = data.value?.storageAnalytics?.errors
    if (!errors) return 0
    return errors.quotaExceeded + errors.accessErrors + errors.serialization + errors.other
}

const getStorageTypeIcon = (type: string): string => {
    const icons = {
        localStorage: 'pi pi-database',
        sessionStorage: 'pi pi-clock',
        indexedDB: 'pi pi-server',
        cookie: 'pi pi-bookmark',
        cache: 'pi pi-folder',
        total: 'pi pi-chart-pie'
    }
    return icons[type as keyof typeof icons] || 'pi pi-file'
}

const formatStorageType = (type: string): string => {
    const labels = {
        localStorage: 'Local Storage',
        sessionStorage: 'Session Storage',
        indexedDB: 'IndexedDB',
        cookie: 'Cookie',
        cache: 'Cache',
        total: 'Total'
    }
    return labels[type as keyof typeof labels] || type
}

const getQuotaStatusColor = (status: string): string => {
    const colors = {
        healthy: 'p-progressbar-success',
        warning: 'p-progressbar-warning',
        critical: 'p-progressbar-danger'
    }
    return colors[status as keyof typeof colors] || 'p-progressbar-info'
}

const getQuotaTextColor = (status: string): string => {
    const colors = {
        healthy: 'text-green-600',
        warning: 'text-yellow-600',
        critical: 'text-red-600'
    }
    return colors[status as keyof typeof colors] || 'text-gray-600'
}

const getStorageTypeColor = (type: string): string => {
    const colors = {
        localStorage: 'bg-blue-100 text-blue-800',
        sessionStorage: 'bg-orange-100 text-orange-800',
        indexedDB: 'bg-purple-100 text-purple-800',
        cookie: 'bg-green-100 text-green-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getEventIcon = (eventType: string): string => {
    const icons = {
        storage_set: 'pi pi-plus',
        storage_get: 'pi pi-eye',
        storage_remove: 'pi pi-trash',
        storage_clear: 'pi pi-times-circle',
        cookie_set: 'pi pi-bookmark',
        cookie_delete: 'pi pi-bookmark-fill',
        quota_warning: 'pi pi-exclamation-triangle',
        quota_exceeded: 'pi pi-times-circle'
    }
    return icons[eventType as keyof typeof icons] || 'pi pi-info-circle'
}

const formatEventType = (eventType: string): string => {
    return eventType.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
}

const getComplianceScore = (): number => {
    let score = 0
    const compliance = data.value?.storageAnalytics?.compliance
    if (!compliance) return 0

    if (compliance.gdprCompliant) score += 25
    if (compliance.ccpaCompliant) score += 25
    if (compliance.cookieConsentRequired) score += 25
    if (compliance.dataRetentionPolicy) score += 25

    return score
}

// Storage Event Handlers
const handleInspectItem = (item: any) => {
    console.log('Inspecting storage item:', item)
    // Could open a detailed view modal
}

const handleCopyItem = (item: any) => {
    navigator.clipboard.writeText(item.value || '')
    // Could show a toast notification
}

const handleDeleteItem = (item: any) => {
    console.log('Deleting storage item:', item)
    // Could show confirmation dialog and delete
}

const updatePrivacySettings = () => {
    console.log('Updating privacy settings:', privacySettings.value)
    // Could make API call to update privacy settings
}

// Event handlers
const handleRefresh = async () => {
    isRefreshing.value = true
    try {
        await refreshAll()
    } finally {
        isRefreshing.value = false
    }
}

const handleExport = () => {
    // Export functionality will be implemented
    console.log('Export dashboard data')
}

const viewSessionDetail = (sessionId: string) => {
    router.push(`/sessions/${sessionId}`)
}

const handleViewErrorDetails = (error: APIError) => {
    selectedError.value = error
    showErrorDialog.value = true
}

// Simulate live user count updates
const updateLiveUserCount = () => {
    liveUserCount.value = Math.floor(Math.random() * 50) + 200
}

// Update live count every 5 seconds
setInterval(updateLiveUserCount, 5000)
</script>