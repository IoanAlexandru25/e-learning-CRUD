<script setup>
import ProductCard from '../components/ProductCard.vue'

const featuredCourses = [
  {
    id: 1,
    title: 'Complete Vue 3 Masterclass',
    price: 89.99,
    description: 'Master Vue 3 from basics to advanced concepts including Composition API, Pinia, and Vue Router.',
    image: 'https://picsum.photos/400/250?random=1',
    instructor: 'Sarah Johnson',
    rating: 4.8
  },
  {
    id: 2,
    title: 'Advanced JavaScript & ES6+',
    price: 79.99,
    description: 'Deep dive into modern JavaScript features, async programming, and best practices.',
    image: 'https://picsum.photos/400/250?random=2',
    instructor: 'Michael Chen',
    rating: 4.7
  },
  {
    id: 3,
    title: 'Full Stack Web Development',
    price: 129.99,
    description: 'Build complete web applications with Node.js, Express, MongoDB, and Vue.js.',
    image: 'https://picsum.photos/400/250?random=3',
    instructor: 'Emily Davis',
    rating: 4.9
  },
  {
    id: 4,
    title: 'Firebase & Firestore Guide',
    price: 69.99,
    description: 'Learn to build real-time applications with Firebase Authentication and Firestore database.',
    image: 'https://picsum.photos/400/250?random=4',
    instructor: 'David Martinez',
    rating: 4.6
  }
]

const handleViewDetails = (course) => {
  console.log('View details for:', course)
}
</script>

<template>
  <v-container fluid>
    <!-- Hero Section -->
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

    <!-- Featured Courses Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-star" color="warning" class="mr-2"></v-icon>
          Featured Courses
        </h2>
        <v-divider class="mb-6"></v-divider>
      </v-col>
    </v-row>

    <!-- Course Cards Grid -->
    <v-row>
      <v-col
        v-for="course in featuredCourses"
        :key="course.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard
          :title="course.title"
          :price="course.price"
          :description="course.description"
          :image="course.image"
          :instructor="course.instructor"
          :rating="course.rating"
          @view-details="handleViewDetails(course)"
        />
      </v-col>
    </v-row>

    <!-- Stats Section -->
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
