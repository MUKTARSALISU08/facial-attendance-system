const Student = require('../models/Student');

// Get all students for the logged-in user
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { userId: req.user.id }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const { name, matricNumber, department, level, facialEncoding, photoUrl } = req.body;

    // Check if student with same matric number exists for this user
    const existingStudent = await Student.findOne({
      where: {
        matricNumber,
        userId: req.user.id
      }
    });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this matric number already exists' });
    }

    const student = await Student.create({
      userId: req.user.id,
      name,
      matricNumber,
      department,
      level,
      facialEncoding,
      photoUrl
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { name, department, level, facialEncoding, photoUrl } = req.body;

    const student = await Student.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update student details
    await student.update({
      name: name || student.name,
      department: department || student.department,
      level: level || student.level,
      facialEncoding: facialEncoding || student.facialEncoding,
      photoUrl: photoUrl || student.photoUrl
    });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students by department
exports.getStudentsByDepartment = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: {
        department: req.params.department,
        userId: req.user.id
      }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students by level
exports.getStudentsByLevel = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: {
        level: req.params.level,
        userId: req.user.id
      }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};