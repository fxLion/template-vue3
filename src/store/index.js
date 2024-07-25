import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export function setupStore(app) {
    const pinia = createPinia()
    pinia.use(createPersistedState())
    app.use(pinia)
}