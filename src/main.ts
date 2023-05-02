import { createApp } from "vue";
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import VueMathjax from 'vue-mathjax-next';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import App from "./App.vue";
import "./assets/main.css";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light'
    }
  });

createApp(App)
  .use(VueMathjax)
  .use(vuetify)
  .mount("#app");
