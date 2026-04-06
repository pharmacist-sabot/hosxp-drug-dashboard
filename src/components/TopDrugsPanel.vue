<template>
<div class="top-panel">
    <div class="panel-header">
        <h3><Trophy :size="15" :stroke-width="2.5" class="header-icon" /> Top {{ drugs.length || 10 }} ยาจ่ายสูงสุด</h3>
        <span class="year-badge">{{ selectedYear + 543 }}</span>
    </div>

    <div v-if="loading" class="skeleton-list">
        <div v-for="i in 10" :key="i" class="skeleton-row" :style="`animation-delay: ${i * 0.05}s`" />
    </div>

    <div v-else-if="!drugs.length" class="empty-state">
        <div class="empty-icon"><DatabaseZap :size="40" :stroke-width="1.5" /></div>
        <p>ยังไม่มีข้อมูล<br />กรุณาเชื่อมต่อฐานข้อมูล</p>
    </div>

    <div v-else class="drug-list">
        <button v-for="(drug, idx) in drugs" :key="drug.icode" class="drug-row"
            :class="{ active: dashStore.selectedIcode === drug.icode }" @click="selectDrug(drug.icode)">
            <div class="drug-rank"
                :style="idx === 0 ? 'color:#7B5800' : idx === 1 ? 'color:#666666' : idx === 2 ? 'color:#A0522D' : ''">{{
                    idx + 1 }}</div>
            <div class="drug-info">
                <div class="drug-name">{{ drug.drug_name }}</div>
                <div class="drug-code">{{ drug.icode }}</div>
                <div class="mini-bar-track">
                    <div class="mini-bar-fill" :style="`width: ${maxQty > 0 ? (drug.total_qty / maxQty) * 100 : 0}%`" />
                </div>
            </div>
            <div class="drug-qty">{{ formatQty(drug.total_qty) }}</div>
        </button>
    </div>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Trophy, DatabaseZap } from 'lucide-vue-next'
import { useDashboardStore } from '../stores/dashboard'
import type { DrugSummary } from '../stores/dashboard'
import { formatQty } from '../utils/ceDate'

const props = defineProps<{
    drugs: DrugSummary[]
    loading: boolean
}>()

const dashStore = useDashboardStore()

const selectedYear = computed(() => dashStore.selectedYear)

const maxQty = computed(() => {
    if (!props.drugs.length) return 1
    return Math.max(...props.drugs.map((d) => d.total_qty))
})

function selectDrug(icode: string) {
    dashStore.selectDrug(icode)
}


</script>

<style scoped>
.top-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border-card);
    flex-shrink: 0;
}

.panel-header h3 {
    font-family: 'Tahoma', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 6px;
}

.header-icon {
    color: var(--basil-400);
    flex-shrink: 0;
}

.year-badge {
    font-family: 'Tahoma', sans-serif;
    font-size: 12px;
    background: var(--basil-50);
    color: var(--basil-400);
    padding: 3px 9px;
    border-radius: 20px;
    border: 1px solid rgba(78, 110, 47, 0.25);
    font-weight: 600;
}

.drug-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.drug-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid transparent;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
}

.drug-row:hover {
    background: var(--basil-50);
    border-color: var(--border-subtle);
}

.drug-row.active {
    background: linear-gradient(135deg, var(--basil-50), #EFF5E6);
    border-color: rgba(78, 110, 47, 0.4);
    box-shadow: 0 2px 12px var(--basil-glow);
}

.drug-rank {
    font-family: 'Tahoma', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--text-muted);
    width: 24px;
    text-align: center;
    flex-shrink: 0;
}

.drug-row.active .drug-rank {
    color: var(--basil-400);
}

.drug-info {
    flex: 1;
    min-width: 0;
}

.drug-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 2px;
}

.drug-code {
    font-family: 'Tahoma', sans-serif;
    font-size: 10px;
    color: var(--text-muted);
    margin-bottom: 5px;
}

.mini-bar-track {
    height: 3px;
    background: rgba(78, 110, 47, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.mini-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--basil-400), var(--shrimp-400));
    border-radius: 2px;
    transition: width 0.6s ease;
}

.drug-qty {
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    color: var(--basil-400);
    white-space: nowrap;
    flex-shrink: 0;
    font-weight: 600;
}

/* Skeleton */
.skeleton-list {
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skeleton-row {
    height: 64px;
    border-radius: 10px;
    background: linear-gradient(90deg,
            var(--bg-surface) 25%,
            var(--basil-50) 50%,
            var(--bg-surface) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-muted);
    text-align: center;
    padding: 24px;
}

.empty-icon {
    color: var(--text-muted);
    opacity: 0.4;
}
</style>
