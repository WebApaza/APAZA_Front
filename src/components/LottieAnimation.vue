<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import emptyAnimation from '@/assets/empty.json'
</script>

<template>
  <DotLottieVue style="height: 200px; width: 200px; margin: 0 auto;" autoplay loop :data="emptyAnimation" />
</template>