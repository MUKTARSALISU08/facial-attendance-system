const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all students (protected route)
router.get("/", authMiddleware, studentController.getAllStudents);

// Get students by department (protected route)
router.get(
  "/department/:department",
  authMiddleware,
  studentController.getStudentsByDepartment,
);

// Get students by level (protected route)
router.get(
  "/level/:level",
  authMiddleware,
  studentController.getStudentsByLevel,
);

// Get student by ID (protected route)
router.get("/:id", authMiddleware, studentController.getStudentById);

// Create new student (protected route)
router.post("/", authMiddleware, studentController.createStudent);

// Update student (protected route)
router.put("/:id", authMiddleware, studentController.updateStudent);

// Delete student (protected route)
router.delete("/:id", authMiddleware, studentController.deleteStudent);

module.exports = router;
