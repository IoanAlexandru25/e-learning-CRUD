<script setup>
import { ref, onMounted } from 'vue'
import CourseCard from '../components/CourseCard.vue'

const courses = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = ref(['All', 'Development', 'Design', 'Business', 'Marketing', 'IT & Software'])

onMounted(async () => {
  await fetchCourses()
})

const fetchCourses = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('http://localhost:3000/api/courses')
    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }
    courses.value = await response.json()
  } catch (err) {
    error.value = err.message
    console.error('Error fetching courses:', err)
  } finally {
    loading.value = false
  }
}

const filteredCourses = ref([])
filteredCourses.value = courses.value
</script>

<template>
  <v-container fluid>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">
          <v-icon icon="mdi-school" color="primary" class="mr-2"></v-icon>
          All Courses
        </h1>
        <p class="text-h6 text-grey mt-2">
          Explore our collection of courses from expert instructors
        </p>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="searchQuery"
          label="Search courses..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Category"
          prepend-inner-icon="mdi-filter"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-h6 mt-4">Loading courses...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" class="mt-8">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          prominent
        >
          <v-alert-title>Error loading courses</v-alert-title>
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="courses.length > 0">
      <v-col
        v-for="course in courses"
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
        <p class="text-h5 mt-4">No courses found</p>
        <p class="text-body-1 text-grey">
          Check back later for new courses!
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
