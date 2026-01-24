<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="mb-6">
          <v-btn
            variant="text"
            prepend-icon="mdi-arrow-left"
            @click="router.back()"
          >
            Back
          </v-btn>
        </div>

        <v-alert
          v-if="validationErrors.length > 0"
          type="error"
          variant="tonal"
          closable
          class="mb-4"
          @click:close="validationErrors = []"
        >
          <div class="text-subtitle-2 mb-2">Please fix the following errors:</div>
          <ul class="pl-4">
            <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
          </ul>
        </v-alert>

        <CourseForm
          :loading="coursesStore.loading"
          @submit="handleCreate"
          @cancel="router.back()"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import CourseForm from '@/components/CourseForm.vue'

const router = useRouter()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const validationErrors = ref([])

onMounted(() => {
  if (!authStore.isInstructor) {
    router.push('/')
  }
})

const handleCreate = async (courseData) => {
  validationErrors.value = []

  const result = await coursesStore.createCourse(courseData)

  if (result.success) {
    snackbar.value = {
      show: true,
      message: 'Course created successfully!',
      color: 'success'
    }
    setTimeout(() => {
      router.push('/instructor/courses')
    }, 1500)
  } else {
    if (result.details && Array.isArray(result.details)) {
      validationErrors.value = result.details
      snackbar.value = {
        show: true,
        message: 'Please fix validation errors',
        color: 'error'
      }
    } else {
      snackbar.value = {
        show: true,
        message: result.error || 'Failed to create course',
        color: 'error'
      }
    }
  }
}
</script>
