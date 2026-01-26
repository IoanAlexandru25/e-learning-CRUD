import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

const API_URL = 'http://localhost:3000/api'

export const useEnrollmentsStore = defineStore('enrollments', () => {
  const myEnrollments = ref([])
  const loading = ref(false)
  const error = ref(null)

  const authStore = useAuthStore()

  const fetchMyEnrollments = async () => {
    if (!authStore.isAuthenticated) return

    loading.value = true
    error.value = null
    try {
      const token = await authStore.getAuthToken()
      const response = await fetch(`${API_URL}/enrollments/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch enrollments.')
      }

      const data = await response.json();
      data.sort((a, b) => b.enrolledAt.seconds - a.enrolledAt.seconds);
      myEnrollments.value = data;
    } catch (err) {
      error.value = err.message
      console.error('Error fetching enrollments:', err)
    } finally {
      loading.value = false
    }
  }

  const enrollInCourse = async (courseId) => {
    if (!authStore.isAuthenticated) {
      return { success: false, error: 'You must be logged in to enroll.' }
    }

    loading.value = true
    error.value = null
    try {
      const token = await authStore.getAuthToken()
      const formBody = new URLSearchParams({ courseId }).toString();

      const response = await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        body: formBody
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to enroll in the course.')
      }

      await fetchMyEnrollments()
      return { success: true, enrollment: data }
    } catch (err) {
      error.value = err.message
      console.error('Error enrolling in course:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const isEnrolled = (courseId) => {
    return myEnrollments.value.some(e => e.courseId === courseId)
  }

  return {
    myEnrollments,
    loading,
    error,
    fetchMyEnrollments,
    enrollInCourse,
    isEnrolled
  }
})
