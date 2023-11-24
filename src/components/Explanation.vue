<script setup lang="ts">
  const mathFormulas = {
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
  };
</script>

<template>
  <v-card
     class="mx-auto"
     width="100%"
     height="300"
     prepend-icon="mdi-atom"
   >
     <template v-slot:title>
       Background Physics and Mathematics
     </template>
     <v-card-text>
       <p><a href="https://en.wikipedia.org/wiki/Lissajous_curve">Lissajous curve</a> is a trajectory of a body oscillating harmonically
       in two orthogonal directions x and y.</p><br/>
       <p>The motion equations if the amplitudes in both directions are the same:</p>
       <vue-mathjax class="block-formula" :formula="mathFormulas.motionEquation" />
       where <vue-mathjax class="inline-formula" :formula="mathFormulas.amplitude" /> is amplitude,
       <vue-mathjax class="inline-formula" :formula="mathFormulas.xFrequency" /> and <vue-mathjax class="inline-formula" :formula="mathFormulas.xPhase" />
       are the frequency and the initial phase of the oscillation along the x axis, and
       <vue-mathjax class="inline-formula" :formula="mathFormulas.yFrequency" /> and <vue-mathjax class="inline-formula" :formula="mathFormulas.yPhase" />
       are the frequency and the initial phase of the oscillation along the y axis, and <vue-mathjax class="inline-formula" :formula="mathFormulas.time" /> is time.
     </v-card-text>
  </v-card>
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
