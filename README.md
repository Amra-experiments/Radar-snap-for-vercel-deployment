# Radar-Snap Frontend

A modern analytics dashboard built with Vue 3, TypeScript, and PrimeVue for tracking user sessions, performance metrics, and errors.

## 🚀 Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **PrimeVue** - UI component library with Lara Light Blue theme
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Query** - Data fetching and caching
- **ECharts** - Interactive charts and visualizations
- **Heatmap.js** - User interaction heatmaps
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Zod** - Runtime type validation
- **Date-fns** - Date manipulation utilities

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── components/          # Reusable Vue components
│   ├── common/          # Generic components
│   ├── charts/          # Chart components
│   ├── sessions/        # Session-related components
│   └── layout/          # Layout components
├── views/               # Page components
├── composables/         # Vue composition functions
├── api/                 # API layer and HTTP clients
├── types/               # TypeScript type definitions
├── router/              # Vue Router configuration
├── App.vue              # Root component
└── main.ts              # Application entry point
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install peer dependencies (if needed):**
   ```bash
   npm install vue@^3.4.21 vue-router@^4.3.0
   ```

## 🔧 Development

### Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

### Type checking:
```bash
npm run type-check
```

## 📱 Features

### Dashboard Overview
- **Key Metrics Cards** - Total sessions, page views, session duration, error rates
- **Interactive Charts** - Session trends, user activity heatmaps
- **Real-time Updates** - Live data with Vue Query

### User Sessions
- **Session Tracking** - Detailed user session information
- **Session Replay** - Visual playback of user interactions
- **Session Analytics** - Duration, page views, user paths

### Performance Monitoring
- **Core Web Vitals** - LCP, FID, CLS monitoring
- **Load Time Analysis** - Page performance metrics
- **Resource Monitoring** - Bundle size and optimization insights

### Error Tracking
- **JavaScript Errors** - Runtime error detection and tracking
- **Network Errors** - Failed requests and API issues
- **Error Categorization** - Severity levels and resolution status

### User Analytics
- **User Behavior** - Interaction patterns and user flows
- **Demographics** - Geographic and device analytics
- **Growth Metrics** - User acquisition and retention

## 🎨 Styling

### Tailwind Configuration
- **Custom Colors**: Primary (#3B82F6), Success (#10B981), Warning (#F59E0B), Danger (#EF4444)
- **Custom Components**: Cards, buttons, form inputs with consistent styling
- **Responsive Design**: Mobile-first approach with breakpoints

### PrimeVue Theme
- **Theme**: Lara Light Blue
- **Icons**: PrimeIcons for consistent iconography
- **Components**: Pre-styled components with custom overrides

## 🔌 API Integration

The app is configured for API integration using:
- **Axios** for HTTP requests
- **Vue Query** for data fetching, caching, and synchronization
- **Zod** for API response validation

Example API service structure:
```typescript
// src/api/dashboard.ts
import { useQuery } from '@tanstack/vue-query'
import { apiClient } from './client'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get('/analytics/dashboard'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

## 🗺️ Routing

The application uses Vue Router with the following structure:
- `/` - Dashboard overview
- `/sessions` - Sessions list
- `/sessions/:id` - Session details
- `/performance` - Performance metrics
- `/errors` - Error logs
- `/users` - User analytics

## 📦 State Management

Pinia stores are organized by domain:
- **User Store** - Authentication and user data
- **Analytics Store** - Dashboard metrics and filters
- **Sessions Store** - Session data and management

## 🚀 Deployment

### Environment Variables
Create a `.env` file for environment-specific configuration:
```env
VITE_API_BASE_URL=https://api.radar-snap.com
VITE_APP_NAME=Radar-Snap
```

### Build and Deploy
```bash
# Build for production
npm run build

# The dist/ folder contains the built application
# Deploy to your preferred hosting service
```

## 🔍 Browser Support

- **Modern Browsers** - Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **ES2020 Features** - Uses modern JavaScript features
- **CSS Grid & Flexbox** - For layout and responsive design

## 📝 Development Guidelines

### Code Style
- Use **Composition API** with `<script setup>` syntax
- Implement **TypeScript** interfaces for all data structures
- Follow **Vue 3 best practices** for component organization
- Use **Tailwind utilities** for styling with custom component classes

### Performance
- **Lazy loading** for route components
- **Vue Query** for efficient data caching
- **Bundle splitting** for optimal loading
- **Tree shaking** for minimal bundle size

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Add TypeScript types for new features
3. Include error handling and loading states
4. Test components across different screen sizes
5. Update this README for new features or changes

## 📄 License

This project is licensed under the MIT License.