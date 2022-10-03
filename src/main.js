import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locales/i18n'
import mitt from 'mitt'
import './assets/main.css'

const emitter = mitt()

const app = createApp(App)

app.config.globalProperties.appName = 'Weather'

app.use(i18n)

app.use(router)

app.config.globalProperties.emitter = emitter

app.mount('#app')