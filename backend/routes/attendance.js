const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Mark attendance for a student (protected route)
router.post('/', authMiddleware, attendanceController.markAttendance);

// Get all attendance records (protected route)
router.get('/', authMiddleware, attendanceController.getAllAttendance);

// Get attendance by student ID (protected route)
router.get('/student/:id', authMiddleware, attendanceController.getAttendanceByStudentId);

// Get attendance by date range (protected route)
router.get('/date-range', authMiddleware, attendanceController.getAttendanceByDateRange);

// Get attendance by course (protected route)
router.get('/course/:course', authMiddleware, attendanceController.getAttendanceByCourse);

// Generate attendance report (protected route)
router.get('/report/generate', authMiddleware, attendanceController.generateReport);

module.exports = router;