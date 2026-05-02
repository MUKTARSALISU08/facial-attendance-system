const sequelize = require('../config/db');
const User = require('./User');
const Student = require('./Student');
const Attendance = require('./Attendance');

// Define associations
// User has many Students
User.hasMany(Student, {
  foreignKey: 'userId',
  as: 'students'
});

// Student belongs to User
Student.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User has many Attendance records
User.hasMany(Attendance, {
  foreignKey: 'userId',
  as: 'attendanceRecords'
});

// Attendance belongs to User
Attendance.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Student has many Attendance records
Student.hasMany(Attendance, {
  foreignKey: 'studentId',
  as: 'attendanceRecords'
});

// Attendance belongs to Student
Attendance.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});

module.exports = {
  sequelize,
  User,
  Student,
  Attendance
};