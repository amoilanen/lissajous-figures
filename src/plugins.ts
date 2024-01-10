
import { type Plugin } from "vue"
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import VueMathjax from 'vue-mathjax-next'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export function initPlugins(): Array<Plugin> {
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
    return [pinia, vuetify, VueMathjax];
  }