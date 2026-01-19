const express = require('express');
const router = express.Router();
const enrollmentsController = require('../controllers/enrollmentsController');
const { verifyAuth } = require('../middleware/auth');

router.post('/', verifyAuth, enrollmentsController.enrollInCourse);
router.get('/student/:studentId', verifyAuth, enrollmentsController.getStudentEnrollments);
router.get('/course/:courseId', verifyAuth, enrollmentsController.getCourseEnrollments);
router.delete('/:enrollmentId', verifyAuth, enrollmentsController.unenrollFromCourse);
router.put('/:enrollmentId/progress', verifyAuth, enrollmentsController.updateProgress);

module.exports = router;
