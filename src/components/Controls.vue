<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { InitialConditions, InitialConditionsInput, FrequencyAndPhase } from '@/models/InitialConditions'

const props = defineProps({
  initialConditionsInput: {
    type: InitialConditionsInput,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'change', conditions: InitialConditions): void
}>()

function numberValidation(value: string): boolean | string {
  if (/[\d\.]+/.test(value))
    return true
  else
    return "Should be a number"
}

const state = reactive({
  areInputsValid: true,
  conditionsInput: props.initialConditionsInput.clone(),
  rules: {
    frequency: [ numberValidation ],
    phase: [ numberValidation ]
  }
})

const controlsForm = ref<HTMLFormElement | null>(null)

onMounted(() => {
  controlsForm.value!.validate()
})

function updateConditions() {
  emit("change", state.conditionsInput.parse());
}
</script>

<template>
  <v-form ref="controlsForm" v-model="state.areInputsValid">
    <v-container class="controls">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="state.conditionsInput.x.phase" :rules="state.rules.phase" label="x initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="state.conditionsInput.x.frequency" :rules="state.rules.frequency" label="x frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="state.conditionsInput.y.phase" :rules="state.rules.phase" label="y initial phase"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="state.conditionsInput.y.frequency" :rules="state.rules.frequency" label="y frequency"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn @click="updateConditions" :disabled="!state.areInputsValid">Draw</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
  .v-form {
    width: 100%;
  }
</style>
