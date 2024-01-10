import '@mdi/font/css/materialdesignicons.css'
import "./assets/main.css"

import { createApp } from "vue"
import App from "./App.vue"
import { initPlugins } from '@/plugins'

const app = initPlugins().reduceRight((app, plugin) => app.use(plugin), createApp(App))
app.mount("#app")