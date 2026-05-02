# System Design

## 1. Architecture Overview

The Smart Facial Recognition Attendance System follows a client-server architecture with a clear separation between frontend and backend components. The system is designed to be modular, scalable, and maintainable.

### 1.1 System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                             Client                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │  Web Interface  │  │ Face Recognition│  │  API Communication │  │
│  └─────────────────┘  └─────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                             Server                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  API Routes  │→ │ Controllers  │→ │   Models    │→ │ Database  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Description

#### Client Side
- **Web Interface**: Responsive HTML5/CSS3/JavaScript interface that provides user interaction
- **Face Recognition**: face-api.js library for client-side facial detection and recognition
- **API Communication**: JavaScript fetch API for communicating with backend endpoints

#### Server Side
- **API Routes**: Express.js routes that define endpoints for client requests
- **Controllers**: Business logic handlers that process requests and generate responses
- **Models**: Sequelize ORM models that define data structures and database interactions
- **Database**: MySQL relational database for storing user, student, and attendance data

## 2. Data Flow

### 2.1 User Authentication Flow
1. User submits login credentials through the web interface
2. Client sends POST request to `/api/auth/login` endpoint
3. Server verifies credentials and generates JWT token
4. Client stores token in localStorage for subsequent requests
5. Client includes token in headers for protected API calls

### 2.2 Student Registration Flow
1. User accesses student registration form
2. Client captures student face using webcam and extracts facial encoding
3. Client sends POST request to `/api/students` with student data and facial encoding
4. Server validates data and stores student record in database
5. Server returns success response to client

### 2.3 Attendance Marking Flow
1. User selects course and starts attendance session
2. Client initializes webcam and loads face-api.js models
3. Client detects faces in real-time and extracts facial encodings
4. Client compares detected encodings with stored student encodings
5. On match, client sends POST request to `/api/attendance` with student and session data
6. Server validates request and stores attendance record
7. Server returns success response with attendance details

### 2.4 Report Generation Flow
1. User specifies report filters (date range, course)
2. Client sends GET request to `/api/attendance` with filter parameters
3. Server queries database for matching attendance records
4. Server returns attendance data to client
5. Client displays data in table format
6. User can export data as CSV

## 3. Database Design

### 3.1 Entity-Relationship Diagram

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│    Users    │      │  Students   │      │ Attendance  │
├─────────────┤      ├─────────────┤      ├─────────────┤
│ id (PK)     │      │ id (PK)     │      │ id (PK)     │
│ name        │      │ name        │      │ student_id  │
│ email       │      │ matric_number│     │ date        │
│ password    │      │ department  │      │ time        │
│ role        │      │ level       │      │ status      │
│ created_at  │      │ facial_encoding│   │ course      │
│ updated_at  │      │ photo_url   │      │ created_at  │
└─────────────┘      │ created_at  │      │ updated_at  │
                     │ updated_at  │      └─────────────┘
                     └─────────────┘           ▲
                                               │
                                               │
                                               │
                               ┌──────────────────────────────┐
                               │ Foreign Key: student_id -> id│
                               └──────────────────────────────┘
```

### 3.2 Table Descriptions

#### Users Table
- **id**: INT, PRIMARY KEY, AUTO_INCREMENT
- **name**: VARCHAR(100), NOT NULL
- **email**: VARCHAR(100), NOT NULL, UNIQUE
- **password**: VARCHAR(255), NOT NULL (hashed)
- **role**: ENUM('admin', 'lecturer'), NOT NULL, DEFAULT 'lecturer'
- **created_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### Students Table
- **id**: INT, PRIMARY KEY, AUTO_INCREMENT
- **name**: VARCHAR(100), NOT NULL
- **matric_number**: VARCHAR(20), NOT NULL, UNIQUE
- **department**: VARCHAR(100), NOT NULL
- **level**: VARCHAR(10), NOT NULL
- **facial_encoding**: TEXT, JSON string of Float32Array
- **photo_url**: VARCHAR(255), optional
- **created_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

#### Attendance Table
- **id**: INT, PRIMARY KEY, AUTO_INCREMENT
- **student_id**: INT, NOT NULL, FOREIGN KEY REFERENCES students(id) ON DELETE CASCADE
- **date**: DATE, NOT NULL
- **time**: TIME, NOT NULL
- **status**: ENUM('present', 'absent'), NOT NULL, DEFAULT 'present'
- **course**: VARCHAR(100), NOT NULL
- **created_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- **UNIQUE KEY**: (student_id, date, course) to prevent duplicates

### 3.3 Indexes

- **Users Table**: INDEX on email for faster login
- **Students Table**: INDEX on matric_number for faster lookup
- **Attendance Table**: INDEX on date, course, and student_id for faster reporting

## 4. API Design

### 4.1 Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | /api/auth/register | Register new user | {name, email, password, role} | {id, name, email, role, token} |
| POST | /api/auth/login | User login | {email, password} | {id, name, email, role, token} |
| GET | /api/auth/profile | Get current user profile | N/A | {id, name, email, role} |

### 4.2 Student Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | /api/students | Get all students | N/A | [{id, name, matric_number, ...}] |
| GET | /api/students/:id | Get student by ID | N/A | {id, name, matric_number, ...} |
| POST | /api/students | Create new student | {name, matric_number, department, level, facial_encoding} | {id, name, matric_number, ...} |
| PUT | /api/students/:id | Update student | {name, department, level, facial_encoding} | {id, name, matric_number, ...} |
| DELETE | /api/students/:id | Delete student | N/A | {message: "Student deleted successfully"} |
| GET | /api/students/department/:department | Get students by department | N/A | [{id, name, matric_number, ...}] |
| GET | /api/students/level/:level | Get students by level | N/A | [{id, name, matric_number, ...}] |

### 4.3 Attendance Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | /api/attendance | Mark attendance | {studentId, date, time, course} | {id, studentId, date, time, course, student} |
| GET | /api/attendance | Get attendance records | Query params: startDate, endDate, course | [{id, studentId, date, time, course, student}] |
| GET | /api/attendance/student/:id | Get attendance by student | N/A | [{id, studentId, date, time, course}] |
| GET | /api/attendance/course/:course | Get attendance by course | N/A | [{id, studentId, date, time, course, student}] |
| GET | /api/attendance/report/generate | Generate attendance report | Query params: startDate, endDate, course | CSV file download |

## 5. Frontend Design

### 5.1 Page Structure

#### Public Pages
- **index.html**: Landing page with system overview and features
- **login.html**: User login form
- **register.html**: User registration form

#### Protected Pages
- **dashboard.html**: Main dashboard with attendance statistics and quick actions
- **scan.html**: Face recognition interface for marking attendance
- **reports.html**: Attendance reporting and export interface

### 5.2 Navigation Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Login     │────→ │ Dashboard   │────→ │   Scan      │
└─────────────┘      └─────────────┘      └─────────────┘
      ↑                  │                      │
      │                  │                      │
      │                  ↓                      │
      │            ┌─────────────┐            │
      └────────────│  Reports    │◄───────────┘
                   └─────────────┘
```

### 5.3 Responsive Design

The frontend uses a mobile-first approach with responsive design principles:

- **Breakpoints**: Desktop (1200px+), Tablet (768px-1199px), Mobile (480px-767px)
- **Flexbox/Grid**: Used for layout and alignment
- **Media Queries**: Adjusts content layout based on screen size
- **Fluid Typography**: Font sizes adjust based on viewport width
- **Touch-Friendly UI**: Larger buttons and interactive elements for mobile devices

## 6. Facial Recognition Implementation

### 6.1 Model Loading
- **SSD Mobilenet V1**: For face detection
- **Face Landmark 68**: For facial feature extraction
- **Face Recognition**: For generating facial descriptors

### 6.2 Recognition Process
1. **Initialization**: Load required face-api.js models
2. **Face Detection**: Detect faces in webcam stream
3. **Feature Extraction**: Extract facial landmarks and descriptors
4. **Comparison**: Compare with stored student descriptors
5. **Matching**: Find best match above confidence threshold
6. **Attendance Marking**: Submit attendance for matched student

### 6.3 Performance Optimization
- **Model Caching**: Load models once and reuse
- **Frame Rate Control**: Limit processing to 1 frame per second
- **Memory Management**: Dispose unused resources
- **Error Handling**: Gracefully handle detection failures

## 7. Security Considerations

### 7.1 Authentication Security
- **Password Hashing**: bcrypt with salt for secure password storage
- **JWT Tokens**: Stateless authentication with expiration
- **Token Validation**: Verify token integrity for protected routes

### 7.2 Data Security
- **HTTPS**: Encrypted data transmission
- **Input Validation**: Sanitize all user inputs
- **CORS Policy**: Restrict cross-origin requests
- **Facial Data**: Store only facial descriptors, not raw images

### 7.3 Privacy Considerations
- **Data Minimization**: Collect only necessary student information
- **User Consent**: Obtain consent for facial data collection
- **Data Retention**: Define clear policies for data storage duration
- **Access Control**: Restrict access to sensitive data based on user roles

## 8. Scalability and Extensibility

### 8.1 Scalability Features
- **Modular Architecture**: Separation of concerns for easy scaling
- **Database Indexes**: Optimized queries for large datasets
- **API Design**: RESTful endpoints for consistent interaction
- **Caching**: Potential for caching frequent requests

### 8.2 Extensibility Options
- **Additional Roles**: Support for staff, teaching assistants
- **Course Management**: Add course creation and management
- **Integration**: API endpoints for integration with other systems
- **Advanced Analytics**: Enhanced reporting and predictive features
- **Mobile App**: Native mobile application for offline capabilities

## 9. Deployment Considerations

### 9.1 Production Environment
- **Server Configuration**: Optimized Express.js server
- **Database Optimization**: MySQL performance tuning
- **Load Balancing**: Potential for horizontal scaling
- **Monitoring**: Server and application monitoring

### 9.2 Environment Variables
- **Database Credentials**: Stored securely in environment variables
- **JWT Secret**: Environment-specific secret keys
- **API Endpoints**: Configurable base URL

### 9.3 Backup and Recovery
- **Database Backups**: Regular automated backups
- **Data Recovery Plan**: Procedures for data loss scenarios
- **System Monitoring**: Alerts for critical issues

## 10. Conclusion

The Smart Facial Recognition Attendance System is designed to address the inefficiencies of traditional attendance systems through the use of AI-powered facial recognition technology. The system's modular architecture, responsive design, and secure implementation make it a viable solution for educational institutions looking to modernize their attendance processes.

By automating attendance marking, providing real-time data, and offering comprehensive reporting capabilities, the system not only saves time but also improves accuracy and accountability. The use of client-side facial recognition ensures privacy and reduces server load, while the relational database design provides a solid foundation for data management.

The system's extensibility allows for future enhancements, such as integration with other academic systems, advanced analytics, and mobile applications, making it a scalable solution that can grow with the needs of educational institutions.