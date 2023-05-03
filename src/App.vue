<script setup lang="ts">
import { InitialConditions, FrequencyAndPhase } from '@/models/InitialConditions';

import Vizualization from "./components/Vizualization.vue";
import Controls from "./components/Controls.vue";
</script>

<script lang="ts">
const initialConditions = new InitialConditions(
  new FrequencyAndPhase(5, Math.PI / 2),
  new FrequencyAndPhase(5, 0)
)
const canvasDimensions = {
  width: 600,
  height: 600
}

export default {
  data() {
    return {
      conditions: initialConditions,
      mathFormulas: {
        motionEquation: `$$
          \\begin{cases}
            x = {A \\cos(\\omega_x t + \\phi_x)}\\\\
            y = {A \\cos(\\omega_y t + \\phi_y)}
          \\end{cases}
          $$`,
        amplitude: `$$ A $$`,
        xFrequency: `$$\\omega_x$$`,
        xPhase: `$$\\phi_x$$`,
        yFrequency: `$$\\omega_y$$`,
        yPhase: `$$\\phi_y$$`,
        time: `$$ t $$`,
      }
    }
  },
  methods: {
    onConditionsChange(updatedConditions: InitialConditions) {
      this.conditions = updatedConditions;
    }
  }
}
</script>

<template>
  <v-layout>
    <v-main>
      <v-container class="controls-and-canvas">
        <v-row>
          <v-col cols="4">
            <v-container>
                <v-row>
                  <v-card
                     class="mx-auto"
                     width="100%"
                     height="300"
                     prepend-icon="mdi-home"
                   >
                     <template v-slot:title>
                       Background Physics and Mathematics
                     </template>
                     <v-card-text>
                       <p><a href="https://en.wikipedia.org/wiki/Lissajous_curve">Lissajous curve</a> is the trajectory of a body oscillating harmonically
                       in two orthogonal directions x and y.</p><br/>
                       <p>The motion equation if the amplitudes in both directions are the same:</p>
                       <vue-mathjax class="block-formula" :formula="mathFormulas.motionEquation" />
                       where <vue-mathjax class="inline-formula" :formula="mathFormulas.amplitude" /> is amplitude,
                       <vue-mathjax class="inline-formula" :formula="mathFormulas.xFrequency" /> and <vue-mathjax class="inline-formula" :formula="mathFormulas.xPhase" />
                       are the frequency and the initial phase of the oscillation along the x axis, and
                       <vue-mathjax class="inline-formula" :formula="mathFormulas.yFrequency" /> and <vue-mathjax class="inline-formula" :formula="mathFormulas.yPhase" />
                       are the frequency and the initial phase of the oscillation along the y axis, and
                       <vue-mathjax class="inline-formula" :formula="mathFormulas.time" /> is time.
                     </v-card-text>
                  </v-card>
                </v-row>
                <v-row>
                  <Controls :initialConditions="conditions" @change="onConditionsChange"/>
                </v-row>
            </v-container>
          </v-col>
          <v-col cols="8">
            <Vizualization
              :width="canvasDimensions.width"
              :height="canvasDimensions.height"
              :initialConditions="conditions" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<style>
.block-formula > .MathJax_Display {
  padding-top: 16px;
  padding-bottom: 16px;
}

.inline-formula > .MathJax_Display {
  display: inline-block !important;
  max-width: 16px;
}
</style>
