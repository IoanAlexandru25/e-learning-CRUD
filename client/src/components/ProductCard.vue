<script setup>
defineProps({
  title: {
    type: String,
    default: 'Course Title'
  },
  price: {
    type: Number,
    default: 49.99
  },
  description: {
    type: String,
    default: 'Learn the fundamentals and advance your skills with this comprehensive course.'
  },
  image: {
    type: String,
    default: 'https://picsum.photos/400/250?random'
  },
  instructor: {
    type: String,
    default: 'John Doe'
  },
  rating: {
    type: Number,
    default: 4.5
  }
})

const emit = defineEmits(['view-details'])

const handleViewDetails = () => {
  emit('view-details')
}
</script>

<template>
  <v-card class="mx-auto" elevation="4" hover>
    <v-img
      :src="image"
      height="200"
      cover
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
    >
      <v-chip
        class="ma-2"
        color="success"
        variant="elevated"
        size="small"
      >
        <v-icon icon="mdi-star" start size="small"></v-icon>
        {{ rating }}
      </v-chip>
    </v-img>

    <v-card-title class="text-h6">
      {{ title }}
    </v-card-title>

    <v-card-subtitle class="d-flex align-center justify-space-between">
      <span class="text-primary font-weight-bold text-h6">${{ price.toFixed(2) }}</span>
      <span class="text-caption">
        <v-icon icon="mdi-account" size="small"></v-icon>
        {{ instructor }}
      </span>
    </v-card-subtitle>

    <v-card-text>
      <p class="text-body-2">{{ description }}</p>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="elevated"
        block
        @click="handleViewDetails"
      >
        <v-icon icon="mdi-eye" start></v-icon>
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
