const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { Op } = require('sequelize');

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, time, course } = req.body;

    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if attendance already marked for this student on this date and course
    const existingAttendance = await Attendance.findOne({
      where: {
        studentId,
        date,
        course
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this student' });
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      studentId,
      date,
      time,
      status: 'present',
      course
    });

    res.status(201).json({
      ...attendance.toJSON(),
      student: {
        id: student.id,
        name: student.name,
        matricNumber: student.matricNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'matricNumber', 'department', 'level']
      }]
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance by student ID
exports.getAttendanceByStudentId = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { studentId: req.params.id },
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'matricNumber', 'department', 'level']
      }]
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance by date range
exports.getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, course } = req.query;

    const whereClause = {
      date: {
        [Op.between]: [startDate, endDate]
      }
    };

    if (course) {
      whereClause.course = course;
    }

    const attendance = await Attendance.findAll({
      where: whereClause,
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'matricNumber', 'department', 'level']
      }]
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance by course
exports.getAttendanceByCourse = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { course: req.params.course },
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'matricNumber', 'department', 'level']
      }]
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate attendance report (CSV format)
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, course } = req.query;

    const whereClause = {};

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    if (course) {
      whereClause.course = course;
    }

    const attendance = await Attendance.findAll({
      where: whereClause,
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'matricNumber', 'department', 'level']
      }],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    // Convert to CSV format
    let csvContent = 'Name,Matric Number,Department,Level,Date,Time,Status,Course\n';
    
    attendance.forEach(record => {
      csvContent += `${record.student.name},${record.student.matricNumber},${record.student.department},${record.student.level},${record.date},${record.time},${record.status},${record.course}\n`;
    });

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};