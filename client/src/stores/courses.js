import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

const API_URL = 'http://localhost:3000/api'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const myCourses = ref([])
  const currentCourse = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const authStore = useAuthStore()

  const fetchCourses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/courses`)
      if (!response.ok) throw new Error('Failed to fetch courses')
      courses.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching courses:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCourseById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/courses/${id}`)
      if (!response.ok) throw new Error('Failed to fetch course')
      currentCourse.value = await response.json()
      return currentCourse.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching course:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchMyCourses = async () => {
    if (!authStore.user?.uid) {
      error.value = 'User not authenticated'
      return
    }

    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/courses/instructor/${authStore.user.uid}`)
      if (!response.ok) throw new Error('Failed to fetch your courses')
      myCourses.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching my courses:', err)
    } finally {
      loading.value = false
    }
  }

  const createCourse = async (courseData) => {
    loading.value = true
    error.value = null
    try {
      const token = await authStore.getAuthToken()
      console.log('Creating course with data:', courseData)
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      })

      const data = await response.json()
      console.log('Server response:', data)

      if (!response.ok) {
        console.error('Validation errors:', data.details)
        throw new Error(data.message || 'Failed to create course')
      }

      await fetchMyCourses()
      return { success: true, course: data }
    } catch (err) {
      error.value = err.message
      console.error('Error creating course:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updateCourse = async (id, courseData) => {
    loading.value = true
    error.value = null
    try {
      const token = await authStore.getAuthToken()
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update course')
      }

      await fetchMyCourses()
      return { success: true, course: data }
    } catch (err) {
      error.value = err.message
      console.error('Error updating course:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const deleteCourse = async (id) => {
    loading.value = true
    error.value = null
    try {
      const token = await authStore.getAuthToken()
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete course')
      }

      myCourses.value = myCourses.value.filter(course => course.id !== id)
      return { success: true, message: data.message }
    } catch (err) {
      error.value = err.message
      console.error('Error deleting course:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    myCourses,
    currentCourse,
    loading,
    error,
    fetchCourses,
    fetchCourseById,
    fetchMyCourses,
    createCourse,
    updateCourse,
    deleteCourse
  }
})
