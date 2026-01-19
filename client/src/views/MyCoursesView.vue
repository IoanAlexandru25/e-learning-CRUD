<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const enrollments = ref([])
const loading = ref(false)

onMounted(async () => {
  if (authStore.user) {
    await fetchMyEnrollments()
  }
})

const fetchMyEnrollments = async () => {
  loading.value = true
  try {
    const token = await authStore.getAuthToken()
    const response = await fetch(
      `http://localhost:3000/api/enrollments/student/${authStore.user.uid}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    if (response.ok) {
      enrollments.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching enrollments:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">
          <v-icon icon="mdi-book-multiple" color="primary" class="mr-2"></v-icon>
          My Courses
        </h1>
        <p class="text-h6 text-grey mt-2">
          Continue learning from your enrolled courses
        </p>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="enrollments.length === 0">
      <v-col cols="12" class="text-center">
        <v-icon icon="mdi-book-off-outline" size="100" color="grey"></v-icon>
        <p class="text-h5 mt-4">No courses enrolled yet</p>
        <v-btn color="primary" to="/courses" class="mt-4">
          Browse Courses
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="enrollment in enrollments" :key="enrollment.id" cols="12" md="6">
        <v-card>
          <v-card-title>{{ enrollment.courseName }}</v-card-title>
          <v-card-subtitle>by {{ enrollment.instructorName }}</v-card-subtitle>
          <v-card-text>
            <v-progress-linear
              :model-value="enrollment.progress"
              color="primary"
              height="20"
              class="mb-2"
            >
              <strong>{{ enrollment.progress }}%</strong>
            </v-progress-linear>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="elevated">Continue Learning</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
