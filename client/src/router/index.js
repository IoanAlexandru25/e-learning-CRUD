import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CoursesView from '../views/CoursesView.vue'
import CourseDetailView from '../views/CourseDetailView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/courses',
      name: 'courses',
      component: CoursesView
    },
    {
      path: '/courses/:id',
      name: 'course-detail',
      component: CourseDetailView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/my-courses',
      name: 'my-courses',
      component: () => import('../views/MyCoursesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/instructor/courses',
      name: 'instructor-courses',
      component: () => import('../views/InstructorCoursesView.vue'),
      meta: { requiresAuth: true, requiresInstructor: true }
    },
    {
      path: '/courses/create',
      name: 'create-course',
      component: () => import('../views/CreateCourseView.vue'),
      meta: { requiresAuth: true, requiresInstructor: true }
    },
    {
      path: '/courses/edit/:id',
      name: 'edit-course',
      component: () => import('../views/EditCourseView.vue'),
      meta: { requiresAuth: true, requiresInstructor: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.name === 'my-courses' && authStore.isInstructor) {
    next({ name: 'home' })
  }
  else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
  }
  else if (to.meta.requiresInstructor && !authStore.isInstructor) {
    next({ name: 'home' })
  }
  else {
    next()
  }
})

export default router
