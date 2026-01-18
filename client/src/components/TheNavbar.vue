<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <v-app-bar color="primary" elevation="2" app>
    <v-app-bar-title class="text-h5 font-weight-bold">
      <v-icon icon="mdi-school" class="mr-2"></v-icon>
      E-Learning Platform
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn @click="navigateTo('/')" variant="text">
      <v-icon icon="mdi-home" class="mr-1"></v-icon>
      Home
    </v-btn>

    <v-btn @click="navigateTo('/courses')" variant="text">
      <v-icon icon="mdi-book-open-variant" class="mr-1"></v-icon>
      Courses
    </v-btn>

    <v-btn @click="navigateTo('/login')" variant="elevated" color="accent" class="ml-2">
      <v-icon icon="mdi-login" class="mr-1"></v-icon>
      Login
    </v-btn>
  </v-app-bar>
</template>
