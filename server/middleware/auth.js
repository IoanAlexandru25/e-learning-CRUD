const admin = require('firebase-admin');
const { db } = require('../config/firebase');

const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    const displayName = userRecord.displayName || decodedToken.email.split('@')[0];
    const role = displayName.includes('[INSTRUCTOR]') ? 'instructor' : 'student';

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: displayName.replace('[INSTRUCTOR]', '').trim(),
      displayName: displayName,
      role: role
    };

    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

const verifyAuthOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0]
    };

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const verifyInstructor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'instructor') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Only instructors can perform this action'
    });
  }

  next();
};

const verifyCourseOwnership = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const courseRef = db.collection('courses').doc(courseId);
    const doc = await courseRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    const courseData = doc.data();
    const courseOwnerId = courseData.instructor?.id || courseData.metadata?.createdBy;

    if (courseOwnerId !== req.user.uid) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only modify your own courses'
      });
    }

    req.course = {
      id: doc.id,
      ...courseData
    };

    next();
  } catch (error) {
    console.error('Ownership verification error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to verify course ownership'
    });
  }
};

module.exports = {
  verifyAuth,
  verifyAuthOptional,
  verifyInstructor,
  verifyCourseOwnership
};
