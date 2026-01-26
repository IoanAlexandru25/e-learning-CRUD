<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEnrollmentsStore } from '@/stores/enrollments'

const enrollmentsStore = useEnrollmentsStore()
const { myEnrollments, loading, error } = storeToRefs(enrollmentsStore)

onMounted(async () => {
  if (myEnrollments.value.length === 0) {
    await enrollmentsStore.fetchMyEnrollments()
  }
})
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
      <v-col cols="12" class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="text-h6 mt-4">Loading your courses...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
       <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          prominent
        >
          <v-alert-title>Error loading your courses</v-alert-title>
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="myEnrollments.length === 0">
      <v-col cols="12" class="text-center">
        <v-icon icon="mdi-book-off-outline" size="100" color="grey"></v-icon>
        <p class="text-h5 mt-4">No courses enrolled yet</p>
        <v-btn color="primary" to="/courses" class="mt-4">
          Browse Courses
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="enrollment in myEnrollments" :key="enrollment.id" cols="12" md="6">
        <v-card>
          <v-card-title>{{ enrollment.courseName }}</v-card-title>
          <v-card-subtitle>by {{ enrollment.instructorName }}</v-card-subtitle>
          <v-card-text>
            <v-progress-linear
              :model-value="enrollment.progress"
              color="primary"
              height="20"
              class="mb-2"
              rounded
            >
              <strong class="text-white">{{ Math.round(enrollment.progress) }}%</strong>
            </v-progress-linear>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="elevated" :to="`/courses/${enrollment.courseId}`">Continue Learning</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
