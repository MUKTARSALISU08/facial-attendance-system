const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent'),
    allowNull: false,
    defaultValue: 'present'
  },
  course: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'attendance',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'date', 'course', 'user_id'],
      name: 'unique_attendance'
    }
  ]
});

Attendance.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});

module.exports = Attendance;