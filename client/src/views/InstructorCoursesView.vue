<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">My Courses</h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="navigateToCreate"
          >
            Create New Course
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" v-if="coursesStore.loading">
        <v-row>
          <v-col v-for="n in 3" :key="n" cols="12" md="4">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" v-else-if="coursesStore.error">
        <v-alert type="error" variant="tonal">
          {{ coursesStore.error }}
        </v-alert>
      </v-col>

      <v-col cols="12" v-else-if="coursesStore.myCourses.length === 0">
        <v-card class="text-center pa-8">
          <v-icon size="64" color="grey">mdi-book-open-variant</v-icon>
          <v-card-title class="text-h5 mt-4">No Courses Yet</v-card-title>
          <v-card-text>
            You haven't created any courses yet. Start creating your first course to share your knowledge!
          </v-card-text>
          <v-btn color="primary" size="large" @click="navigateToCreate">
            Create Your First Course
          </v-btn>
        </v-card>
      </v-col>

      <v-col
        v-else
        v-for="course in coursesStore.myCourses"
        :key="course.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card>
          <v-img
            :src="`https://picsum.photos/seed/${course.id}/400/200`"
            height="200"
            cover
          >
            <div class="d-flex justify-space-between pa-2">
              <v-chip
                :color="course.metadata?.isPublished ? 'success' : 'warning'"
                size="small"
              >
                {{ course.metadata?.isPublished ? 'Published' : 'Draft' }}
              </v-chip>
              <v-chip color="primary" size="small">
                ${{ course.price }}
              </v-chip>
            </div>
          </v-img>

          <v-card-title>{{ course.title }}</v-card-title>
          <v-card-subtitle>{{ course.category?.name }}</v-card-subtitle>

          <v-card-text>
            <div class="text-caption text-truncate" style="max-height: 60px">
              {{ course.description }}
            </div>
            <v-divider class="my-2" />
            <div class="d-flex justify-space-between text-caption">
              <span>
                <v-icon size="small">mdi-eye</v-icon>
                {{ course.metadata?.views || 0 }} views
              </span>
              <span>
                <v-icon size="small">mdi-account-group</v-icon>
                {{ course.metadata?.enrollments || 0 }} students
              </span>
              <span>
                <v-icon size="small">mdi-star</v-icon>
                {{ course.metadata?.avgRating?.toFixed(1) || 'N/A' }}
              </span>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              @click="navigateToEdit(course.id)"
            >
              Edit
            </v-btn>
            <v-btn
              color="grey"
              variant="text"
              @click="viewCourse(course.id)"
            >
              View
            </v-btn>
            <v-spacer />
            <v-btn
              color="error"
              variant="text"
              @click="confirmDelete(course)"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Delete Course?</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ courseToDelete?.title }}"? This action cannot be undone.
          <v-alert
            v-if="courseToDelete?.metadata?.enrollments > 0"
            type="warning"
            variant="tonal"
            class="mt-4"
          >
            This course has {{ courseToDelete.metadata.enrollments }} active enrollments. Consider unpublishing instead.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="handleDelete"
            :loading="deleting"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

const router = useRouter()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

const deleteDialog = ref(false)
const courseToDelete = ref(null)
const deleting = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

onMounted(async () => {
  if (!authStore.isInstructor) {
    router.push('/')
    return
  }
  await coursesStore.fetchMyCourses()
})

const navigateToCreate = () => {
  router.push('/courses/create')
}

const navigateToEdit = (id) => {
  router.push(`/courses/edit/${id}`)
}

const viewCourse = (id) => {
  router.push(`/courses/${id}`)
}

const confirmDelete = (course) => {
  courseToDelete.value = course
  deleteDialog.value = true
}

const handleDelete = async () => {
  deleting.value = true
  const result = await coursesStore.deleteCourse(courseToDelete.value.id)
  deleting.value = false
  deleteDialog.value = false

  if (result.success) {
    snackbar.value = {
      show: true,
      message: 'Course deleted successfully',
      color: 'success'
    }
  } else {
    snackbar.value = {
      show: true,
      message: result.error || 'Failed to delete course',
      color: 'error'
    }
  }
  courseToDelete.value = null
}
</script>
