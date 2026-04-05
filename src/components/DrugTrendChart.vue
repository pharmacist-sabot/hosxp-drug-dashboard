<template>
<div class="chart-container">
    <div class="chart-header">
        <div v-if="data" class="chart-title">
            <div class="drug-name-title">{{ data.drug_name }}</div>
            <div class="drug-code-title">{{ data.icode }}</div>
        </div>
        <div v-else class="chart-title-empty">เลือกยาจากรายการเพื่อดูกราฟแนวโน้ม</div>

        <div v-if="data" class="chart-total">
            <span class="total-label">รวมทั้งปี</span>
            <span class="total-value">{{ formatQty(data.total_qty) }}</span>
            <span class="total-unit">หน่วย</span>
        </div>
    </div>

    <div v-if="!data && !loading" class="empty-chart">
        <div class="empty-bloom">🌸</div>
        <p>ยังไม่มีข้อมูลกราฟ</p>
        <p class="empty-sub">เลือกรายการยาด้านซ้ายเพื่อแสดงแนวโน้มการจ่ายยา</p>
    </div>

    <div v-else-if="loading" class="loading-chart">
        <div class="loading-bloom">⏳</div>
        <p>กำลังโหลดข้อมูล...</p>
    </div>

    <v-chart v-else ref="chartRef" class="echart" :option="chartOption" :autoresize="true" />
</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from 'echarts/components'
import type { DrugMonthlyData } from '../stores/dashboard'
import { formatQty, THAI_MONTHS_SHORT } from '../utils/ceDate'

use([
    CanvasRenderer,
    BarChart,
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
])

const props = defineProps<{
    data: DrugMonthlyData | null
    loading: boolean
}>()

const chartRef = ref()

const chartOption = computed(() => {
    const monthly = props.data?.monthly_qty ?? Array(12).fill(0)
    const total = props.data?.total_qty ?? 0

    return {
        backgroundColor: 'transparent',
        grid: {
            left: '4%',
            right: '4%',
            top: '16%',
            bottom: '12%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(78,110,47,0.4)',
            borderWidth: 1,
            textStyle: { color: '#4B3621', fontFamily: 'Sarabun' },
            formatter: (params: any[]) => {
                const bar = params.find((p: any) => p.seriesName === 'จำนวนจ่าย')
                const line = params.find((p: any) => p.seriesName === 'แนวโน้ม')
                if (!bar) return ''
                const pct = total > 0 ? ((bar.value / total) * 100).toFixed(1) : '0'
                return `
          <div style="font-weight:600;margin-bottom:6px;">${bar.name}</div>
          <div>จำนวนจ่าย: <b style="color:#4E6E2F">${formatQty(bar.value)}</b> หน่วย</div>
          <div>สัดส่วน: <b style="color:#FF8E7E">${pct}%</b> ของทั้งปี</div>
          ${line ? `<div>แนวโน้ม: <b style="color:#FF8E7E">${formatQty(line.value)}</b></div>` : ''}
        `
            },
        },
        legend: {
            data: ['จำนวนจ่าย', 'แนวโน้ม'],
            top: 0,
            right: 0,
            textStyle: { color: '#7A6248', fontSize: 12 },
            icon: 'roundRect',
        },
        xAxis: {
            type: 'category',
            data: THAI_MONTHS_SHORT,
            axisLabel: {
                color: '#7A6248',
                fontFamily: 'Sarabun',
                fontSize: 13,
            },
            axisLine: { lineStyle: { color: 'rgba(78,110,47,0.15)' } },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#B09880',
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                formatter: (v: number) =>
                    v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v.toString(),
            },
            splitLine: {
                lineStyle: { color: 'rgba(78,110,47,0.08)', type: 'dashed' },
            },
            axisLine: { show: false },
        },
        series: [
            {
                name: 'จำนวนจ่าย',
                type: 'bar',
                data: monthly,
                barMaxWidth: 40,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: '#4E6E2F' },
                            { offset: 1, color: 'rgba(78,110,47,0.25)' },
                        ],
                    },
                    borderRadius: [6, 6, 0, 0],
                },
                emphasis: {
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#7AAD52' },
                                { offset: 1, color: 'rgba(78,110,47,0.4)' },
                            ],
                        },
                    },
                },
                animationDelay: (idx: number) => idx * 60,
            },
            {
                name: 'แนวโน้ม',
                type: 'line',
                data: monthly,
                smooth: true,
                symbol: 'circle',
                symbolSize: 7,
                lineStyle: { color: '#FF8E7E', width: 2.5 },
                itemStyle: {
                    color: '#FF8E7E',
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255,142,126,0.18)' },
                            { offset: 1, color: 'rgba(255,142,126,0)' },
                        ],
                    },
                },
                animationDelay: (idx: number) => idx * 60 + 400,
            },
        ],
        animationEasing: 'elasticOut' as const,
        animationDuration: 800,
    }
})
</script>

<style scoped>
.chart-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px 24px 16px;
    gap: 16px;
}

.chart-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-shrink: 0;
}

.chart-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.drug-name-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
}

.drug-code-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--basil-400);
    font-weight: 600;
}

.chart-title-empty {
    font-size: 15px;
    color: var(--text-muted);
    font-style: italic;
}

.chart-total {
    display: flex;
    align-items: baseline;
    gap: 6px;
    background: var(--basil-50);
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid rgba(78, 110, 47, 0.2);
}

.total-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 600;
}

.total-value {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--basil-400);
}

.total-unit {
    font-size: 12px;
    color: var(--text-secondary);
}

.echart {
    flex: 1;
    min-height: 0;
}

.empty-chart,
.loading-chart {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-muted);
}

.empty-bloom,
.loading-bloom {
    font-size: 52px;
    opacity: 0.4;
}

.empty-sub {
    font-size: 13px;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.6;
}
</style>
