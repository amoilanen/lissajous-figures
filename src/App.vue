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
      formula: '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$'
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
                       <a href="https://en.wikipedia.org/wiki/Lissajous_curve">Lissajous curve</a> is the trajectory of a body oscillating harmonically
                       in two orthogonal directions x and y.
                       <vue-mathjax :formula="formula" />
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

<style scoped>
</style>
