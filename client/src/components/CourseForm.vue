<template>
  <v-form ref="formRef" @submit.prevent="handleSubmit">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ isEdit ? 'Edit Course' : 'Create New Course' }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
                label="Course Title*"
                :rules="[rules.required, rules.minLength(5), rules.maxLength(200)]"
                counter="200"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.price"
                label="Price*"
                type="number"
                prefix="$"
                step="0.01"
                :rules="[rules.price]"
                variant="outlined"
                hint="Maximum $10,000 with 2 decimal places"
                persistent-hint
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formData.specifications.level"
                label="Level*"
                :items="levels"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Description"
                :rules="[rules.maxLength(5000)]"
                counter="5000"
                rows="4"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formData.category.name"
                :items="categories"
                label="Category*"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-combobox
                v-model="formData.category.tags"
                label="Tags"
                multiple
                chips
                closable-chips
                variant="outlined"
                hint="Press Enter to add tags"
              />
            </v-col>

            <v-col cols="6" md="3">
              <v-text-field
                v-model.number="durationValue"
                label="Duration"
                type="number"
                min="0"
                :rules="[rules.required, rules.positiveNumber]"
                variant="outlined"
              />
            </v-col>

            <v-col cols="6" md="3">
              <v-select
                v-model="durationUnit"
                :items="durationUnits"
                label="Unit"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formData.specifications.language"
                :items="languages"
                label="Language"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-combobox
                v-model="formData.specifications.requirements"
                label="Requirements"
                multiple
                chips
                closable-chips
                variant="outlined"
                hint="Press Enter to add requirements"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-4" />
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-h6">Syllabus</span>
                <v-btn
                  color="primary"
                  size="small"
                  @click="addModule"
                  prepend-icon="mdi-plus"
                >
                  Add Module
                </v-btn>
              </div>

              <v-expansion-panels v-if="formData.syllabus.length > 0">
                <v-expansion-panel
                  v-for="(module, index) in formData.syllabus"
                  :key="index"
                >
                  <v-expansion-panel-title>
                    <span>{{ module.title || `Module ${index + 1}` }}</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="module.title"
                          label="Module Title*"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="6" md="3">
                        <v-text-field
                          v-model.number="module.durationValue"
                          label="Duration"
                          type="number"
                          :rules="[rules.minValue(0)]"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="6" md="3">
                        <v-select
                          v-model="module.durationUnit"
                          :items="durationUnits"
                          label="Unit"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12">
                        <div class="d-flex justify-space-between align-center mb-2">
                          <span class="text-subtitle-2">Lessons</span>
                          <v-btn
                            color="primary"
                            size="x-small"
                            @click="addLesson(index)"
                            prepend-icon="mdi-plus"
                          >
                            Add Lesson
                          </v-btn>
                        </div>
                        <div v-if="module.lessons && module.lessons.length > 0" class="lessons-container">
                          <div
                            v-for="(lesson, lessonIndex) in module.lessons"
                            :key="lessonIndex"
                            class="lesson-item mb-4"
                          >
                            <v-row dense>
                              <v-col cols="12" md="5">
                                <v-text-field
                                  v-model="lesson.title"
                                  label="Lesson Title*"
                                  :rules="[rules.required]"
                                  variant="outlined"
                                  density="compact"
                                />
                              </v-col>
                              <v-col cols="5" md="3">
                                <v-text-field
                                  v-model.number="lesson.durationValue"
                                  label="Duration"
                                  type="number"
                                  :rules="[rules.minValue(0)]"
                                  variant="outlined"
                                  density="compact"
                                />
                              </v-col>
                              <v-col cols="5" md="3">
                                <v-select
                                  v-model="lesson.durationUnit"
                                  :items="durationUnits"
                                  label="Unit"
                                  variant="outlined"
                                  density="compact"
                                />
                              </v-col>
                              <v-col cols="2" md="1" class="d-flex align-center">
                                <v-btn
                                  icon="mdi-delete"
                                  size="small"
                                  color="error"
                                  variant="text"
                                  @click="removeLesson(index, lessonIndex)"
                                />
                              </v-col>
                            </v-row>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <v-btn
                          color="error"
                          size="small"
                          @click="removeModule(index)"
                          prepend-icon="mdi-delete"
                        >
                          Remove Module
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          type="submit"
          :loading="loading"
        >
          {{ isEdit ? 'Update' : 'Create' }} Course
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const isEdit = ref(!!props.course)

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
const categories = ['Development', 'Design', 'Business', 'Marketing', 'IT & Software']
const languages = ['English', 'Romanian', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Chinese']
const durationUnits = ['hours', 'minutes', 'days', 'weeks']

const durationValue = ref(0)
const durationUnit = ref('hours')

const defaultFormData = {
  title: '',
  price: 0,
  description: '',
  category: {
    id: '',
    name: '',
    tags: []
  },
  specifications: {
    level: 'Beginner',
    duration: '0 hours',
    language: 'English',
    subtitles: ['English'],
    requirements: []
  },
  syllabus: []
}

const formData = ref({ ...defaultFormData })

watch(() => props.course, (newCourse) => {
  if (newCourse) {
    const durationStr = newCourse.specifications?.duration || '0 hours'
    const durationMatch = durationStr.match(/^(\d+)\s*(\w+)$/)
    if (durationMatch) {
      durationValue.value = parseInt(durationMatch[1])
      durationUnit.value = durationMatch[2]
    }

    formData.value = {
      title: newCourse.title || '',
      price: newCourse.price || 0,
      description: newCourse.description || '',
      category: {
        id: newCourse.category?.id || '',
        name: newCourse.category?.name || '',
        tags: newCourse.category?.tags || []
      },
      specifications: {
        level: newCourse.specifications?.level || 'Beginner',
        duration: durationStr,
        language: newCourse.specifications?.language || 'English',
        subtitles: newCourse.specifications?.subtitles || ['English'],
        requirements: newCourse.specifications?.requirements || []
      },
      syllabus: (newCourse.syllabus || []).map(module => {
        const moduleDurationMatch = module.duration?.match(/^(\d+)\s*(\w+)$/)
        return {
          ...module,
          durationValue: moduleDurationMatch ? parseInt(moduleDurationMatch[1]) : 0,
          durationUnit: moduleDurationMatch ? moduleDurationMatch[2] : 'minutes',
          lessons: (module.lessons || []).map(lesson => {
            const lessonDurationMatch = lesson.duration?.match(/^(\d+)\s*(\w+)$/)
            return {
              ...lesson,
              durationValue: lessonDurationMatch ? parseInt(lessonDurationMatch[1]) : 0,
              durationUnit: lessonDurationMatch ? lessonDurationMatch[2] : 'minutes'
            }
          })
        }
      })
    }
    isEdit.value = true
  }
}, { immediate: true })

const rules = {
  required: v => !!v || 'This field is required',
  minLength: (min) => v => !v || v.length >= min || `Minimum ${min} characters`,
  maxLength: (max) => v => !v || v.length <= max || `Maximum ${max} characters`,
  minValue: (min) => v => v >= min || `Minimum value is ${min}`,
  maxValue: (max) => v => v <= max || `Maximum value is ${max}`,
  price: v => {
    if (v === '' || v === null || v === undefined) return 'Price is required'
    const num = parseFloat(v)
    if (isNaN(num)) return 'Price must be a valid number'
    if (num < 0) return 'Price cannot be negative'
    if (num > 10000) return 'Price cannot exceed $10,000'
    if (!/^\d+(\.\d{1,2})?$/.test(v.toString())) return 'Price can have maximum 2 decimal places'
    return true
  },
  positiveNumber: v => {
    if (v === '' || v === null || v === undefined) return true
    const num = parseFloat(v)
    if (isNaN(num)) return 'Must be a valid number'
    if (num < 0) return 'Cannot be negative'
    return true
  }
}

const addModule = () => {
  formData.value.syllabus.push({
    moduleId: `mod_${Date.now()}`,
    title: '',
    durationValue: 0,
    durationUnit: 'minutes',
    lessons: []
  })
}

const removeModule = (index) => {
  formData.value.syllabus.splice(index, 1)
}

const addLesson = (moduleIndex) => {
  if (!formData.value.syllabus[moduleIndex].lessons) {
    formData.value.syllabus[moduleIndex].lessons = []
  }
  formData.value.syllabus[moduleIndex].lessons.push({
    lessonId: `lesson_${Date.now()}`,
    title: '',
    durationValue: 0,
    durationUnit: 'minutes'
  })
}

const removeLesson = (moduleIndex, lessonIndex) => {
  formData.value.syllabus[moduleIndex].lessons.splice(lessonIndex, 1)
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const submitData = {
    ...formData.value,
    category: {
      id: formData.value.category.id || `cat_${formData.value.category.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: formData.value.category.name,
      tags: formData.value.category.tags || []
    },
    specifications: {
      ...formData.value.specifications,
      duration: `${durationValue.value} ${durationUnit.value}`
    },
    syllabus: formData.value.syllabus.map(module => ({
      moduleId: module.moduleId,
      title: module.title,
      duration: `${module.durationValue} ${module.durationUnit}`,
      lessons: (module.lessons || []).map(lesson => ({
        lessonId: lesson.lessonId,
        title: lesson.title,
        duration: `${lesson.durationValue} ${lesson.durationUnit}`
      }))
    }))
  }

  emit('submit', submitData)
}
</script>
