<script setup>
import CourseCard from '../components/CourseCard.vue'

const featuredCourses = [
  {
    id: 1,
    title: 'Complete Vue 3 Masterclass',
    price: 89.99,
    description: 'Master Vue 3 from basics to advanced concepts including Composition API, Pinia, and Vue Router.',
    image: 'https://picsum.photos/400/250?random=1',
    instructor: { name: 'Sarah Johnson' },
    metadata: { avgRating: 4.8, enrollments: 340, views: 1250 },
    specifications: { level: 'Intermediate', duration: '8 hours' }
  },
  {
    id: 2,
    title: 'Advanced JavaScript & ES6+',
    price: 79.99,
    description: 'Deep dive into modern JavaScript features, async programming, and best practices.',
    image: 'https://picsum.photos/400/250?random=2',
    instructor: { name: 'Michael Chen' },
    metadata: { avgRating: 4.7, enrollments: 280, views: 950 },
    specifications: { level: 'Advanced', duration: '6 hours' }
  },
  {
    id: 3,
    title: 'Full Stack Web Development',
    price: 129.99,
    description: 'Build complete web applications with Node.js, Express, MongoDB, and Vue.js.',
    image: 'https://picsum.photos/400/250?random=3',
    instructor: { name: 'Emily Davis' },
    metadata: { avgRating: 4.9, enrollments: 520, views: 1800, featured: true },
    specifications: { level: 'Intermediate', duration: '12 hours' }
  },
  {
    id: 4,
    title: 'Firebase & Firestore Guide',
    price: 69.99,
    description: 'Learn to build real-time applications with Firebase Authentication and Firestore database.',
    image: 'https://picsum.photos/400/250?random=4',
    instructor: { name: 'David Martinez' },
    metadata: { avgRating: 4.6, enrollments: 190, views: 780 },
    specifications: { level: 'Beginner', duration: '5 hours' }
  }
]
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

    <v-row>
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
