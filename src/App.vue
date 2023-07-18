<script setup lang="ts">
import { reactive } from 'vue';

import { InitialConditionsInput, InitialConditions, FrequencyAndPhaseInput } from '@/models/InitialConditions';

import Explanation from "./components/Explanation.vue";
import Vizualization from "./components/Vizualization.vue";
import Controls from "./components/Controls.vue";

const initialConditionsInput = new InitialConditionsInput(
  new FrequencyAndPhaseInput("15", "𝝅/2"),
  new FrequencyAndPhaseInput("5", "0")
)
const canvasDimensions = {
  width: 600,
  height: 600
}

const state = reactive({
  initialConditions: null as (null | InitialConditions),
  initialConditionsInput: initialConditionsInput
})

function onConditionsChange(initialConditions: InitialConditions) {
  state.initialConditions = initialConditions;
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
                    <Controls class="mt-10" :initialConditionsInput="state.initialConditionsInput" @change="onConditionsChange"/>
                  </v-row>
              </v-container>
            </v-col>
            <v-col cols="8">
              <Vizualization
                :width="canvasDimensions.width"
                :height="canvasDimensions.height"
                :initialConditions="state.initialConditions || state.initialConditionsInput.parse()" />
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
