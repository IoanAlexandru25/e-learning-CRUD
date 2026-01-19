const express = require('express');
const router = express.Router();
const enrollmentsController = require('../controllers/enrollmentsController');

// TODO: Adăugare middleware de autentificare în Commit 6
router.post('/', enrollmentsController.enrollInCourse);
router.get('/student/:studentId', enrollmentsController.getStudentEnrollments);
router.get('/course/:courseId', enrollmentsController.getCourseEnrollments);
router.delete('/:enrollmentId', enrollmentsController.unenrollFromCourse);

router.put('/:enrollmentId/progress', enrollmentsController.updateProgress);

module.exports = router;
