const { db } = require('../config/firebase');
const admin = require('firebase-admin');

exports.enrollInCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'Missing required fields: studentId, courseId' });
    }

    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existingEnrollment = await db.collection('enrollments')
      .where('studentId', '==', studentId)
      .where('courseId', '==', courseId)
      .get();

    if (!existingEnrollment.empty) {
      return res.status(409).json({ error: 'Student already enrolled in this course' });
    }

    const enrollment = {
      studentId,
      courseId,
      courseName: courseDoc.data().title,
      instructorName: courseDoc.data().instructor.name,
      enrolledAt: admin.firestore.Timestamp.now(),
      progress: 0,
      completedLessons: [],
      status: 'active',
      lastAccessedAt: admin.firestore.Timestamp.now()
    };

    const docRef = await db.collection('enrollments').add(enrollment);

    await courseRef.update({
      'metadata.enrollments': admin.firestore.FieldValue.increment(1)
    });

    const createdEnrollment = await docRef.get();

    res.status(201).json({
      id: docRef.id,
      ...createdEnrollment.data()
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course', message: error.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const enrollmentsRef = db.collection('enrollments');
    const snapshot = await enrollmentsRef
      .where('studentId', '==', req.params.studentId)
      .orderBy('enrolledAt', 'desc')
      .get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const enrollments = [];
    snapshot.forEach(doc => {
      enrollments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Error getting student enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments', message: error.message });
  }
};

exports.getCourseEnrollments = async (req, res) => {
  try {
    const enrollmentsRef = db.collection('enrollments');
    const snapshot = await enrollmentsRef
      .where('courseId', '==', req.params.courseId)
      .get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const enrollments = [];
    snapshot.forEach(doc => {
      enrollments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Error getting course enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch course enrollments', message: error.message });
  }
};

exports.unenrollFromCourse = async (req, res) => {
  try {
    const enrollmentRef = db.collection('enrollments').doc(req.params.enrollmentId);
    const doc = await enrollmentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const enrollmentData = doc.data();

    const courseRef = db.collection('courses').doc(enrollmentData.courseId);
    await courseRef.update({
      'metadata.enrollments': admin.firestore.FieldValue.increment(-1)
    });

    await enrollmentRef.delete();

    res.json({ message: 'Unenrolled successfully', id: req.params.enrollmentId });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    res.status(500).json({ error: 'Failed to unenroll', message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { progress, completedLessons } = req.body;
    const enrollmentRef = db.collection('enrollments').doc(req.params.enrollmentId);
    const doc = await enrollmentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const updateData = {
      lastAccessedAt: admin.firestore.Timestamp.now()
    };

    if (progress !== undefined) {
      updateData.progress = Math.min(100, Math.max(0, progress));

      if (updateData.progress === 100) {
        updateData.status = 'completed';
      }
    }

    if (completedLessons) {
      updateData.completedLessons = completedLessons;
    }

    await enrollmentRef.update(updateData);
    const updatedDoc = await enrollmentRef.get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress', message: error.message });
  }
};
