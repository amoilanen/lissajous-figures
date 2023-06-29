<script setup lang="ts">
import { RawInitialConditions, InitialConditions, FrequencyAndPhaseInput } from '@/models/InitialConditions';

import Explanation from "./components/Explanation.vue";
import Vizualization from "./components/Vizualization.vue";
import Controls from "./components/Controls.vue";
</script>

<script lang="ts">
const rawInitialConditions = new RawInitialConditions(
  new FrequencyAndPhaseInput("15", "𝝅/2"),
  new FrequencyAndPhaseInput("5", "0")
)
const canvasDimensions = {
  width: 600,
  height: 600
}

export default {
  data() {
    return {
      initialConditions: null as (null | InitialConditions),
      rawInitialConditions: rawInitialConditions
    }
  },
  methods: {
    onConditionsChange(initialConditions: InitialConditions) {
      this.initialConditions = initialConditions;
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
                  <Explanation />
                </v-row>
                <v-row>
                  <Controls class="mt-10" :rawInitialConditions="rawInitialConditions" @change="onConditionsChange"/>
                </v-row>
            </v-container>
          </v-col>
          <v-col cols="8">
            <Vizualization
              :width="canvasDimensions.width"
              :height="canvasDimensions.height"
              :initialConditions="initialConditions || rawInitialConditions.parse()" />
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
