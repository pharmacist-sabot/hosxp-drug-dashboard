<template>
<div class="kpi-bar">
    <div class="kpi-card" style="animation-delay: 0s">
        <div class="kpi-icon kpi-icon--pill">
            <Pill :size="24" :stroke-width="2" />
        </div>
        <div class="kpi-body">
            <div class="kpi-label">ยอดจ่ายยารวม</div>
            <div class="kpi-value">{{ formatQty(totalQty) }}</div>
            <div class="kpi-unit">หน่วย</div>
        </div>
    </div>

    <div class="kpi-divider" />

    <div class="kpi-card" style="animation-delay: 0.1s">
        <div class="kpi-icon kpi-icon--flask">
            <FlaskConical :size="24" :stroke-width="2" />
        </div>
        <div class="kpi-body">
            <div class="kpi-label">รายการยาที่จ่าย</div>
            <div class="kpi-value">{{ activeDrugs.toLocaleString() }}</div>
            <div class="kpi-unit">รายการ</div>
        </div>
    </div>

    <div class="kpi-divider" />

    <div class="kpi-card" style="animation-delay: 0.2s">
        <div class="kpi-icon kpi-icon--calendar">
            <CalendarRange :size="24" :stroke-width="2" />
        </div>
        <div class="kpi-body">
            <div class="kpi-label">เดือนที่จ่ายสูงสุด</div>
            <div class="kpi-value peak-month">{{ peakMonthName }}</div>
            <div class="kpi-unit">ปี {{ selectedYear + 543 }}</div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pill, FlaskConical, CalendarRange } from 'lucide-vue-next'
import { useDashboardStore } from '../stores/dashboard'
import { formatQty, THAI_MONTHS_FULL } from '../utils/ceDate'

const dashStore = useDashboardStore()

const selectedYear = computed(() => dashStore.selectedYear)

const totalQty = computed(() => {
    return dashStore.topDrugs.reduce((sum, d) => sum + d.total_qty, 0)
})

const activeDrugs = computed(() => dashStore.topDrugs.length)

const peakMonthName = computed(() => {
    if (!dashStore.topDrugs.length) return '—'

    // Aggregate monthly qty across all top drugs
    const monthly = Array(12).fill(0)
    dashStore.topDrugs.forEach(d => {
        if (d.peak_month >= 1 && d.peak_month <= 12) {
            // Use peak_month as a vote
            monthly[d.peak_month - 1]++
        }
    })
    const peakIdx = monthly.indexOf(Math.max(...monthly))
    return THAI_MONTHS_FULL[peakIdx] ?? '—'
})
</script>

<style scoped>
.kpi-bar {
    display: flex;
    align-items: stretch;
    background: var(--bg-elevated);
    border: 1px solid var(--border-card);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(75, 54, 33, 0.08);
}

.kpi-card {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    padding: 20px 24px;
    animation: fadeSlideUp 0.4s ease forwards;
    opacity: 0;
    transition: background 0.2s;
}

.kpi-card:hover {
    background: var(--basil-50);
}

.kpi-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    flex-shrink: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kpi-card:hover .kpi-icon {
    transform: scale(1.08);
}

.kpi-icon--pill {
    background: linear-gradient(135deg, rgba(78, 110, 47, 0.12), rgba(78, 110, 47, 0.04));
    color: var(--basil-400);
    box-shadow: 0 2px 8px rgba(78, 110, 47, 0.15);
}

.kpi-icon--flask {
    background: linear-gradient(135deg, rgba(255, 142, 126, 0.15), rgba(255, 142, 126, 0.05));
    color: var(--shrimp-500);
    box-shadow: 0 2px 8px rgba(255, 107, 87, 0.12);
}

.kpi-icon--calendar {
    background: linear-gradient(135deg, rgba(122, 98, 72, 0.12), rgba(122, 98, 72, 0.04));
    color: var(--text-secondary);
    box-shadow: 0 2px 8px rgba(122, 98, 72, 0.1);
}

.kpi-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.kpi-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.kpi-value {
    font-family: 'Tahoma', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--basil-400);
    line-height: 1;
}

.peak-month {
    font-size: 20px;
}

.kpi-unit {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
}

.kpi-divider {
    width: 1px;
    align-self: stretch;
    margin: 12px 0;
    background: var(--border-card);
    flex-shrink: 0;
}
</style>
