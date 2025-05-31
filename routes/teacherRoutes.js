const express = require('express');
const { check } = require('express-validator');
const teacherController = require('../controllers/teacherController');

const router = express.Router();

// Validation rules
const teacherValidationRules = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('subject').optional().notEmpty().withMessage('Subject cannot be empty if provided'),
  check('department').optional().notEmpty().withMessage('Department cannot be empty if provided')
];

// Routes
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.post('/', teacherValidationRules, teacherController.createTeacher);
router.put('/:id', teacherValidationRules, teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;