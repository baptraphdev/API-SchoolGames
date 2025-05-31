const Teacher = require('../models/teacher');
const { validationResult } = require('express-validator');

// Get all teachers
exports.getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.getAll();
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    next(error);
  }
};

// Get teacher by ID
exports.getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    if (error.message === 'Teacher not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// Create new teacher
exports.createTeacher = async (req, res, next) => {
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
    const existingTeacher = await Teacher.findByEmail(req.body.email);
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    const teacher = await Teacher.create(req.body);
    res.status(201).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

// Update teacher
exports.updateTeacher = async (req, res, next) => {
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
      const existingTeacher = await Teacher.findByEmail(req.body.email);
      if (existingTeacher && existingTeacher.id !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const teacher = await Teacher.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    if (error.message === 'Teacher not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res, next) => {
  try {
    await Teacher.delete(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.message === 'Teacher not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};