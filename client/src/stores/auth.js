import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from '../config/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || 'student')
  const isInstructor = computed(() => userRole.value === 'instructor')
  const isStudent = computed(() => userRole.value === 'student')

  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken()

          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL,
            role: firebaseUser.displayName?.includes('[INSTRUCTOR]') ? 'instructor' : 'student',
            token: token
          }
        } else {
          user.value = null
        }
        loading.value = false
        resolve(firebaseUser)
      })
    })
  }

  const register = async (email, password, displayName, role = 'student') => {
    try {
      error.value = null
      loading.value = true
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const profileName = role === 'instructor'
        ? `${displayName} [INSTRUCTOR]`
        : displayName

      await updateProfile(userCredential.user, {
        displayName: profileName
      })

      const token = await userCredential.user.getIdToken()

      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName,
        photoURL: userCredential.user.photoURL,
        role: role,
        token: token
      }

      return { success: true, user: user.value }
    } catch (err) {
      error.value = err.message
      console.error('Registration error:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    try {
      error.value = null
      loading.value = true

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()

      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName?.replace(' [INSTRUCTOR]', '') || email.split('@')[0],
        photoURL: userCredential.user.photoURL,
        role: userCredential.user.displayName?.includes('[INSTRUCTOR]') ? 'instructor' : 'student',
        token: token
      }

      return { success: true, user: user.value }
    } catch (err) {
      error.value = err.message
      console.error('Login error:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      error.value = null
      await signOut(auth)
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Logout error:', err)
      return { success: false, error: err.message }
    }
  }

  const getAuthToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken()
    }
    return null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userRole,
    isInstructor,
    isStudent,
    initAuth,
    register,
    login,
    logout,
    getAuthToken
  }
})
