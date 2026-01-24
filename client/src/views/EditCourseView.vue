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

        <div v-if="loading" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary" size="64" />
        </div>

        <v-alert v-else-if="error" type="error" variant="tonal">
          {{ error }}
        </v-alert>

        <template v-else-if="course">
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
            :course="course"
            :loading="coursesStore.loading"
            @submit="handleUpdate"
            @cancel="router.back()"
          />
        </template>
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
import { useRouter, useRoute } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import CourseForm from '@/components/CourseForm.vue'

const router = useRouter()
const route = useRoute()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

const course = ref(null)
const loading = ref(true)
const error = ref(null)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const validationErrors = ref([])

onMounted(async () => {
  if (!authStore.isInstructor) {
    router.push('/')
    return
  }

  const courseId = route.params.id
  const fetchedCourse = await coursesStore.fetchCourseById(courseId)

  if (fetchedCourse) {
    if (fetchedCourse.instructor?.id !== authStore.user.uid) {
      error.value = 'You do not have permission to edit this course'
      return
    }
    course.value = fetchedCourse
  } else {
    error.value = 'Course not found'
  }
  loading.value = false
})

const handleUpdate = async (courseData) => {
  validationErrors.value = []

  const result = await coursesStore.updateCourse(route.params.id, courseData)

  if (result.success) {
    snackbar.value = {
      show: true,
      message: 'Course updated successfully!',
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
        message: result.error || 'Failed to update course',
        color: 'error'
      }
    }
  }
}
</script>
