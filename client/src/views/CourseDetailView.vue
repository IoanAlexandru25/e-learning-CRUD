<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const loading = ref(false)
const error = ref(null)
const enrollmentDialog = ref(false)

onMounted(async () => {
  await fetchCourse()
})

const fetchCourse = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`http://localhost:3000/api/courses/${route.params.id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch course')
    }
    course.value = await response.json()
  } catch (err) {
    error.value = err.message
    console.error('Error fetching course:', err)
  } finally {
    loading.value = false
  }
}

const courseImage = computed(() => {
  return course.value?.image || `https://picsum.photos/1200/400?random=${course.value?.id}`
})

const handleEnroll = () => {
  // TODO: Implement enrollment logic in Commit 6 (with authentication)
  enrollmentDialog.value = true
}

const confirmEnrollment = async () => {
  // TODO: Call API to enroll student
  console.log('Enrolling in course:', course.value.id)
  enrollmentDialog.value = false

  alert('Enrollment feature will be implemented with authentication in the next commit!')
}

const goBack = () => {
  router.push('/courses')
}
</script>

<template>
  <div>
    <v-container v-if="loading" class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="text-h6 mt-4">Loading course...</p>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else-if="error">
      <v-alert type="error" variant="tonal" prominent>
        <v-alert-title>Error loading course</v-alert-title>
        {{ error }}
      </v-alert>
      <v-btn color="primary" @click="goBack" class="mt-4">
        <v-icon icon="mdi-arrow-left" start></v-icon>
        Back to Courses
      </v-btn>
    </v-container>

    <div v-else-if="course">
      <v-img
        :src="courseImage"
        height="400"
        cover
        gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.7)"
      >
        <v-container class="fill-height">
          <v-row align="end">
            <v-col>
              <v-btn
                icon="mdi-arrow-left"
                @click="goBack"
                variant="elevated"
                color="white"
                class="mb-4"
              ></v-btn>
              <h1 class="text-h3 text-white font-weight-bold">{{ course.title }}</h1>
              <p class="text-h6 text-white mt-2">{{ course.description }}</p>
              <div class="mt-4">
                <v-chip color="warning" class="mr-2">
                  <v-icon icon="mdi-star" start></v-icon>
                  {{ course.metadata?.avgRating || 'New' }}
                </v-chip>
                <v-chip color="primary" class="mr-2">
                  <v-icon icon="mdi-account-group" start></v-icon>
                  {{ course.metadata?.enrollments || 0 }} Students
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-img>

      <v-container class="mt-6">
        <v-row>
          <v-col cols="12" md="8">
            <v-card class="mb-6" elevation="2">
              <v-card-title class="text-h5">
                <v-icon icon="mdi-account-tie" class="mr-2"></v-icon>
                Instructor
              </v-card-title>
              <v-card-text>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-avatar color="primary" size="64">
                      <v-img
                        v-if="course.instructor?.avatar"
                        :src="course.instructor.avatar"
                      ></v-img>
                      <span v-else class="text-h5">{{ course.instructor?.name?.charAt(0) }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-h6">{{ course.instructor?.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ course.instructor?.email }}</v-list-item-subtitle>
                  <v-list-item-subtitle v-if="course.instructor?.bio" class="mt-2">
                    {{ course.instructor.bio }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-card-text>
            </v-card>

            <v-card class="mb-6" elevation="2">
              <v-card-title class="text-h5">
                <v-icon icon="mdi-book-open-variant" class="mr-2"></v-icon>
                Course Syllabus
              </v-card-title>
              <v-card-text>
                <v-expansion-panels v-if="course.syllabus && course.syllabus.length > 0">
                  <v-expansion-panel
                    v-for="module in course.syllabus"
                    :key="module.moduleId"
                  >
                    <v-expansion-panel-title>
                      <div>
                        <strong>{{ module.title }}</strong>
                        <div class="text-caption text-grey">
                          <v-icon icon="mdi-clock-outline" size="small"></v-icon>
                          {{ module.duration }}
                        </div>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-list v-if="module.lessons && module.lessons.length > 0" density="compact">
                        <v-list-item
                          v-for="lesson in module.lessons"
                          :key="lesson.lessonId"
                        >
                          <v-list-item-title>{{ lesson.title }}</v-list-item-title>
                          <template v-slot:append>
                            <span class="text-caption">{{ lesson.duration }}</span>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
                <p v-else class="text-body-1 text-grey">No syllabus available yet.</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="mb-6" elevation="4">
              <v-card-text>
                <div class="text-h3 text-primary font-weight-bold mb-4">
                  ${{ course.price?.toFixed(2) }}
                </div>
                <v-btn
                  color="success"
                  size="x-large"
                  block
                  @click="handleEnroll"
                >
                  <v-icon icon="mdi-cart-plus" start></v-icon>
                  Enroll Now
                </v-btn>
                <v-divider class="my-4"></v-divider>
                <div class="text-body-2">
                  <div class="mb-2">
                    <v-icon icon="mdi-clock-outline" size="small"></v-icon>
                    {{ course.specifications?.duration || 'Self-paced' }}
                  </div>
                  <div class="mb-2">
                    <v-icon icon="mdi-signal" size="small"></v-icon>
                    {{ course.specifications?.level || 'All levels' }}
                  </div>
                  <div class="mb-2">
                    <v-icon icon="mdi-translate" size="small"></v-icon>
                    {{ course.specifications?.language || 'English' }}
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <v-card elevation="2">
              <v-card-title>Course Includes</v-card-title>
              <v-card-text>
                <v-list density="compact">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-certificate"></v-icon>
                    </template>
                    <v-list-item-title>Certificate of completion</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-infinity"></v-icon>
                    </template>
                    <v-list-item-title>Lifetime access</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-cellphone"></v-icon>
                    </template>
                    <v-list-item-title>Mobile friendly</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-dialog v-model="enrollmentDialog" max-width="500">
      <v-card>
        <v-card-title>Confirm Enrollment</v-card-title>
        <v-card-text>
          <p>You are about to enroll in:</p>
          <p class="text-h6 font-weight-bold mt-2">{{ course?.title }}</p>
          <p class="text-body-1 mt-2">Price: ${{ course?.price?.toFixed(2) }}</p>
          <v-alert type="info" variant="tonal" class="mt-4">
            Authentication and payment features will be implemented in the next commits.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="enrollmentDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmEnrollment">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
