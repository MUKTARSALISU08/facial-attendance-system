 // Main JavaScript file for general functionality

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login page if not authenticated
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Get current user from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Update UI based on user authentication status
function updateAuthUI() {
  const user = getCurrentUser();
  const authLinks = document.querySelectorAll('.auth-link');
  const userLinks = document.querySelectorAll('.user-link');
  const userInfo = document.querySelector('.user-info');

  if (user) {
    // User is logged in
    authLinks.forEach(link => link.style.display = 'none');
    userLinks.forEach(link => link.style.display = 'block');
    if (userInfo) {
      userInfo.textContent = `Welcome, ${user.name}`;
    }
  } else {
    // User is not logged in
    authLinks.forEach(link => link.style.display = 'block');
    userLinks.forEach(link => link.style.display = 'none');
    if (userInfo) {
      userInfo.textContent = '';
    }
  }
}

// Handle login form submission
function handleLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store token and user info in localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        } else {
          // Show error message
          const errorElement = document.getElementById('login-error');
          if (errorElement) {
            errorElement.textContent = data.message;
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
          errorElement.textContent = 'An error occurred. Please try again.';
        }
      }
    });
  }
}

// Handle register form submission
function handleRegisterForm() {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;
      
      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store token and user info in localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        } else {
          // Show error message
          const errorElement = document.getElementById('register-error');
          if (errorElement) {
            errorElement.textContent = data.message;
          }
        }
      } catch (error) {
        console.error('Register error:', error);
        const errorElement = document.getElementById('register-error');
        if (errorElement) {
          errorElement.textContent = 'An error occurred. Please try again.';
        }
      }
    });
  }
}

// Update dashboard with user info and stats
async function updateDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  // Update user info
  const userInfoElement = document.querySelector('.user-info');
  if (userInfoElement) {
    userInfoElement.textContent = `Welcome, ${user.name} (${user.role})`;
  }

  // Fetch dashboard stats
  try {
    // Get total students
    const studentsResponse = await fetch('http://localhost:3000/api/students', {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });
    const students = await studentsResponse.json();
    
    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    const attendanceResponse = await fetch(`http://localhost:3000/api/attendance?startDate=${today}&endDate=${today}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });
    const attendance = await attendanceResponse.json();

    // Update stats
    const totalStudentsElement = document.getElementById('total-students');
    const todayAttendanceElement = document.getElementById('today-attendance');
    
    if (totalStudentsElement) {
      totalStudentsElement.textContent = students.length;
    }
    
    if (todayAttendanceElement) {
      todayAttendanceElement.textContent = attendance.length;
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
}

// Initialize the application
function initApp() {
  // Update auth UI
  updateAuthUI();
  
  // Handle login form
  handleLoginForm();
  
  // Handle register form
  handleRegisterForm();
  
  // Check auth for protected pages
  const protectedPages = ['dashboard.html', 'scan.html', 'reports.html', 'students.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    checkAuth();
  }
  
  // Update dashboard if on dashboard page
  if (currentPage === 'dashboard.html') {
    updateDashboard();
  }
  
  // Add logout event listener
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);