import { invoke } from '@tauri-apps/api/core'
import { ref } from 'vue'
import type { DrugMonthlyData, DrugSummary, DrugItem } from '../stores/dashboard'

export interface DashboardBundle {
  years: number[]
  top_drugs: DrugSummary[]
}

export function useDrugData() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function run<T>(fn: () => Promise<T>): Promise<T | null> {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e) {
      error.value = String(e)
      return null
    } finally {
      loading.value = false
    }
  }

  /** Single IPC call — fetches available years + top drugs concurrently on the Rust side */
  async function fetchDashboardData(year: number, topLimit = 10): Promise<DashboardBundle> {
    const result = await run(() =>
      invoke<DashboardBundle>('get_dashboard_data', { year, topLimit })
    )
    return result ?? { years: [], top_drugs: [] }
  }

  async function fetchTopDrugs(year: number, limit = 10): Promise<DrugSummary[]> {
    return (await run(() => invoke<DrugSummary[]>('get_top_drugs', { year, limit }))) ?? []
  }

  async function fetchDrugMonthly(year: number, icode: string): Promise<DrugMonthlyData | null> {
    const result = await run(() =>
      invoke<DrugMonthlyData[]>('get_drug_monthly_qty', { year, icode })
    )
    return result?.[0] ?? null
  }

  async function fetchAvailableYears(): Promise<number[]> {
    return (await run(() => invoke<number[]>('get_available_years'))) ?? []
  }

  async function searchDrugs(query: string): Promise<DrugItem[]> {
    if (!query.trim()) return []
    return (await run(() => invoke<DrugItem[]>('get_drug_list', { search: query }))) ?? []
  }

  return { loading, error, fetchDashboardData, fetchTopDrugs, fetchDrugMonthly, fetchAvailableYears, searchDrugs }
}
