<script setup lang="ts">
import { reactive } from 'vue';

import type { InitialConditions } from '@/models/InitialConditions';

import Explanation from "./components/Explanation.vue";
import Vizualization from "./components/Vizualization.vue";
import Controls from "./components/Controls.vue";

const canvasDimensions = {
  width: 600,
  height: 600
}

const state = reactive({
  timeSpeed: 1, //TODO: Move the default speed value definition to Controls
  initialConditions: undefined as (undefined | InitialConditions)
})

function onConditionsChange(initialConditions: InitialConditions) {
  state.initialConditions = initialConditions
}

function onTimeSpeedChange(timeSpeed: number) {
  state.timeSpeed = timeSpeed
}
</script>

<template>
  <v-app>
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
                    <Controls class="mt-10"
                      @conditionsChange="onConditionsChange"
                      @timeSpeedChange="onTimeSpeedChange"
                    />
                  </v-row>
              </v-container>
            </v-col>
            <v-col cols="8">
              <Vizualization
                :width="canvasDimensions.width"
                :height="canvasDimensions.height"
                :timeSpeed="state.timeSpeed"
                :initialConditions="state.initialConditions" />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
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
