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
      conditions: initialConditions
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
            <Controls :initialConditions="conditions" @change="onConditionsChange"/>
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
