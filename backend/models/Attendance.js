const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
      fields: ['student_id', 'date', 'course'],
      name: 'unique_attendance'
    }
  ]
});

// Define associations
Attendance.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});

Student.hasMany(Attendance, {
  foreignKey: 'studentId',
  as: 'attendances'
});

module.exports = Attendance;