/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'heatmap.js' {
  interface HeatmapConfig {
    container: HTMLElement
    backgroundColor?: string
    gradient?: Record<string, string>
    radius?: number
    opacity?: number
    maxOpacity?: number
    minOpacity?: number
    blur?: number
  }

  interface HeatmapData {
    x: number
    y: number
    value: number
  }

  interface Heatmap {
    addData(data: HeatmapData | HeatmapData[]): void
    setData(data: { data: HeatmapData[] }): void
    setDataMax(max: number): void
    setDataMin(min: number): void
    configure(config: Partial<HeatmapConfig>): void
    getValueAt(point: { x: number; y: number }): number
    getData(): { data: HeatmapData[] }
    getDataURL(): string
    repaint(): void
  }

  function create(config: HeatmapConfig): Heatmap
  export = { create }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}