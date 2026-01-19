<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const showPassword = ref(false)

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters'
]

const handleLogin = async () => {
  error.value = null
  loading.value = true

  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }

  loading.value = false
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="pa-4">
          <v-card-title class="text-h4 text-center mb-4">
            <v-icon icon="mdi-login" size="large" class="mr-2"></v-icon>
            Login
          </v-card-title>

          <v-card-text>
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
              @click:close="error = null"
            >
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="emailRules"
                :disabled="loading"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :rules="passwordRules"
                :disabled="loading"
                class="mb-4"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!email || !password"
              >
                <v-icon icon="mdi-login" start></v-icon>
                Login
              </v-btn>
            </v-form>

            <v-divider class="my-6"></v-divider>

            <div class="text-center">
              <p class="text-body-2 mb-2">Don't have an account?</p>
              <v-btn
                color="secondary"
                variant="outlined"
                @click="goToRegister"
                :disabled="loading"
              >
                <v-icon icon="mdi-account-plus" start></v-icon>
                Create Account
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
