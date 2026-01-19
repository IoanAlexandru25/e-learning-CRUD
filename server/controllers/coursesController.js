const { db } = require('../config/firebase');
const admin = require('firebase-admin');

exports.getAllCourses = async (req, res) => {
  try {
    const coursesRef = db.collection('courses');
    const snapshot = await coursesRef.where('metadata.isPublished', '==', true).get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const courses = [];
    snapshot.forEach(doc => {
      courses.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(courses);
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses', message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const courseRef = db.collection('courses').doc(req.params.id);
    const doc = await courseRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await courseRef.update({
      'metadata.views': admin.firestore.FieldValue.increment(1)
    });

    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({ error: 'Failed to fetch course', message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const courseData = req.body;

    if (!courseData.title || !courseData.price || !courseData.instructor) {
      return res.status(400).json({ error: 'Missing required fields: title, price, instructor' });
    }

    const slug = courseData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCourse = {
      title: courseData.title,
      slug: slug,
      price: parseFloat(courseData.price),
      description: courseData.description || '',

      category: courseData.category || {
        id: 'cat_general',
        name: 'General',
        subcategory: 'Uncategorized',
        tags: []
      },

      instructor: courseData.instructor,

      syllabus: courseData.syllabus || [],

      specifications: courseData.specifications || {
        level: 'Beginner',
        duration: '0 hours',
        language: 'English',
        subtitles: ['English'],
        requirements: []
      },

      reviews: [],

      metadata: {
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        createdBy: courseData.instructor.id,
        views: 0,
        enrollments: 0,
        avgRating: 0,
        isPublished: courseData.isPublished !== undefined ? courseData.isPublished : true,
        featured: courseData.featured || false
      }
    };

    const docRef = await db.collection('courses').add(newCourse);
    const createdCourse = await docRef.get();

    res.status(201).json({
      id: docRef.id,
      ...createdCourse.data()
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course', message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseRef = db.collection('courses').doc(req.params.id);
    const doc = await courseRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updateData = { ...req.body };

    updateData.metadata = {
      ...doc.data().metadata,
      ...updateData.metadata,
      updatedAt: admin.firestore.Timestamp.now()
    };

    await courseRef.update(updateData);
    const updatedDoc = await courseRef.get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course', message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseRef = db.collection('courses').doc(req.params.id);
    const doc = await courseRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await courseRef.delete();

    res.json({ message: 'Course deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course', message: error.message });
  }
};

exports.getCoursesByInstructor = async (req, res) => {
  try {
    const coursesRef = db.collection('courses');
    const snapshot = await coursesRef
      .where('instructor.id', '==', req.params.instructorId)
      .get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const courses = [];
    snapshot.forEach(doc => {
      courses.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(courses);
  } catch (error) {
    console.error('Error getting instructor courses:', error);
    res.status(500).json({ error: 'Failed to fetch instructor courses', message: error.message });
  }
};
