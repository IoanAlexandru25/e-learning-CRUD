const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const { verifyAuth } = require('../middleware/auth');

router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getCourseById);
router.get('/instructor/:instructorId', coursesController.getCoursesByInstructor);
router.post('/', verifyAuth, coursesController.createCourse);
router.put('/:id', verifyAuth, coursesController.updateCourse);
router.delete('/:id', verifyAuth, coursesController.deleteCourse);

module.exports = router;
