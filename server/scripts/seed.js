require('dotenv').config({ path: '../.env' });
const { faker } = require('@faker-js/faker');
const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const categories = [
  { id: 'cat_development', name: 'Development', tags: ['javascript', 'vue', 'react', 'angular', 'node', 'python'] },
  { id: 'cat_design', name: 'Design', tags: ['figma', 'photoshop', 'ux', 'ui', 'branding'] },
  { id: 'cat_business', name: 'Business', tags: ['marketing', 'sales', 'seo', 'strategy', 'entrepreneurship'] },
  { id: 'cat_marketing', name: 'Marketing', tags: ['digital-marketing', 'seo', 'social-media', 'content', 'ads'] },
  { id: 'cat_it_software', name: 'IT & Software', tags: ['aws', 'azure', 'docker', 'kubernetes', 'security', 'devops'] }
];

const courseTitles = [
  'Complete Vue 3 Masterclass',
  'Advanced JavaScript & ES6+',
  'Full Stack Web Development Bootcamp',
  'React Native Mobile Development',
  'Python for Data Science',
  'UI/UX Design Fundamentals',
  'Node.js API Development',
  'Machine Learning with TensorFlow',
  'AWS Cloud Architecture',
  'Cybersecurity Essentials',
  'Flutter Mobile Apps',
  'Docker & Kubernetes Guide',
  'Digital Marketing Strategy',
  'TypeScript Complete Course',
  'GraphQL API Development',
  'Firebase Realtime Applications',
  'Angular Framework Deep Dive',
  'MongoDB Database Design',
  'Tailwind CSS Styling',
  'Git & GitHub Mastery'
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const languages = ['English', 'Romanian', 'Spanish', 'French', 'German'];

function generateInstructor() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });

  return {
    id: `inst_${faker.string.uuid()}`,
    name: `${firstName} ${lastName}`,
    email: email.toLowerCase(),
    avatar: faker.image.avatar(),
    bio: faker.lorem.paragraph({ min: 2, max: 4 }),
    title: faker.person.jobTitle()
  };
}

function generateSyllabus() {
  const moduleCount = faker.number.int({ min: 3, max: 6 });
  const syllabus = [];

  for (let i = 1; i <= moduleCount; i++) {
    const lessonCount = faker.number.int({ min: 3, max: 8 });
    const lessons = [];

    for (let j = 1; j <= lessonCount; j++) {
      lessons.push({
        lessonId: j,
        title: faker.lorem.words({ min: 2, max: 5 }),
        duration: `${faker.number.int({ min: 5, max: 30 })} min`,
        type: faker.helpers.arrayElement(['video', 'article', 'quiz']),
        isFree: j === 1
      });
    }

    const totalDuration = lessons.reduce((sum, lesson) => {
      return sum + parseInt(lesson.duration);
    }, 0);

    syllabus.push({
      moduleId: i,
      title: faker.lorem.words({ min: 2, max: 4 }),
      duration: `${totalDuration} min`,
      order: i,
      lessons: lessons
    });
  }

  return syllabus;
}

function generateReviews() {
  const reviewCount = faker.number.int({ min: 5, max: 20 });
  const reviews = [];

  for (let i = 0; i < reviewCount; i++) {
    reviews.push({
      reviewId: `rev_${faker.string.uuid()}`,
      userId: `user_${faker.string.uuid()}`,
      userName: faker.person.fullName(),
      rating: faker.number.int({ min: 3, max: 5 }),
      comment: faker.lorem.sentences({ min: 1, max: 3 }),
      date: faker.date.recent({ days: 90 }).toISOString(),
      helpful: faker.number.int({ min: 0, max: 50 })
    });
  }

  return reviews;
}

function generateCourse() {
  const category = faker.helpers.arrayElement(categories);
  const level = faker.helpers.arrayElement(levels);
  const language = faker.helpers.arrayElement(languages);
  const title = faker.helpers.arrayElement(courseTitles) + ' ' + faker.number.int({ min: 2020, max: 2025 });
  const price = faker.number.float({ min: 19.99, max: 199.99, fractionDigits: 2 });
  const syllabus = generateSyllabus();
  const reviews = generateReviews();

  const totalMinutes = syllabus.reduce((sum, module) => {
    return sum + parseInt(module.duration);
  }, 0);
  const totalHours = Math.floor(totalMinutes / 60);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    title,
    slug,
    price,
    description: faker.lorem.paragraphs({ min: 2, max: 4 }),
    category: {
      id: category.id,
      name: category.name,
      tags: faker.helpers.arrayElements(category.tags, faker.number.int({ min: 2, max: 4 }))
    },

    instructor: generateInstructor(),
    syllabus: syllabus,
    specifications: {
      level: level,
      duration: `${totalHours} hours`,
      language: language,
      subtitles: faker.helpers.arrayElements(languages, faker.number.int({ min: 1, max: 3 })),
      requirements: [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence()
      ],
      learningOutcomes: [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence()
      ]
    },

    reviews: reviews,

    metadata: {
      createdAt: admin.firestore.Timestamp.fromDate(faker.date.recent({ days: 60 })),
      updatedAt: admin.firestore.Timestamp.now(),
      createdBy: `inst_${faker.string.uuid()}`,
      views: faker.number.int({ min: 50, max: 5000 }),
      enrollments: faker.number.int({ min: 10, max: 1000 }),
      completions: faker.number.int({ min: 5, max: 500 }),
      avgRating: parseFloat(avgRating),
      totalReviews: reviews.length,
      isPublished: true,
      featured: faker.datatype.boolean({ probability: 0.2 }),
      lastEnrolledAt: admin.firestore.Timestamp.fromDate(faker.date.recent({ days: 7 }))
    }
  };
}

async function seedCourses(count = 60) {

  try {
    const batch = db.batch();
    const coursesRef = db.collection('courses');

    for (let i = 0; i < count; i++) {
      const course = generateCourse();
      const docRef = coursesRef.doc();
      batch.set(docRef, course);

      if ((i + 1) % 10 === 0) {
        console.log(`Generated ${i + 1}/${count} courses...`);
      }
    }

    await batch.commit();

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedCourses(60);
