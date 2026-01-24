import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

const API_URL = 'http://localhost:3000/api'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const myCourses = ref([])
  const currentCourse = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedCategory = ref('All')
  const selectedLevel = ref('All')
  const sortBy = ref('date-desc')

  const authStore = useAuthStore()

  const filteredAndSortedCourses = computed(() => {
    let result = courses.value

    // 1. Filtering
    if (searchQuery.value) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }

    if (selectedCategory.value && selectedCategory.value !== 'All') {
      result = result.filter(course => course.category?.name === selectedCategory.value)
    }

    if (selectedLevel.value && selectedLevel.value !== 'All') {
      result = result.filter(course => course.specifications?.level === selectedLevel.value)
    }
    
    switch (sortBy.value) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'date-asc':
        result.sort((a, b) => new Date(a.metadata.createdAt.seconds * 1000) - new Date(b.metadata.createdAt.seconds * 1000))
        break
      case 'date-desc':
        result.sort((a, b) => new Date(b.metadata.createdAt.seconds * 1000) - new Date(a.metadata.createdAt.seconds * 1000))
        break
    }

    return result
  })

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
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to create course',
          details: data.details || []
        }
      }

      await fetchMyCourses()
      return { success: true, course: data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message, details: [] }
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
        return {
          success: false,
          error: data.message || 'Failed to update course',
          details: data.details || []
        }
      }

      await fetchMyCourses()
      return { success: true, course: data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message, details: [] }
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
    searchQuery,
    selectedCategory,
    selectedLevel,
    sortBy,
    filteredAndSortedCourses,
    fetchCourses,
    fetchCourseById,
    fetchMyCourses,
    createCourse,
    updateCourse,
    deleteCourse
  }
})
