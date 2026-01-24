<script setup>
import { onMounted, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import CourseCard from '../components/CourseCard.vue'

const coursesStore = useCoursesStore()

const categories = computed(() => ['All', ...new Set(coursesStore.courses.map(c => c.category?.name).filter(Boolean))])
const levels = computed(() => ['All', ...new Set(coursesStore.courses.map(c => c.specifications?.level).filter(Boolean))])

const sortOptions = [
  { title: 'Newest', value: 'date-desc' },
  { title: 'Oldest', value: 'date-asc' },
  { title: 'Price: Low to High', value: 'price-asc' },
  { title: 'Price: High to Low', value: 'price-desc' },
]

onMounted(async () => {
  if (coursesStore.courses.length === 0) {
    await coursesStore.fetchCourses()
  }
})
</script>

<template>
  <v-container fluid>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">
          <v-icon icon="mdi-school" color="primary" class="mr-2"></v-icon>
          Explore Courses
        </h1>
        <p class="text-h6 text-grey mt-2">
          Find your next learning adventure from our collection of expert-led courses
        </p>
      </v-col>
    </v-row>

    <v-row class="mb-6" align="center">
      <v-col cols="12" md="5">
        <v-text-field
          v-model="coursesStore.searchQuery"
          label="Search courses by title..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select
          v-model="coursesStore.selectedCategory"
          :items="categories"
          label="Category"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="2">
        <v-select
          v-model="coursesStore.selectedLevel"
          :items="levels"
          label="Level"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="coursesStore.sortBy"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          label="Sort by"
          prepend-inner-icon="mdi-sort"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="coursesStore.loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-h6 mt-4">Loading courses...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="coursesStore.error" class="mt-8">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          prominent
        >
          <v-alert-title>Error loading courses</v-alert-title>
          {{ coursesStore.error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="coursesStore.filteredAndSortedCourses.length > 0">
      <v-col
        v-for="course in coursesStore.filteredAndSortedCourses"
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
        <p class="text-h5 mt-4">No courses match your criteria</p>
        <p class="text-body-1 text-grey">
          Try adjusting your search or filters.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
