<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const navigateTo = (path) => {
  router.push(path)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <v-app-bar color="primary" elevation="2" app>
    <v-app-bar-title class="text-h5 font-weight-bold" style="cursor: pointer" @click="navigateTo('/')">
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

    <!-- Not authenticated -->
    <template v-if="!authStore.isAuthenticated">
      <v-btn @click="navigateTo('/register')" variant="text">
        <v-icon icon="mdi-account-plus" class="mr-1"></v-icon>
        Register
      </v-btn>
      <v-btn @click="navigateTo('/login')" variant="elevated" color="accent" class="ml-2">
        <v-icon icon="mdi-login" class="mr-1"></v-icon>
        Login
      </v-btn>
    </template>
    
    <template v-else>
      <v-btn v-if="authStore.isStudent" @click="navigateTo('/my-courses')" variant="text">
        <v-icon icon="mdi-book-multiple" class="mr-1"></v-icon>
        My Courses
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" class="ml-2">
            <v-avatar size="32" color="accent" class="mr-2">
              <span class="text-h6">{{ authStore.user?.displayName?.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            {{ authStore.user?.displayName }}
            <v-icon icon="mdi-chevron-down" class="ml-1"></v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title class="text-caption text-grey">
              {{ authStore.user?.email }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-chip
              :color="authStore.isInstructor ? 'success' : 'primary'"
              size="small"
              variant="flat"
            >
              <v-icon
                :icon="authStore.isInstructor ? 'mdi-teach' : 'mdi-school'"
                start
                size="small"
              ></v-icon>
              {{ authStore.userRole }}
            </v-chip>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-if="authStore.isStudent" @click="navigateTo('/my-courses')">
            <template v-slot:prepend>
              <v-icon icon="mdi-book-multiple"></v-icon>
            </template>
            <v-list-item-title>My Courses</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="authStore.isInstructor" @click="navigateTo('/my-courses')">
            <template v-slot:prepend>
              <v-icon icon="mdi-book-edit"></v-icon>
            </template>
            <v-list-item-title>Manage Courses</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout" color="error"></v-icon>
            </template>
            <v-list-item-title class="text-error">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>
