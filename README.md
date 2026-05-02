# Smart Facial Recognition Attendance System

A complete, production-ready, modular, and well-documented web-based system that automates student attendance using AI-powered facial recognition.

## 🎯 Project Goals

- Automate classroom attendance using AI-powered facial recognition
- Provide a secure, mobile-first web app for lecturers and admins
- Store attendance records accurately in a relational database
- Enable report generation and export
- Demonstrate real-world engineering: system design, backend logic, AI integration

## 📦 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Facial Recognition**: face-api.js (client-side, browser-based)
- **Version Control**: Git

## 🧱 Project Structure

```
facial-attendance-system/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   └── attendance.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   └── attendanceController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   └── Attendance.js
│   ├── config/
│   │   └── db.js
│   └── middleware/
│       └── authMiddleware.js
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── scan.html
│   ├── reports.html
│   ├── students.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── faceRecognition.js
│   │   ├── api.js
│   │   └── utils.js
│   └── assets/
│       └── models/ (face-api.js model files)
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   ├── problem_statement.md
│   ├── requirements.md
│   ├── design.md
│   └── srs.md
├── .gitignore
├── .env
├── package.json
├── package-lock.json
├── README.md
└── LICENSE
```

## 🔐 Key Features

### 1. Authentication System

- Secure login for admin/lecturer/class monitor
- Role-based access (admin, lecturer, class_monitor)
- Password hashing with bcrypt
- JWT-based authentication

### 2. Student Registration

- Form to input: Name, Matric Number, Department, Level, Photo Upload
- Capture and store facial descriptors using `face-api.js`
- Save student data + facial encoding in MySQL

### 3. Face-Based Attendance Marking

- Real-time face detection using webcam (mobile-compatible)
- Compare live face with stored student faces
- On match: auto-mark attendance with timestamp
- Prevent duplicate entries per session

### 4. Attendance Reports

- View attendance by course, date, student
- Export to CSV
- Filter by date range

### 5. Mobile-Friendly UI

- Responsive design (works on phones, tablets, desktops)
- Simple navigation: Dashboard → Scan → Reports

## ⚙️ Setup Instructions (Windows)

### Prerequisites

- Node.js (v14 or later)
- MySQL 8.0 or later
- Git (optional, for version control)

### 1. Install Dependencies

```powershell
# Navigate to the project directory
cd d:\SFRAS\facial-attendance-system

# Install backend dependencies
npm install
```

### 2. Set up MySQL Database

**Option A: Using MySQL Command Line**

```powershell
# Log into MySQL
mysql -u root -p

# Create database
CREATE DATABASE facial_attendance;

# Exit MySQL
exit;

# Import schema
Get-Content database\schema.sql | mysql -u root -p facial_attendance

# (Optional) Import sample data
Get-Content database\seed.sql | mysql -u root -p facial_attendance
```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new database named `facial_attendance`
4. Open and execute `database/schema.sql`
5. (Optional) Open and execute `database/seed.sql`

### 3. Configure Environment Variables

Create a `.env` file in the project root directory (not just backend):

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=facial_attendance

# Server Configuration
PORT=3000

# JWT Secret (use a strong secret in production)
JWT_SECRET=your_strong_jwt_secret_key_here
```

**Note:** Replace `your_mysql_password` with your actual MySQL root password.

### 4. Default User Credentials

The system comes with a default admin user:

- **Email**: admin@example.com
- **Password**: admin123

You can register additional users via the registration page.

### 5. Run the Backend Server

```powershell
# Start backend server
npm start
```

The backend server will start on http://localhost:3000

### 6. Serve the Frontend

```powershell
# Using live-server (recommended for development)
npx live-server frontend
```

The frontend will be served on http://127.0.0.1:8080 (or another available port if 8080 is in use).

### 7. Verify face-api.js Models

The face-api.js models are already included in `frontend/assets/models/`. If you need to re-download them:

- [ssd_mobilenetv1](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
- [face_landmark_68_model](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
- [face_recognition_model](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)

## 🚀 Deployment Guide

### Option 1: Deploy to a VPS (Virtual Private Server)

#### Step 1: Choose a VPS Provider

Recommended providers:

- **DigitalOcean** (Easy to use, good for beginners)
- **AWS EC2** (Scalable, enterprise-grade)
- **Google Cloud Platform** (Reliable, good integration)
- **Vultr** (Affordable, good performance)

#### Step 2: Set Up the Server

1. Create a new Ubuntu 20.04/22.04 server
2. Connect via SSH: `ssh root@your-server-ip`
3. Update the server:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

#### Step 3: Install Required Software

```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y

# Install Nginx (for reverse proxy)
sudo apt install nginx -y

# Install PM2 (process manager for Node.js)
sudo npm install -g pm2
```

#### Step 4: Configure MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql
```

```sql
CREATE DATABASE facial_attendance;
CREATE USER 'facial_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON facial_attendance.* TO 'facial_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 5: Upload Project Files

```bash
# On your local machine, create a zip of the project
# Then upload to the server using scp or Git

# Option 1: Using Git (recommended)
cd /var/www
git clone your-repository-url facial-attendance-system
cd facial-attendance-system

# Option 2: Upload via scp (from local machine)
scp -r facial-attendance-system root@your-server-ip:/var/www/
```

#### Step 6: Install Dependencies and Configure

```bash
cd /var/www/facial-attendance-system
npm install

# Create .env file
nano .env
```

Add the following content (update with your values):

```env
DB_HOST=localhost
DB_USER=facial_user
DB_PASSWORD=your_secure_password
DB_NAME=facial_attendance
PORT=3000
JWT_SECRET=your_very_strong_jwt_secret_key
```

#### Step 7: Import Database Schema

```bash
mysql -u facial_user -p facial_attendance < database/schema.sql
```

#### Step 8: Start Backend with PM2

```bash
pm2 start backend/server.js --name facial-attendance-backend
pm2 save
pm2 startup
```

#### Step 9: Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/facial-attendance
```

Add the following configuration:

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
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/facial-attendance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 10: Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Option 2: Deploy to Heroku (Simpler)

1. Install Heroku CLI
2. Create a Heroku app
3. Use ClearDB MySQL add-on
4. Push your code to Heroku
5. Set environment variables in Heroku dashboard

### Option 3: Deploy to Vercel + PlanetScale

- **Frontend**: Deploy to Vercel (drag & drop the `frontend` folder)
- **Backend**: Deploy to Vercel as a serverless function or use another service like Render
- **Database**: Use PlanetScale (MySQL-compatible cloud database)

## 💡 Feature Suggestions

### Immediate Improvements

1. **Password Reset Functionality**
   - Add "Forgot Password" link on login page
   - Implement email-based password reset using Nodemailer
   - Generate temporary reset tokens with expiration

2. **Email Notifications**
   - Send welcome email to new users
   - Send attendance reports via email
   - Notify students when their attendance is marked

3. **Improved UI/UX**
   - Add loading spinners during API calls
   - Implement toast notifications for success/error messages
   - Add dark mode toggle
   - Improve mobile responsiveness

4. **Batch Student Import**
   - Allow importing students from CSV/Excel files
   - Include facial encoding generation during import
   - Validate imported data before saving

### Advanced Features

5. **Multiple Face Recognition Algorithms**
   - Add support for FaceNet, ArcFace, or other modern algorithms
   - Allow switching between different models
   - Improve recognition accuracy and speed

6. **Attendance Analytics Dashboard**
   - Visual attendance charts and graphs
   - Attendance trends over time
   - Student attendance statistics
   - Course-wise attendance comparison

7. **Liveness Detection**
   - Prevent spoofing with photos/videos
   - Implement blink detection
   - Add head movement verification

8. **Multi-Campus Support**
   - Manage multiple campuses/branches
   - Assign users to specific campuses
   - Campus-wise attendance reports

9. **Mobile App**
   - Create a React Native or Flutter mobile app
   - Offline attendance marking capability
   - Push notifications for attendance reminders

10. **Integration with LMS**
    - Integrate with Moodle, Canvas, or other Learning Management Systems
    - Sync attendance data automatically
    - Single sign-on (SSO) integration

### Security Enhancements

11. **Two-Factor Authentication (2FA)**
    - Add SMS or email-based 2FA
    - Support for authenticator apps like Google Authenticator

12. **Rate Limiting**
    - Prevent brute-force attacks on login
    - Limit API requests per user/IP

13. **Audit Logs**
    - Track all user actions
    - Log attendance modifications
    - Monitor system access

## 📄 Documentation

- **Problem Statement**: `docs/problem_statement.md`
- **Requirements**: `docs/requirements.md`
- **System Design**: `docs/design.md`
- **Software Requirements Specification**: `docs/srs.md`

## 🚨 Important Notes

- **No External Paid Services**: Uses only open-source `face-api.js` for facial recognition
- **Offline Capability**: Works offline after initial model load
- **Academic Project**: Focused on clarity over complexity
- **Security**: Implements basic security measures, suitable for academic purposes. For production use, additional security measures are recommended.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Muktar Salisu Bulama

---

Made with ❤️ for educational purposes
