<script lang="ts">

export default {
  data() {
    return {
      mathFormulas: {
        motionEquation: `$$
          \\begin{cases}
            x = {A \\cos(\\omega_x t + \\phi_x)}\\\\
            y = {A \\cos(\\omega_y t + \\phi_y)}
          \\end{cases}
          $$`,
        amplitude: `$$ A $$`,
        xFrequency: `$$\\omega_x$$`,
        xPhase: `$$\\phi_x$$`,
        yFrequency: `$$\\omega_y$$`,
        yPhase: `$$\\phi_y$$`,
        time: `$$ t $$`,
      }
    }
  }
}
</script>

<template>
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
       <p><a href="https://en.wikipedia.org/wiki/Lissajous_curve">Lissajous curve</a> is the trajectory of a body oscillating harmonically
       in two orthogonal directions x and y.</p><br/>
       <p>The motion equation if the amplitudes in both directions are the same:</p>
       <vue-mathjax class="block-formula" :formula="mathFormulas.motionEquation" />
       where <vue-mathjax class="inline-formula" :formula="mathFormulas.amplitude" /> is amplitude,
       <vue-mathjax class="inline-formula" :formula="mathFormulas.xFrequency" /> and <vue-mathjax class="inline-formula" :formula="mathFormulas.xPhase" />
       are the frequency and the initial phase of the oscillation along the x axis, and
       <vue-mathjax class="inline-formula" :formula="mathFormulas.yFrequency" /> and <vue-mathjax class="inline-formula" :formula="mathFormulas.yPhase" />
       are the frequency and the initial phase of the oscillation along the y axis, and
       <vue-mathjax class="inline-formula" :formula="mathFormulas.time" /> is time.
     </v-card-text>
  </v-card>
</template>

<style scoped>
</style>
