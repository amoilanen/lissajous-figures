<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>
<script lang="ts">
export default {
  data() {
    return {
      phaseX: 0,
      frequencyX: 10,
      phaseY: 0,
      frequencyY: 10
    }
  }
}
</script>

<template>
  <v-container class="controls">
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="phaseX" label="Phase X"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="frequencyX" label="Frequency X"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="phaseY" label="Phase Y"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="frequencyY" label="Frequency Y"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn>Draw</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>