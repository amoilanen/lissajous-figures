<script setup lang="ts">
import Canvas from "./components/Canvas.vue";
import Controls from "./components/Controls.vue";
</script>

<template>
  <v-layout>
    <v-main>
      <v-container class="controls-and-canvas">
        <v-row>
          <v-col cols="4">
            <Controls />
          </v-col>
          <v-col cols="8">
            <Canvas msg="Under construction..." />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<style scoped>
</style>
