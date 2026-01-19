<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['enroll', 'edit', 'delete'])

const router = useRouter()

const courseImage = computed(() => {
  return props.course.image || `https://picsum.photos/400/250?random=${props.course.id}`
})

const viewDetails = () => {
  router.push(`/courses/${props.course.id}`)
}

const handleEnroll = () => {
  emit('enroll', props.course)
}

const handleEdit = () => {
  emit('edit', props.course)
}

const handleDelete = () => {
  emit('delete', props.course)
}
</script>

<template>
  <v-card class="mx-auto" elevation="4" hover>
    <v-img
      :src="courseImage"
      height="200"
      cover
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
    >
      <v-chip
        v-if="course.metadata?.avgRating > 0"
        class="ma-2"
        color="success"
        variant="elevated"
        size="small"
      >
        <v-icon icon="mdi-star" start size="small"></v-icon>
        {{ course.metadata.avgRating.toFixed(1) }}
      </v-chip>

      <v-chip
        v-if="course.metadata?.featured"
        class="ma-2"
        color="warning"
        variant="elevated"
        size="small"
      >
        <v-icon icon="mdi-fire" start size="small"></v-icon>
        Featured
      </v-chip>
    </v-img>

    <v-card-title class="text-h6">
      {{ course.title }}
    </v-card-title>

    <v-card-subtitle class="d-flex flex-column">
      <span class="text-primary font-weight-bold text-h6 mb-1">${{ course.price?.toFixed(2) }}</span>
      <span class="text-caption">
        <v-icon icon="mdi-account" size="small"></v-icon>
        {{ course.instructor?.name || 'Unknown Instructor' }}
      </span>
    </v-card-subtitle>

    <v-card-text>
      <p class="text-body-2">{{ course.description?.substring(0, 100) }}...</p>

      <v-chip-group class="mt-2">
        <v-chip
          v-if="course.specifications?.level"
          size="small"
          variant="outlined"
          color="primary"
        >
          {{ course.specifications.level }}
        </v-chip>
        <v-chip
          v-if="course.specifications?.duration"
          size="small"
          variant="outlined"
          color="secondary"
        >
          <v-icon icon="mdi-clock-outline" start size="small"></v-icon>
          {{ course.specifications.duration }}
        </v-chip>
      </v-chip-group>

      <div class="mt-3 d-flex align-center text-caption">
        <v-icon icon="mdi-account-group" size="small" class="mr-1"></v-icon>
        {{ course.metadata?.enrollments || 0 }} students
        <v-spacer></v-spacer>
        <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
        {{ course.metadata?.views || 0 }} views
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions v-if="showActions">
      <v-btn
        color="primary"
        variant="elevated"
        block
        @click="viewDetails"
      >
        <v-icon icon="mdi-eye" start></v-icon>
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
