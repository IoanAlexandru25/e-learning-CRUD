<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card v-if="lesson">
          <v-card-title class="headline">{{ lesson.title }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p>{{ lesson.content }}</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" @click="navigateToPreviousLesson" :disabled="!previousLesson">
              <v-icon left>mdi-arrow-left</v-icon>
              Previous
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="navigateToNextLesson" :disabled="!nextLesson">
              Next
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-alert v-else-if="loading" type="info">Loading lesson...</v-alert>
        <v-alert v-else type="warning">Lesson not found.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCoursesStore } from '@/stores/courses';

const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();

const courseId = ref(route.params.courseId);
const moduleId = ref(route.params.moduleId);
const lessonId = ref(route.params.lessonId);

const course = computed(() => coursesStore.currentCourse);
const loading = ref(false);

const lesson = computed(() => {
  if (!course.value) return null;
  const module = course.value.modules.find(m => m.id === moduleId.value);
  return module ? module.lessons.find(l => l.id === lessonId.value) : null;
});

const getLessonByIndex = (module, lessonIndex) => {
  return module.lessons[lessonIndex];
};

const findLessonInfo = () => {
  if (!course.value) return null;
  for (let i = 0; i < course.value.modules.length; i++) {
    const module = course.value.modules[i];
    const lessonIndex = module.lessons.findIndex(l => l.id === lessonId.value);
    if (lessonIndex !== -1) {
      return { module, moduleIndex: i, lessonIndex };
    }
  }
  return null;
};

const previousLesson = computed(() => {
  const info = findLessonInfo();
  if (!info) return null;

  let { module, moduleIndex, lessonIndex } = info;

  if (lessonIndex > 0) {
    return { ...getLessonByIndex(module, lessonIndex - 1), moduleId: module.id };
  } else if (moduleIndex > 0) {
    const previousModule = course.value.modules[moduleIndex - 1];
    if (previousModule.lessons.length > 0) {
      return { ...getLessonByIndex(previousModule, previousModule.lessons.length - 1), moduleId: previousModule.id };
    }
  }
  return null;
});

const nextLesson = computed(() => {
  const info = findLessonInfo();
  if (!info) return null;

  let { module, moduleIndex, lessonIndex } = info;

  if (lessonIndex < module.lessons.length - 1) {
    return { ...getLessonByIndex(module, lessonIndex + 1), moduleId: module.id };
  } else if (moduleIndex < course.value.modules.length - 1) {
    const nextModule = course.value.modules[moduleIndex + 1];
    if (nextModule.lessons.length > 0) {
      return { ...getLessonByIndex(nextModule, 0), moduleId: nextModule.id };
    }
  }
  return null;
});

const navigateToPreviousLesson = () => {
  if (previousLesson.value) {
    router.push({
      name: 'Lesson',
      params: {
        courseId: courseId.value,
        moduleId: previousLesson.value.moduleId,
        lessonId: previousLesson.value.id,
      },
    });
  }
};

const navigateToNextLesson = () => {
  if (nextLesson.value) {
    router.push({
      name: 'Lesson',
      params: {
        courseId: courseId.value,
        moduleId: nextLesson.value.moduleId,
        lessonId: nextLesson.value.id,
      },
    });
  }
};

const fetchCourse = async () => {
  loading.value = true;
  if (!course.value || course.value.id !== courseId.value) {
    await coursesStore.fetchCourseById(courseId.value);
  }
  loading.value = false;
};

onMounted(fetchCourse);

watch(() => route.params, (newParams) => {
  courseId.value = newParams.courseId;
  moduleId.value = newParams.moduleId;
  lessonId.value = newParams.lessonId;
  fetchCourse();
}, { deep: true });
</script>

<style scoped>
.v-card-text p {
  white-space: pre-wrap;
  line-height: 1.8;
}
</style>
