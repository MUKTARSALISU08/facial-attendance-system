# Requirements Specification

## 1. Functional Requirements

### 1.1 User Authentication and Authorization
- **FR1.1.1**: The system shall provide a secure login mechanism for users.
- **FR1.1.2**: The system shall support two user roles: Admin and Lecturer.
- **FR1.1.3**: The system shall enforce role-based access control to restrict functionality based on user roles.
- **FR1.1.4**: The system shall allow users to register with valid email addresses and secure passwords.
- **FR1.1.5**: The system shall implement password hashing to securely store user credentials.

### 1.2 Student Management
- **FR1.2.1**: The system shall allow authorized users to add new students with details including name, matric number, department, and level.
- **FR1.2.2**: The system shall allow authorized users to view, update, and delete student records.
- **FR1.2.3**: The system shall capture and store facial descriptors for each student using face-api.js.
- **FR1.2.4**: The system shall validate the uniqueness of student matric numbers during registration.
- **FR1.2.5**: The system shall allow authorized users to upload student photos for reference.

### 1.3 Attendance Management
- **FR1.3.1**: The system shall automatically mark attendance using facial recognition when a student's face is detected.
- **FR1.3.2**: The system shall record attendance with timestamp, date, student ID, and course information.
- **FR1.3.3**: The system shall prevent duplicate attendance entries for the same student in the same course on the same day.
- **FR1.3.4**: The system shall allow authorized users to manually mark attendance if needed.
- **FR1.3.5**: The system shall provide real-time feedback when attendance is marked successfully.

### 1.4 Reporting and Analytics
- **FR1.4.1**: The system shall generate attendance reports filtered by date range, course, and student.
- **FR1.4.2**: The system shall allow users to export attendance reports in CSV format.
- **FR1.4.3**: The system shall display attendance statistics on the dashboard, including total students and today's attendance.
- **FR1.4.4**: The system shall provide visual indicators for attendance status (present/absent).

### 1.5 Face Recognition
- **FR1.5.1**: The system shall use face-api.js for client-side facial recognition.
- **FR1.5.2**: The system shall detect faces in real-time using the device's webcam.
- **FR1.5.3**: The system shall compare detected faces with stored student facial descriptors.
- **FR1.5.4**: The system shall handle multiple face detections and identify each student individually.
- **FR1.5.5**: The system shall provide feedback on face detection quality (e.g., proper lighting, clear view).

### 1.6 User Interface
- **FR1.6.1**: The system shall provide a responsive web interface that works on desktops, tablets, and mobile devices.
- **FR1.6.2**: The system shall have a clear navigation structure with links to Dashboard, Scan, and Reports.
- **FR1.6.3**: The system shall display appropriate loading indicators during data processing.
- **FR1.6.4**: The system shall provide clear error messages and success notifications.
- **FR1.6.5**: The system shall allow users to configure course information for attendance sessions.

## 2. Non-Functional Requirements

### 2.1 Performance
- **NFR2.1.1**: The system shall load and initialize within 3 seconds on a standard internet connection.
- **NFR2.1.2**: The facial recognition process shall complete within 1-2 seconds per student.
- **NFR2.1.3**: The system shall handle up to 50 students in a single class session without performance degradation.
- **NFR2.1.4**: The system shall respond to API requests within 500 milliseconds under normal load.

### 2.2 Security
- **NFR2.2.1**: The system shall use JWT tokens for secure authentication.
- **NFR2.2.2**: The system shall implement HTTPS to encrypt data transmission.
- **NFR2.2.3**: The system shall hash user passwords using bcrypt with a minimum work factor of 10.
- **NFR2.2.4**: The system shall validate and sanitize all user inputs to prevent injection attacks.
- **NFR2.2.5**: The system shall implement CORS policies to restrict cross-origin requests.

### 2.3 Reliability
- **NFR2.3.1**: The system shall have an uptime of 99.5% during normal operating hours.
- **NFR2.3.2**: The system shall gracefully handle webcam permission denials and provide clear instructions to users.
- **NFR2.3.3**: The system shall maintain attendance records even if there are temporary network disruptions.
- **NFR2.3.4**: The system shall provide error logging for debugging purposes.

### 2.4 Usability
- **NFR2.4.1**: The system shall have an intuitive user interface with minimal training required.
- **NFR2.4.2**: The system shall provide clear visual instructions for facial positioning during recognition.
- **NFR2.4.3**: The system shall have a consistent design language across all pages.
- **NFR2.4.4**: The system shall be accessible to users with varying levels of technical expertise.

### 2.5 Compatibility
- **NFR2.5.1**: The system shall support the latest versions of Chrome, Firefox, Safari, and Edge browsers.
- **NFR2.5.2**: The system shall work on mobile devices with iOS 11+ and Android 7+.
- **NFR2.5.3**: The system shall adapt to different screen sizes and orientations.
- **NFR2.5.4**: The system shall handle different webcam resolutions and qualities.

### 2.6 Maintainability
- **NFR2.6.1**: The system shall be modular with clear separation of concerns between frontend and backend.
- **NFR2.6.2**: The system shall include comprehensive documentation for setup and maintenance.
- **NFR2.6.3**: The system shall use consistent coding conventions and naming practices.
- **NFR2.6.4**: The system shall include comments explaining complex functionality.

### 2.7 Scalability
- **NFR2.7.1**: The system shall be designed to support additional features such as course management and student profiles.
- **NFR2.7.2**: The database schema shall be optimized for scalability with appropriate indexes.
- **NFR2.7.3**: The system shall handle an increasing number of students and attendance records without performance loss.

### 2.8 Data Storage
- **NFR2.8.1**: The system shall use MySQL for storing structured data.
- **NFR2.8.2**: The system shall store facial descriptors as JSON strings in the database.
- **NFR2.8.3**: The system shall implement regular database backups.
- **NFR2.8.4**: The system shall comply with data protection regulations for storing personal information.

## 3. Technical Requirements

### 3.1 Technology Stack
- **TR3.1.1**: Frontend: HTML5, CSS3, JavaScript (Vanilla)
- **TR3.1.2**: Backend: Node.js with Express.js
- **TR3.1.3**: Database: MySQL
- **TR3.1.4**: Facial Recognition: face-api.js
- **TR3.1.5**: Authentication: JWT
- **TR3.1.6**: ORM: Sequelize

### 3.2 Infrastructure
- **TR3.2.1**: The system shall run on a Node.js server with Express.js framework.
- **TR3.2.2**: The system shall connect to a MySQL database for data storage.
- **TR3.2.3**: The frontend shall be served as static files or through a simple web server.
- **TR3.2.4**: The system shall use environment variables for configuration.

### 3.3 Dependencies
- **TR3.3.1**: Express.js for backend routing and middleware
- **TR3.3.2**: MySQL2 for database connectivity
- **TR3.3.3**: Sequelize as ORM
- **TR3.3.4**: bcryptjs for password hashing
- **TR3.3.5**: jsonwebtoken for authentication
- **TR3.3.6**: cors for cross-origin resource sharing
- **TR3.3.7**: dotenv for environment variable management
- **TR3.3.8**: face-api.js for facial recognition

### 3.4 Development Tools
- **TR3.4.1**: Git for version control
- **TR3.4.2**: NPM for package management
- **TR3.4.3**: Live-server or similar for frontend development

## 4. Acceptance Criteria

### 4.1 Authentication
- Users can register with valid credentials.
- Users can log in with correct email and password.
- Invalid login attempts are rejected with appropriate error messages.
- User sessions are maintained with JWT tokens.

### 4.2 Student Management
- New students can be added with all required information.
- Student facial descriptors are captured and stored correctly.
- Duplicate matric numbers are rejected during registration.
- Student records can be viewed, updated, and deleted.

### 4.3 Attendance Management
- Attendance is automatically marked when a student's face is detected.
- Duplicate attendance entries are prevented.
- Attendance records are stored with all required information.
- Real-time feedback is provided when attendance is marked.

### 4.4 Reporting
- Attendance reports can be generated with specified filters.
- Reports can be exported in CSV format.
- Dashboard displays accurate attendance statistics.
- Attendance status is clearly indicated in reports.

### 4.5 Face Recognition
- Faces are detected in real-time from the webcam.
- Detected faces are correctly matched with stored student descriptors.
- Multiple faces are handled simultaneously.
- Clear instructions are provided for optimal face detection.

### 4.6 User Interface
- The system is responsive and works on different devices.
- Navigation is clear and intuitive.
- Loading indicators are displayed during processing.
- Error messages and notifications are clear and helpful.

### 4.7 Performance and Security
- The system loads within 3 seconds.
- Facial recognition completes within 1-2 seconds per student.
- The system handles up to 50 students without performance issues.
- All security requirements are met, including password hashing and data encryption.

## 5. Scope Limitations

### 5.1 Exclusions
- **EL5.1.1**: The system does not support biometric authentication beyond facial recognition.
- **EL5.1.2**: The system does not integrate with external student information systems (SIS).
- **EL5.1.3**: The system does not support offline operation beyond initial model loading.
- **EL5.1.4**: The system does not provide advanced analytics or predictive attendance modeling.
- **EL5.1.5**: The system does not support multi-language interfaces.

### 5.2 Constraints
- **CO5.2.1**: The system relies on client-side facial recognition, which requires a modern browser with webcam access.
- **CO5.2.2**: The system requires a stable internet connection for API calls and initial model loading.
- **CO5.2.3**: The system's accuracy depends on lighting conditions and camera quality.
- **CO5.2.4**: The system is designed for educational institutions and may not be suitable for other environments.
- **CO5.2.5**: The system complies with data protection regulations but may require additional configuration for specific jurisdictions.