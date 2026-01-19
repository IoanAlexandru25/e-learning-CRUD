const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const { verifyAuth, verifyInstructor, verifyCourseOwnership } = require('../middleware/auth');

router.get('/', coursesController.getAllCourses);
router.get('/instructor/:instructorId', coursesController.getCoursesByInstructor);
router.get('/:id', coursesController.getCourseById);
router.post('/', verifyAuth, verifyInstructor, coursesController.createCourse);
router.put('/:id', verifyAuth, verifyInstructor, verifyCourseOwnership, coursesController.updateCourse);
router.delete('/:id', verifyAuth, verifyInstructor, verifyCourseOwnership, coursesController.deleteCourse);

module.exports = router;
