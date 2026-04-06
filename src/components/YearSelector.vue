<template>
<div class="year-selector">
    <label>ปี พ.ศ.</label>
    <select v-model="selectedCeYear" @change="onYearChange" class="year-select">
        <option v-for="year in displayYears" :key="year" :value="year">
            {{ year + 543 }} ({{ year }})
        </option>
    </select>
</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDashboardStore } from '../stores/dashboard'

const dashStore = useDashboardStore()

const selectedCeYear = ref(dashStore.selectedYear)

const displayYears = computed(() => {
    return dashStore.availableYears.length
        ? dashStore.availableYears
        : [new Date().getFullYear()]
})

watch(() => dashStore.selectedYear, (val) => {
    selectedCeYear.value = val
})

watch(() => dashStore.availableYears, (years) => {
    if (years.length && !years.includes(selectedCeYear.value)) {
        selectedCeYear.value = years[0]
    }
})

function onYearChange() {
    dashStore.setYear(selectedCeYear.value)
}
</script>

<style scoped>
.year-selector {
    display: flex;
    align-items: center;
    gap: 10px;
}

.year-selector label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.92);
    white-space: nowrap;
}

.year-select {
    background: var(--bg-elevated);
    border: 1px solid var(--border-card);
    border-radius: 8px;
    padding: 8px 32px 8px 14px;
    color: var(--text-primary);
    font-family: 'Tahoma', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234E6E2F' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    box-shadow: 0 1px 4px rgba(75, 54, 33, 0.08);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.year-select:focus,
.year-select:hover {
    border-color: var(--basil-300);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}
</style>
