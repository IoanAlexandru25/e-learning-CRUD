<script setup>
import { ref, onMounted } from 'vue'
import CourseCard from '../components/CourseCard.vue'

const featuredCourses = ref([])
const loading = ref(false)

onMounted(async () => {
  await fetchFeaturedCourses()
})

const fetchFeaturedCourses = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/courses')
    if (response.ok) {
      const allCourses = await response.json()
      const sortedCourses = allCourses.sort((a, b) => {

        if (a.metadata?.featured && !b.metadata?.featured) return -1
        if (!a.metadata?.featured && b.metadata?.featured) return 1

        const ratingDiff = (b.metadata?.avgRating || 0) - (a.metadata?.avgRating || 0)
        if (ratingDiff !== 0) return ratingDiff

        return (b.metadata?.enrollments || 0) - (a.metadata?.enrollments || 0)
      })
      featuredCourses.value = sortedCourses.slice(0, 8)
    }
  } catch (error) {
    console.error('Error fetching featured courses:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container fluid>
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card color="primary" variant="elevated" class="pa-8">
          <v-card-title class="text-h3 text-white font-weight-bold text-center">
            Welcome to E-Learning Platform
          </v-card-title>
          <v-card-subtitle class="text-h6 text-white text-center mt-4">
            Discover thousands of courses and enhance your skills
          </v-card-subtitle>
          <v-card-actions class="justify-center mt-6">
            <v-btn
              size="x-large"
              color="accent"
              variant="elevated"
              prepend-icon="mdi-rocket-launch"
            >
              Start Learning Today
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-star" color="warning" class="mr-2"></v-icon>
          Featured Courses
        </h2>
        <v-divider class="mb-6"></v-divider>
      </v-col>
    </v-row>

    <v-row v-if="loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-h6 mt-4">Loading featured courses...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="featuredCourses.length > 0">
      <v-col
        v-for="course in featuredCourses"
        :key="course.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <CourseCard :course="course" />
      </v-col>
    </v-row>

    <v-row v-else class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon icon="mdi-book-off" size="100" color="grey"></v-icon>
        <p class="text-h5 mt-4">No courses available yet</p>
        <p class="text-body-1 text-grey">
          Check back later for new courses!
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-12 mb-8">
      <v-col cols="12">
        <v-card color="grey-lighten-4" variant="flat">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3" class="text-center">
                <v-icon icon="mdi-book-open-page-variant" size="48" color="primary"></v-icon>
                <div class="text-h4 font-weight-bold mt-2">1,000+</div>
                <div class="text-body-1">Courses</div>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="text-center">
                <v-icon icon="mdi-account-group" size="48" color="success"></v-icon>
                <div class="text-h4 font-weight-bold mt-2">50,000+</div>
                <div class="text-body-1">Students</div>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="text-center">
                <v-icon icon="mdi-certificate" size="48" color="warning"></v-icon>
                <div class="text-h4 font-weight-bold mt-2">25,000+</div>
                <div class="text-body-1">Certificates</div>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="text-center">
                <v-icon icon="mdi-star" size="48" color="error"></v-icon>
                <div class="text-h4 font-weight-bold mt-2">4.8/5</div>
                <div class="text-body-1">Average Rating</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
