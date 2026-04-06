<template>
<div class="settings-overlay" v-if="show" @click.self="$emit('close')">
    <div class="settings-modal">
        <div class="modal-header">
            <h2><DatabaseIcon :size="20" :stroke-width="2" class="modal-title-icon" /> ตั้งค่าการเชื่อมต่อฐานข้อมูล</h2>
            <button class="close-btn" @click="$emit('close')"><XIcon :size="18" :stroke-width="2" /></button>
        </div>

        <div class="connection-status" :class="dbStore.connected ? 'status-ok' : 'status-err'">
            <CircleCheck v-if="dbStore.connected" :size="16" :stroke-width="2.5" />
            <CircleX v-else :size="16" :stroke-width="2.5" />
            <span>{{ dbStore.connected ? 'เชื่อมต่อสำเร็จ' : 'ยังไม่ได้เชื่อมต่อ' }}</span>
        </div>

        <form @submit.prevent="handleConnect" class="settings-form">
            <div class="form-row">
                <label>Host</label>
                <input v-model="form.host" type="text" placeholder="localhost" />
            </div>
            <div class="form-row">
                <label>Port</label>
                <input v-model.number="form.port" type="number" placeholder="3306" />
            </div>
            <div class="form-row">
                <label>User</label>
                <input v-model="form.user" type="text" placeholder="hosxp_user" autocomplete="username" />
            </div>
            <div class="form-row">
                <label>Password</label>
                <input v-model="form.password" type="password" placeholder="••••••••" autocomplete="current-password" />
            </div>
            <div class="form-row">
                <label>Database</label>
                <input v-model="form.database" type="text" placeholder="hospdb" />
            </div>

            <p class="security-note"><ShieldAlert :size="14" :stroke-width="2" class="note-icon" /> รหัสผ่านถูกเก็บใน localStorage เฉพาะบนเครื่องนี้เท่านั้น</p>

            <div class="form-actions">
                <button type="submit" class="btn-connect" :disabled="dbStore.connecting">
                    <Loader2 v-if="dbStore.connecting" :size="16" :stroke-width="2.5" class="spin" />
                    <Plug v-else :size="16" :stroke-width="2.5" />
                    {{ dbStore.connecting ? 'กำลังเชื่อมต่อ...' : 'ทดสอบการเชื่อมต่อ' }}
                </button>
            </div>

            <div v-if="dbStore.connectionError" class="error-msg">
                {{ dbStore.connectionError }}
            </div>
            <div v-if="successMsg" class="success-msg">
                {{ successMsg }}
            </div>
        </form>
    </div>
</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Database as DatabaseIcon, X as XIcon, CircleCheck, CircleX, ShieldAlert, Plug, Loader2 } from 'lucide-vue-next'
import { useDbConfigStore } from '../stores/dbConfig'

const props = defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const dbStore = useDbConfigStore()
const successMsg = ref('')

const form = reactive({
    host: dbStore.host,
    port: dbStore.port,
    user: dbStore.user,
    password: dbStore.password,
    database: dbStore.database,
})

watch(() => props.show, (val) => {
    if (val) {
        form.host = dbStore.host
        form.port = dbStore.port
        form.user = dbStore.user
        form.password = dbStore.password
        form.database = dbStore.database
        successMsg.value = ''
    }
})

async function handleConnect() {
    successMsg.value = ''
    try {
        await dbStore.connect({ ...form })
        successMsg.value = '✅ เชื่อมต่อสำเร็จ!'
    } catch {
        // error shown via dbStore.connectionError
    }
}
</script>

<style scoped>
.settings-overlay {
    position: fixed;
    inset: 0;
    background: rgba(75, 54, 33, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.settings-modal {
    background: var(--bg-elevated);
    border: 1px solid var(--border-active);
    border-radius: 16px;
    padding: 32px;
    width: 420px;
    box-shadow: 0 8px 40px var(--basil-glow-strong), 0 2px 8px rgba(75, 54, 33, 0.12);
    animation: fadeSlideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 {
    font-family: 'Tahoma', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-title-icon {
    color: var(--basil-400);
    flex-shrink: 0;
}

.close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: color 0.2s, background 0.2s;
}

.close-btn:hover {
    color: var(--text-primary);
    background: var(--basil-50);
}

.connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 600;
}

.status-ok {
    background: rgba(78, 110, 47, 0.1);
    border: 1px solid rgba(78, 110, 47, 0.35);
    color: var(--basil-400);
}

.status-err {
    background: rgba(192, 57, 43, 0.08);
    border: 1px solid rgba(192, 57, 43, 0.25);
    color: var(--chili-400);
}

.settings-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-row label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.07em;
}

.form-row input {
    background: var(--bg-surface);
    border: 1px solid var(--border-card);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text-primary);
    font-family: 'Tahoma', sans-serif;
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
}

.form-row input:focus {
    border-color: var(--basil-400);
    box-shadow: 0 0 0 3px var(--basil-glow);
}

.security-note {
    font-size: 12px;
    color: var(--text-secondary);
    padding: 8px 12px;
    background: rgba(255, 142, 126, 0.08);
    border-radius: 6px;
    border-left: 3px solid var(--shrimp-400);
}

.form-actions {
    display: flex;
    gap: 12px;
}

.btn-connect {
    flex: 1;
    background: linear-gradient(135deg, var(--basil-400), var(--basil-500));
    border: none;
    border-radius: 10px;
    padding: 12px;
    color: #fff;
    font-family: 'Tahoma', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.note-icon {
    flex-shrink: 0;
    vertical-align: middle;
}

.btn-connect:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px var(--basil-glow-strong);
}

.btn-connect:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.error-msg {
    padding: 10px 14px;
    background: rgba(192, 57, 43, 0.08);
    border: 1px solid rgba(192, 57, 43, 0.25);
    border-radius: 8px;
    color: var(--chili-400);
    font-size: 13px;
    line-height: 1.5;
}

.success-msg {
    padding: 10px 14px;
    background: rgba(78, 110, 47, 0.1);
    border: 1px solid rgba(78, 110, 47, 0.3);
    border-radius: 8px;
    color: var(--basil-400);
    font-size: 13px;
    font-weight: 600;
}
</style>
