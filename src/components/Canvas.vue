<script setup lang="ts">
import { InitialConditions } from '@/models/InitialConditions';

const props = defineProps({
  initialConditions: {
    type: InitialConditions,
    required: true
  }
});
</script>

<script lang="ts">
import { toRaw } from 'vue';

export default {
  methods: {
    canvasKey() {
      const key = JSON.stringify(this.initialConditions);
      console.log(key);
      this.$forceUpdate();
      return key;
    },
    render() {
      console.log(`Render with properties ${this.initialConditions}`)
      const canvas = document.getElementById('oscillator-plane') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, 600, 600)
        ctx.beginPath();
        ctx.moveTo(75, 50);
        ctx.lineTo(100, 75);
        ctx.lineTo(100, 25);
        ctx.fill();
      }
    }
  },
  watch: {
    initialConditions: function(newVal, oldVal) {
      this.render();
    }
  }
}
</script>

<template>
  <v-container class="canvas">
    <v-row cols="12">
      <canvas :key="canvasKey()" id="oscillator-plane" width="600" height="600"></canvas>
    </v-row>
    <v-row cols="12">
      <span class="text-h6">{{initialConditions}}</span>
    </v-row>
  </v-container>
</template>

<style scoped>
  #oscillator-plane {
    border: 1px solid;
  }
</style>
