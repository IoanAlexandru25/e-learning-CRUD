const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');

router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getCourseById);

// TODO: Adăugare middleware de autentificare în Commit 6
router.post('/', coursesController.createCourse);
router.put('/:id', coursesController.updateCourse);
router.delete('/:id', coursesController.deleteCourse);

router.get('/instructor/:instructorId', coursesController.getCoursesByInstructor);

module.exports = router;
