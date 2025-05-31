const Student = require('../models/student');
const { validationResult } = require('express-validator');

// Get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.getAll();
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// Get student by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// Create new student
exports.createStudent = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if email already exists
    const existingStudent = await Student.findByEmail(req.body.email);
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Update student
exports.updateStudent = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if email is being updated and already exists
    if (req.body.email) {
      const existingStudent = await Student.findByEmail(req.body.email);
      if (existingStudent && existingStudent.id !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const student = await Student.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// Delete student
exports.deleteStudent = async (req, res, next) => {
  try {
    await Student.delete(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};