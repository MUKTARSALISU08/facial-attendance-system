# Smart Facial Recognition Attendance System (SFRAS)

A complete, production-ready, modular, and well-documented web-based system that automates student attendance using AI-powered facial recognition.

## 🎯 Project Overview

SFRAS (Smart Facial Recognition Attendance System) is a modern attendance management solution that leverages face-api.js for real-time facial recognition directly in the browser. The system enables educational institutions to automate attendance tracking with features like batch student import, email notifications, attendance reports, and a responsive mobile-first interface.

## 📦 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables, Flexbox, Grid
- **JavaScript (ES6+)** - Vanilla JavaScript with modular architecture
- **face-api.js** - Client-side facial recognition

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **MySQL** - Relational database
- **JSON Web Tokens (JWT)** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email functionality
- **Multer** - File uploads

### Development Tools
- **Git** - Version control
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

## 🧱 Project Structure

```
facial-attendance-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── studentController.js  # Student management logic
│   │   ├── attendanceController.js # Attendance operations
│   │   └── profileController.js  # User profile management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication middleware
│   │   └── uploadMiddleware.js   # File upload handling
│   ├── models/
│   │   ├── User.js              # User model with password reset
│   │   ├── Student.js           # Student model with facial encoding
│   │   ├── Attendance.js       # Attendance records model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── students.js          # Student management routes
│   │   ├── attendance.js        # Attendance routes
│   │   └── profile.js           # Profile routes
│   ├── uploads/
│   │   └── profile-images/      # Uploaded profile images
│   ├── server.js               # Express server entry point
│   └── package.json
├── frontend/
│   ├── index.html               # Landing page
│   ├── login.html               # User login
│   ├── register.html            # User registration
│   ├── dashboard.html           # Main dashboard
│   ├── scan.html                # Face scanning page
│   ├── reports.html             # Attendance reports
│   ├── students.html            # Student management
│   ├── attendance-history.html  # Attendance history view
│   ├── settings.html            # User settings
│   ├── forgot-password.html     # Password reset request
│   ├── reset-password.html      # Password reset form
│   ├── css/
│   │   └── style.css           # Complete styling with dark mode
│   ├── js/
│   │   ├── main.js             # Core functionality & dark mode
│   │   ├── api.js              # API client
│   │   ├── faceRecognition.js  # Face-api.js integration
│   │   └── utils.js            # Utility functions
│   ├── assets/
│   │   └── models/             # face-api.js model files
│   │       ├── ssd_mobilenetv1_model-shard1
│   │       ├── face_landmark_68_model-shard1
│   │       └── face_recognition_model-shard1
│   └── Image/
│       └── header.jpg          # Header image asset
├── docs/
│   ├── problem_statement.md    # Project problem statement
│   ├── requirements.md         # Requirements specification
│   ├── design.md               # System design document
│   └── srs.md                  # Software requirements specification
├── database/
│   ├── schema.sql             # Database schema
│   └── seed.sql               # Sample data
├── package.json               # Root package configuration
├── .env                       # Environment variables
├── .gitignore
└── README.md
```

## 🔐 Key Features

### 1. Authentication System

#### User Registration
- Secure registration with name, email, password, and role selection
- Roles supported: `admin`, `lecturer`, `class_monitor`
- Automatic password hashing with bcrypt (10 salt rounds)
- Welcome email sent upon successful registration

#### User Login
- JWT-based authentication with 24-hour token expiration
- Secure password comparison using bcrypt
- Role-based access control
- Profile image support

#### Password Reset
- Email-based password reset functionality
- Secure token generation using crypto
- SHA-256 hashed tokens stored in database
- 1-hour token expiration for security
- Confirmation email sent after successful reset

### 2. Student Management

#### Individual Student Registration
- Form input: Name, Matric Number, Department, Level
- Photo upload with automatic facial encoding extraction
- Face-api.js integration for facial descriptor capture
- Unique constraint on matric number per user

#### Batch Student Import
- CSV file upload with drag-and-drop interface
- Required columns: `name`, `matricNumber`
- Optional columns: `department`, `level`
- Preview functionality before import
- Detailed success/failure reporting
- Validation for duplicate matric numbers

#### Student Operations
- View all students with filtering by department or level
- Update student information
- Delete students
- Search and manage student records

### 3. Face-Based Attendance Marking

#### Real-Time Face Detection
- Webcam access with getUserMedia API
- Face detection using SSD MobileNet v1
- 68-point facial landmark detection
- Face recognition with 128-dimensional encoding
- Recognition threshold: 0.6 (configurable)
- Real-time face matching against registered students

#### Attendance Processing
- Automatic student identification from facial match
- Timestamp recording with date and time
- Course/session association
- Duplicate entry prevention (one attendance per student per course per day)
- Email notification sent to marked student

### 4. Attendance Reports

#### Report Generation
- Filter by date range
- Filter by course
- Combined filters supported
- CSV export with complete attendance data
- Email report as attachment
- Student details included: name, matric number, department, level

#### Report Fields
- Student Name
- Matric Number
- Department
- Level
- Date
- Time
- Status (present/absent)
- Course

### 5. User Interface

#### Dark Mode
- Toggle between light and dark themes
- Persistent theme preference in localStorage
- CSS variable-based theming
- Smooth transition animations

#### Notifications
- Toast notifications for success/error messages
- Loading spinners during API operations
- User-friendly error messages

#### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Collapsible sidebar navigation
- Touch-friendly interface elements

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "lecturer"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "lecturer",
  "profile_image": null,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "lecturer",
  "profile_image": "profile-123456789.jpg",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent successfully"
}
```

#### POST /api/auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "abc123def456...",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

#### GET /api/auth/profile
Get current user profile. **Requires authentication.**

**Headers:**
```
x-auth-token: <jwt_token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "lecturer"
}
```

### Student Endpoints

All student endpoints require authentication.

#### GET /api/students
Get all students for the authenticated user.

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Jane Smith",
    "matricNumber": "U18/FNS/CIT/001",
    "department": "Computer Science",
    "level": "100",
    "facialEncoding": "[0.123, -0.456, ...]",
    "photoUrl": "profile-123456789.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### POST /api/students
Create a new student.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "matricNumber": "U18/FNS/CIT/001",
  "department": "Computer Science",
  "level": "100",
  "facialEncoding": [0.123, -0.456, ...],
  "photoUrl": "profile-123456789.jpg"
}
```

**Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "name": "Jane Smith",
  "matricNumber": "U18/FNS/CIT/001",
  "department": "Computer Science",
  "level": "100",
  "facialEncoding": [0.123, -0.456, ...],
  "photoUrl": "profile-123456789.jpg"
}
```

#### POST /api/students/import
Batch import students from CSV data.

**Request Body:**
```json
{
  "students": [
    {
      "name": "John Doe",
      "matricNumber": "U18/FNS/CIT/002",
      "department": "Computer Science",
      "level": "100"
    },
    {
      "name": "Jane Doe",
      "matricNumber": "U18/FNS/CIT/003",
      "department": "Information Technology",
      "level": "200"
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Import completed: 2 successful, 0 failed",
  "results": {
    "success": [
      { "id": 2, "name": "John Doe", "matricNumber": "U18/FNS/CIT/002" },
      { "id": 3, "name": "Jane Doe", "matricNumber": "U18/FNS/CIT/003" }
    ],
    "failed": [],
    "total": 2
  }
}
```

#### GET /api/students/department/:department
Get students by department.

#### GET /api/students/level/:level
Get students by level.

#### PUT /api/students/:id
Update a student.

#### DELETE /api/students/:id
Delete a student.

### Attendance Endpoints

All attendance endpoints require authentication.

#### POST /api/attendance
Mark attendance for a student.

**Request Body:**
```json
{
  "studentId": 1,
  "date": "2024-01-15",
  "time": "09:30:00",
  "course": " CSC301"
}
```

**Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "studentId": 1,
  "date": "2024-01-15",
  "time": "09:30:00",
  "status": "present",
  "course": "CSC301",
  "student": {
    "id": 1,
    "name": "Jane Smith",
    "matricNumber": "U18/FNS/CIT/001"
  }
}
```

#### GET /api/attendance
Get all attendance records.

#### GET /api/attendance/student/:id
Get attendance records for a specific student.

#### GET /api/attendance/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&course=CSC301
Get attendance records within a date range.

#### GET /api/attendance/course/:course
Get attendance records for a specific course.

#### GET /api/attendance/report/generate?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&course=CSC301&sendEmail=true
Generate attendance report. Set `sendEmail=true` to email the report.

**Response (CSV download or email):**
```csv
Name,Matric Number,Department,Level,Date,Time,Status,Course
Jane Smith,U18/FNS/CIT/001,Computer Science,100,2024-01-15,09:30:00,present,CSC301
```

## ⚙️ Setup Instructions (Windows)

### Prerequisites

- **Node.js** v14 or later ([Download](https://nodejs.org/))
- **MySQL** 8.0 or later ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** for version control ([Download](https://git-scm.com/))

### 1. Clone or Download the Project

```powershell
# If using Git
git clone <repository-url>
cd facial-attendance-system

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```powershell
# Install backend dependencies
cd backend
npm install

# Return to root and install root dependencies
cd ..
npm install
```

### 3. Set Up MySQL Database

**Option A: Using MySQL Command Line**

```powershell
# Log into MySQL
mysql -u root -p

# Create database
CREATE DATABASE facial_attendance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
EXIT;

# Import schema (if you have schema.sql in database folder)
# Get-Content database\schema.sql | mysql -u root -p facial_attendance
```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new database named `facial_attendance`
4. Select UTF-8 character set and utf8mb4 collation
5. Create tables according to the Sequelize models (or import schema.sql if available)

### 4. Configure Environment Variables

Create a `.env` file in the project root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=facial_attendance

# Server Configuration
PORT=3000

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_very_strong_jwt_secret_key_minimum_32_characters

# Email Configuration (for password reset and notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@sfras.com

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000
```

**Note:**
- Replace `your_mysql_password` with your actual MySQL root password
- For Gmail, you need an [App Password](https://support.google.com/accounts/answer/185833) if 2FA is enabled
- For other email services, update `EMAIL_SERVICE` accordingly (e.g., 'Outlook', 'Yahoo', etc.)

### 5. Default User Credentials

Create a default admin user by registering through the UI or using the API:

```powershell
# Register via API
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}'
```

### 6. Run the Backend Server

```powershell
# From the backend directory
cd backend
npm start

# Or for development with auto-reload
npx nodemon server.js
```

The backend server will start on http://localhost:3000

### 7. Serve the Frontend

**Option A: Using live-server (Recommended)**

```powershell
# Install live-server globally
npm install -g live-server

# Run live-server from frontend directory
cd frontend
live-server --port=8080
```

**Option B: Using Python**

```powershell
# Python 3
cd frontend
python -m http.server 8080
```

**Option C: Using Node.js static server**

```powershell
npx http-server frontend -p 8080
```

The frontend will be available at http://127.0.0.1:8080

### 8. Verify face-api.js Models

The face-api.js models are pre-installed in `frontend/assets/models/`. If you need to re-download them:

1. Create a `weights` folder in `frontend/assets/models/`
2. Download these files from [face-api.js weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights):
   - `ssd_mobilenetv1_model-shard1`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-shard1`
   - And their corresponding JSON weight manifest files

## 🚀 Deployment Guide

### Option 1: Deploy to a VPS (Recommended for Production)

#### Step 1: Choose a VPS Provider

- **DigitalOcean** - Easy to use, good for beginners
- **AWS EC2** - Scalable, enterprise-grade
- **Google Cloud Platform** - Reliable, good integration
- **Vultr** - Affordable, good performance

#### Step 2: Set Up the Server

```bash
# Connect via SSH
ssh root@your-server-ip

# Update the server
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

#### Step 3: Configure MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql
```

```sql
CREATE DATABASE facial_attendance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'facial_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON facial_attendance.* TO 'facial_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 4: Upload Project Files

```bash
# Clone repository or upload via scp
cd /var/www
git clone your-repository-url facial-attendance-system
cd facial-attendance-system
```

#### Step 5: Install Dependencies and Configure

```bash
cd backend
npm install

# Create .env file
nano .env
```

```env
DB_HOST=localhost
DB_USER=facial_user
DB_PASSWORD=your_secure_password
DB_NAME=facial_attendance
PORT=3000
JWT_SECRET=your_very_strong_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://your-domain.com
```

#### Step 6: Start Backend with PM2

```bash
pm2 start backend/server.js --name facial-attendance-backend
pm2 save
pm2 startup
```

#### Step 7: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/facial-attendance
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/facial-attendance-system/frontend;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Profile images
    location /uploads/ {
        alias /var/www/facial-attendance-system/backend/uploads/;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/facial-attendance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 8: Set Up SSL

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Option 2: Deploy to Railway (Simplest)

1. Create account at [Railway.app](https://railway.app)
2. Connect GitHub repository
3. Add MySQL database
4. Deploy backend with environment variables
5. Deploy frontend as static site

### Option 3: Deploy to Render

1. Create account at [Render.com](https://render.com)
2. Create Web Service for backend
3. Create PostgreSQL or MySQL database
4. Set environment variables
5. Deploy frontend to Render Static Sites

## 📊 Database Schema

### Users Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL |
| role | ENUM('admin','lecturer','class_monitor') | NOT NULL, DEFAULT 'lecturer' |
| profile_image | VARCHAR(255) | NULL |
| resetPasswordToken | VARCHAR(255) | NULL |
| resetPasswordExpires | DATETIME | NULL |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### Students Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| user_id | INTEGER | FOREIGN KEY (users.id) |
| name | VARCHAR(100) | NOT NULL |
| matric_number | VARCHAR(20) | NOT NULL |
| department | VARCHAR(100) | NOT NULL |
| level | VARCHAR(10) | NOT NULL |
| facial_encoding | TEXT | NULL |
| photo_url | VARCHAR(255) | NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

**Unique Constraint:** `UNIQUE(matric_number, user_id)`

### Attendance Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| user_id | INTEGER | FOREIGN KEY (users.id) |
| student_id | INTEGER | FOREIGN KEY (students.id) |
| date | DATE | NOT NULL |
| time | TIME | NOT NULL |
| status | ENUM('present','absent') | NOT NULL, DEFAULT 'present' |
| course | VARCHAR(100) | NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

**Unique Constraint:** `UNIQUE(student_id, date, course, user_id)`

## 🔒 Security Features

### Authentication
- JWT-based stateless authentication
- Password hashing with bcrypt (10 salt rounds)
- 24-hour token expiration

### Password Reset
- Cryptographically secure token generation
- SHA-256 hashed tokens stored in database
- 1-hour token expiration
- Token cleared after use

### Authorization
- Role-based access control (RBAC)
- User-scoped data isolation
- Protected API routes via middleware

### Data Protection
- Parameterized queries (via Sequelize) preventing SQL injection
- Input validation on all endpoints
- CORS configuration for API security

## 🎨 UI/UX Features

### Dark Mode
- Toggle button in dashboard header
- Theme persisted in localStorage
- CSS variable-based theming
- Smooth theme transitions

### Toast Notifications
- Success, error, and warning states
- Auto-dismiss after 3 seconds
- Stacked notification display
- User-friendly messages

### Loading States
- Loading spinners during API calls
- Button disabled states during submission
- Visual feedback for all async operations

### Responsive Design
- Mobile-first CSS approach
- Breakpoints: 480px, 768px, 1024px, 1280px
- Collapsible sidebar on mobile
- Touch-optimized interface

## 💡 Feature Suggestions (Future Development)

### Implemented ✅
- Password Reset Functionality
- Email Notifications
- Dark Mode & Toast Notifications
- Batch Student Import

### Advanced Features

1. **Multiple Face Recognition Models**
   - Support for FaceNet, ArcFace algorithms
   - Model switching capability
   - Enhanced accuracy options

2. **Liveness Detection**
   - Blink detection to prevent photo spoofing
   - Head movement verification
   - 3D depth sensing

3. **Attendance Analytics Dashboard**
   - Charts and graphs (Chart.js/D3.js)
   - Attendance trends analysis
   - Student performance rankings
   - Course comparison metrics

4. **Course Management System**
   - Course CRUD operations
   - Lecturer-course assignment
   - Class schedule management

5. **Multi-Campus Support**
   - Campus/branches management
   - User-campus assignment
   - Campus-wise reporting

6. **Mobile Application**
   - React Native or Flutter app
   - Offline attendance capability
   - Push notifications

7. **LMS Integration**
   - Moodle, Canvas, BlackBoard sync
   - Single Sign-On (SSO)
   - Automatic gradebook updates

8. **Real-time Monitoring**
   - Live attendance dashboard
   - Absentee alerts
   - Attendance percentage tracking

### Security Enhancements

9. **Two-Factor Authentication (2FA)**
   - TOTP-based 2FA
   - SMS or email verification
   - Authenticator app support

10. **Rate Limiting & CAPTCHA**
    - Brute-force attack prevention
    - API request throttling
    - Login CAPTCHA

11. **Audit Logging**
    - User action tracking
    - Attendance modification logs
    - Security incident monitoring

12. **Data Encryption**
    - Encryption at rest
    - HTTPS enforcement
    - Secure file storage

### Performance Improvements

13. **Caching System**
    - Redis for session management
    - Query result caching
    - API response caching

14. **Background Processing**
    - Queue-based attendance processing
    - Async email sending
    - Facial recognition offloading

15. **Scalability**
    - Containerization (Docker)
    - Load balancing
    - Database replication

## 📝 Usage Guide

### Registering Students

1. Log in to the dashboard
2. Navigate to "Students" page
3. Click "Add Student" or use "Import Students" for bulk import
4. Fill in student details or upload CSV file
5. Capture facial encoding using the webcam
6. Submit to save student record

### Taking Attendance

1. Navigate to "Scan" page
2. Allow webcam access when prompted
3. Select course from dropdown
4. Click "Start Scanning"
5. Students will be automatically recognized and attendance marked
6. View marked attendance in "Attendance History"

### Generating Reports

1. Navigate to "Reports" page
2. Select date range
3. Optionally filter by course
4. Click "Generate Report"
5. Choose to download CSV or send via email

### Resetting Password

1. Click "Forgot Password" on login page
2. Enter your registered email
3. Check email for reset link
4. Click the link in the email
5. Enter new password
6. Login with new credentials

## 🐛 Troubleshooting

### Webcam Not Working
- Ensure browser has camera permissions
- Try HTTPS (required for getUserMedia in some browsers)
- Check if another application is using the camera

### Face Recognition Not Accurate
- Ensure good lighting on face
- Look directly at the camera
- Remove glasses or hats if recognition fails
- Retake facial photos in better conditions

### Email Not Sending
- Verify email credentials in .env
- For Gmail, generate an App Password
- Check if less secure app access is enabled (for non-2FA accounts)

### Database Connection Issues
- Verify MySQL is running
- Check credentials in .env file
- Ensure database exists
- Check firewall settings

## 📚 Documentation

- **Problem Statement**: `docs/problem_statement.md`
- **Requirements**: `docs/requirements.md`
- **System Design**: `docs/design.md`
- **Software Requirements Specification**: `docs/srs.md`

## 🚨 Important Notes

- **No External Paid Services**: Uses only open-source `face-api.js` for facial recognition
- **Offline Capability**: Works offline after initial model load
- **Browser Requirements**: Modern browser with WebRTC support (Chrome, Firefox, Edge, Safari)
- **Camera Access**: HTTPS required for webcam access in production
- **Academic Project**: Focused on clarity over complexity
- **Security**: Implements basic security measures, suitable for academic purposes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Muktar Salisu Bulama**

## 🙏 Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Client-side facial recognition
- [Express.js](https://expressjs.com/) - Backend framework
- [Sequelize](https://sequelize.org/) - ORM for Node.js
- [Nodemailer](https://nodemailer.com/) - Email sending library

---

Made with ❤️ for educational purposes

**Version:** 1.0.0
**Last Updated:** 2026-05-10
