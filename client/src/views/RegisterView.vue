<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('student')
const loading = ref(false)
const error = ref(null)
const showPassword = ref(false)

const displayNameRules = [
  v => !!v || 'Name is required',
  v => v.length >= 3 || 'Name must be at least 3 characters'
]

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters'
]

const confirmPasswordRules = [
  v => !!v || 'Please confirm password',
  v => v === password.value || 'Passwords do not match'
]

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  error.value = null
  loading.value = true

  const result = await authStore.register(
    email.value,
    password.value,
    displayName.value,
    role.value
  )

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }

  loading.value = false
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card elevation="8" class="pa-4">
          <v-card-title class="text-h4 text-center mb-4">
            <v-icon icon="mdi-account-plus" size="large" class="mr-2"></v-icon>
            Create Account
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

            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="displayName"
                label="Full Name"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="displayNameRules"
                :disabled="loading"
                class="mb-2"
              ></v-text-field>

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
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                :rules="confirmPasswordRules"
                :disabled="loading"
                class="mb-4"
              ></v-text-field>

              <v-card variant="outlined" class="mb-4">
                <v-card-text>
                  <p class="text-subtitle-2 mb-3">Select your role:</p>
                  <v-radio-group v-model="role" inline :disabled="loading">
                    <v-radio
                      label="Student (Learn courses)"
                      value="student"
                      color="primary"
                    >
                      <template v-slot:label>
                        <div class="d-flex align-center">
                          <div>
                            <div class="font-weight-bold">Student</div>
                            <div class="text-caption">Enroll and learn from courses</div>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio
                      label="Instructor (Teach courses)"
                      value="instructor"
                      color="success"
                      class="mt-2"
                    >
                      <template v-slot:label>
                        <div class="d-flex align-center">
                          <div>
                            <div class="font-weight-bold">Instructor</div>
                            <div class="text-caption">Create and sell courses</div>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-card-text>
              </v-card>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!displayName || !email || !password || !confirmPassword"
              >
                <v-icon icon="mdi-account-plus" start></v-icon>
                Create Account
              </v-btn>
            </v-form>

            <v-divider class="my-6"></v-divider>

            <div class="text-center">
              <p class="text-body-2 mb-2">Already have an account?</p>
              <v-btn
                color="secondary"
                variant="outlined"
                @click="goToLogin"
                :disabled="loading"
              >
                <v-icon icon="mdi-login" start></v-icon>
                Login
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
