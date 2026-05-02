const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  matricNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  facialEncoding: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('facialEncoding');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('facialEncoding', JSON.stringify(value));
    }
  },
  photoUrl: {
    type: DataTypes.STRING(255),
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
  tableName: 'students',
  underscored: true
});

module.exports = Student;