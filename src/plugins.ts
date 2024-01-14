
import { type Plugin } from "vue"
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import VueMathjax from 'vue-mathjax-next'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export function initVuetify(): Plugin {
  return createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light'
    },
    icons: {
      defaultSet: 'mdi'
    }
  })
}

export function initVueMathjax(): Plugin {
  return VueMathjax;
}

export function initPlugins(): Array<Plugin> {
    const pinia = createPinia()
    return [pinia, initVuetify(), initVueMathjax()];
  }