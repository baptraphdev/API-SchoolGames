const express = require('express');
const { check } = require('express-validator');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Validation rules
const studentValidationRules = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('grade').optional().isInt({ min: 1, max: 12 }).withMessage('Grade must be between 1 and 12'),
  check('age').optional().isInt({ min: 5, max: 25 }).withMessage('Age must be between 5 and 25')
];

// Routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentValidationRules, studentController.createStudent);
router.put('/:id', studentValidationRules, studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;