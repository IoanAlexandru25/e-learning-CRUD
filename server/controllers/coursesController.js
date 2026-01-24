const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const { validateCourseData, sanitizeCourseData } = require('../utils/validation');

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
    const validation = validateCourseData(req.body, false);
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      console.error('Request body:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid course data',
        details: validation.errors
      });
    }

    const courseData = sanitizeCourseData(req.body);

    const slug = courseData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const instructor = {
      id: req.user.uid,
      name: req.user.name,
      email: req.user.email,
      avatar: courseData.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.name)}&background=random`,
      bio: courseData.instructor?.bio || ''
    };

    const newCourse = {
      title: courseData.title,
      slug: slug,
      price: courseData.price,
      description: courseData.description || '',

      category: courseData.category || {
        id: 'cat_general',
        name: 'General',
        tags: []
      },

      instructor: instructor,

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
        createdBy: req.user.uid,
        views: 0,
        enrollments: 0,
        avgRating: 0,
        isPublished: courseData.metadata?.isPublished !== undefined ? courseData.metadata.isPublished : true,
        featured: courseData.metadata?.featured || false
      }
    };

    const docRef = await db.collection('courses').add(newCourse);
    const createdCourse = await docRef.get();

    res.status(201).json({
      id: docRef.id,
      ...createdCourse.data(),
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create course',
      details: error.message
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const validation = validateCourseData(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid course data',
        details: validation.errors
      });
    }

    const courseData = sanitizeCourseData(req.body);
    const updateData = {};

    if (courseData.title !== undefined) {
      updateData.title = courseData.title;
      updateData.slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (courseData.price !== undefined) {
      updateData.price = courseData.price;
    }
    if (courseData.description !== undefined) {
      updateData.description = courseData.description;
    }

    if (courseData.syllabus !== undefined) {
      updateData.syllabus = courseData.syllabus;
    }

    if (courseData.category) {
      Object.keys(courseData.category).forEach(key => {
        if (courseData.category[key] !== undefined) {
          updateData[`category.${key}`] = courseData.category[key];
        }
      });
    }
    if (courseData.specifications) {
      Object.keys(courseData.specifications).forEach(key => {
        if (courseData.specifications[key] !== undefined) {
          updateData[`specifications.${key}`] = courseData.specifications[key];
        }
      });
    }

    updateData['metadata.updatedAt'] = admin.firestore.Timestamp.now();
    if (courseData.metadata) {
      if (courseData.metadata.isPublished !== undefined) {
        updateData['metadata.isPublished'] = courseData.metadata.isPublished;
      }
      if (courseData.metadata.featured !== undefined) {
        updateData['metadata.featured'] = courseData.metadata.featured;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No fields to update.',
        details: []
      });
    }

    const courseRef = db.collection('courses').doc(req.params.id);
    await courseRef.update(updateData);
    const updatedDoc = await courseRef.get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update course',
      details: error.message
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseRef = db.collection('courses').doc(req.params.id);

    const courseData = req.course;
    if (courseData.metadata?.enrollments > 0) {
      return res.status(400).json({
        error: 'Cannot Delete',
        message: 'Cannot delete course with active enrollments. Please unpublish instead.',
        enrollments: courseData.metadata.enrollments
      });
    }

    await courseRef.delete();

    res.json({
      message: 'Course deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete course',
      details: error.message
    });
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
