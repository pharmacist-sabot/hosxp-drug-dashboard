import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { invoke } from '@tauri-apps/api/core'

export interface DbConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

const STORAGE_KEY = 'hosxp_db_config'

export const useDbConfigStore = defineStore('dbConfig', () => {
  const host = ref('localhost')
  const port = ref(3306)
  const user = ref('')
  const password = ref('')
  const database = ref('hospdb')
  const connected = ref(false)
  const connecting = ref(false)
  const connectionError = ref<string | null>(null)

  const config = computed<DbConfig>(() => ({
    host: host.value,
    port: port.value,
    user: user.value,
    password: password.value,
    database: database.value,
  }))

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<DbConfig>
        if (saved.host) host.value = saved.host
        if (saved.port) port.value = saved.port
        if (saved.user) user.value = saved.user
        if (saved.password) password.value = saved.password
        if (saved.database) database.value = saved.database
      }
    } catch { }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
  }

  async function connect(cfg?: Partial<DbConfig>) {
    if (cfg) {
      if (cfg.host !== undefined) host.value = cfg.host
      if (cfg.port !== undefined) port.value = cfg.port
      if (cfg.user !== undefined) user.value = cfg.user
      if (cfg.password !== undefined) password.value = cfg.password
      if (cfg.database !== undefined) database.value = cfg.database
    }

    connecting.value = true
    connectionError.value = null
    try {
      await invoke('connect_db', { config: config.value })
      connected.value = true
      saveToStorage()
    } catch (e) {
      connected.value = false
      connectionError.value = String(e)
      throw e
    } finally {
      connecting.value = false
    }
  }

  function disconnect() {
    connected.value = false
  }

  // Auto-connect on startup if config saved
  async function initFromStorage() {
    loadFromStorage()
    if (host.value && user.value) {
      try {
        await connect()
      } catch {
        // silent — user needs to fix settings
      }
    }
  }

  return {
    host, port, user, password, database,
    connected, connecting, connectionError,
    config, connect, disconnect, initFromStorage,
  }
})
