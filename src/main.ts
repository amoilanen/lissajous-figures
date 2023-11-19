import '@mdi/font/css/materialdesignicons.css'

import { createApp } from "vue"
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import VueMathjax from 'vue-mathjax-next'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from "./App.vue"
import "./assets/main.css"

const pinia = createPinia()
const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light'
    },
    icons: {
      defaultSet: 'mdi'
    }
  })

createApp(App)
  .use(VueMathjax)
  .use(vuetify)
  .use(pinia)
  .mount("#app")
