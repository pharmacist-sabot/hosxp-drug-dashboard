import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface DrugMonthlyData {
  icode: string
  drug_name: string
  monthly_qty: number[]
  total_qty: number
}

export interface DrugSummary {
  icode: string
  drug_name: string
  total_qty: number
  peak_month: number
}

export interface DrugItem {
  icode: string
  name: string
}

export const useDashboardStore = defineStore('dashboard', () => {
  const selectedYear = ref(new Date().getFullYear())
  const availableYears = ref<number[]>([])
  const selectedIcode = ref<string | null>(null)
  const topDrugs = ref<DrugSummary[]>([])
  const currentChartData = ref<DrugMonthlyData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setYear(year: number) {
    selectedYear.value = year
  }

  function selectDrug(icode: string) {
    selectedIcode.value = icode
  }

  return {
    selectedYear,
    availableYears,
    selectedIcode,
    topDrugs,
    currentChartData,
    loading,
    error,
    setYear,
    selectDrug,
  }
})
