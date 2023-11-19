<script setup lang="ts">
import Explanation from "./components/Explanation.vue";
import Visualization from "./components/Visualization.vue";
import Controls from "./components/Controls.vue";

const canvasDimensions = {
  width: 600,
  height: 600
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
                    <Controls class="mt-10" />
                  </v-row>
              </v-container>
            </v-col>
            <v-col cols="8">
              <Visualization
                :width="canvasDimensions.width"
                :height="canvasDimensions.height" />
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
