<script setup>
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <v-app>
    <TheNavbar />

    <v-main>
      <RouterView />
    </v-main>

    <TheFooter />
  </v-app>
</template>
