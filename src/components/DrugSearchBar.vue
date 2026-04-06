<template>
<div class="search-bar" ref="containerRef">
    <div class="search-input-wrap">
        <Search :size="15" :stroke-width="2.5" class="search-icon" />
        <input v-model="query" type="text" placeholder="ค้นหายา (รหัส / ชื่อยา)..." @input="onInput"
            @keydown.esc="close" @keydown.down.prevent="highlightNext" @keydown.up.prevent="highlightPrev"
            @keydown.enter.prevent="selectHighlighted" />
        <Loader2 v-if="loading" :size="15" :stroke-width="2.5" class="loading-dot spin" />
        <button v-if="query" class="clear-btn" @click="clearSearch"><X :size="14" :stroke-width="2.5" /></button>
    </div>

    <div v-if="results.length > 0 && open" class="dropdown">
        <button v-for="(drug, i) in results" :key="drug.icode" class="dropdown-item"
            :class="{ highlighted: i === highlightIdx }" @click="selectDrug(drug)" @mouseenter="highlightIdx = i">
            <span class="drug-code">{{ drug.icode }}</span>
            <span class="drug-name">{{ drug.name }}</span>
        </button>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Loader2, X } from 'lucide-vue-next'
import { useDrugData } from '../composables/useDrugData'
import { useDashboardStore } from '../stores/dashboard'
import type { DrugItem } from '../stores/dashboard'

const { searchDrugs, loading } = useDrugData()
const dashStore = useDashboardStore()

const query = ref('')
const results = ref<DrugItem[]>([])
const open = ref(false)
const highlightIdx = ref(0)
const containerRef = ref<HTMLElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout>

function handleOutsideClick(event: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        open.value = false
    }
}

onMounted(() => {
    document.addEventListener('mousedown', handleOutsideClick)
})

onUnmounted(() => {
    document.removeEventListener('mousedown', handleOutsideClick)
})

function onInput() {
    clearTimeout(debounceTimer)
    open.value = false
    if (!query.value.trim()) {
        results.value = []
        return
    }
    debounceTimer = setTimeout(async () => {
        results.value = await searchDrugs(query.value)
        highlightIdx.value = 0
        open.value = results.value.length > 0
    }, 300)
}

function selectDrug(drug: DrugItem) {
    dashStore.selectDrug(drug.icode)
    query.value = `${drug.icode} — ${drug.name}`
    open.value = false
}

function clearSearch() {
    query.value = ''
    results.value = []
    open.value = false
}

function close() {
    open.value = false
}

function highlightNext() {
    if (highlightIdx.value < results.value.length - 1) highlightIdx.value++
}
function highlightPrev() {
    if (highlightIdx.value > 0) highlightIdx.value--
}
function selectHighlighted() {
    if (results.value[highlightIdx.value]) {
        selectDrug(results.value[highlightIdx.value])
    }
}
</script>

<style scoped>
.search-bar {
    position: relative;
    flex: 1;
    max-width: 400px;
}

.search-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-card);
    border-radius: 10px;
    padding: 8px 14px;
    box-shadow: 0 1px 4px rgba(75, 54, 33, 0.08);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input-wrap:focus-within {
    border-color: var(--basil-400);
    box-shadow: 0 0 0 3px var(--basil-glow);
}

.search-icon {
    font-size: 14px;
}

.search-input-wrap input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: 'Tahoma', sans-serif;
    font-size: 14px;
}

.search-input-wrap input::placeholder {
    color: var(--text-muted);
}

.clear-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 4px;
}

.clear-btn:hover {
    color: var(--chili-400);
}

.dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: var(--bg-elevated);
    border: 1px solid var(--border-active);
    border-radius: 10px;
    overflow: hidden;
    z-index: 100;
    box-shadow: 0 8px 32px rgba(75, 54, 33, 0.15);
    max-height: 280px;
    overflow-y: auto;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    color: var(--text-primary);
    text-align: left;
    cursor: pointer;
    transition: background 0.15s;
}

.dropdown-item:hover,
.dropdown-item.highlighted {
    background: var(--basil-50);
}

.drug-code {
    font-family: 'Tahoma', sans-serif;
    font-size: 12px;
    color: var(--basil-400);
    white-space: nowrap;
    min-width: 80px;
    font-weight: 600;
}

.drug-name {
    font-size: 13px;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
