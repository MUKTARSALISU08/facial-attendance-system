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

const API_BASE_URL = 'https://facial-attendance-system-production.up.railway.app';

// Get current user from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

function resolveProfileImageUrl(profileImagePath) {
  if (!profileImagePath) return null;
  if (profileImagePath.startsWith('http://') || profileImagePath.startsWith('https://')) {
    return profileImagePath;
  }
  return `${API_BASE_URL}${profileImagePath}`;
}

function getRelativeProfileImagePath(profileImagePath) {
  if (!profileImagePath) return null;
  try {
    const url = new URL(profileImagePath);
    return url.pathname;
  } catch {
    return profileImagePath;
  }
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
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
        const response = await fetch('https://facial-attendance-system-production.up.railway.app/api/auth/register', {
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

  // Update user info in header
  updateUserInterface();

  // Fetch dashboard stats
  try {
    // Get total students
    const studentsResponse = await fetch('${API_BASE_URL}/api/students', {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });
    const students = await studentsResponse.json();
    
    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    const attendanceResponse = await fetch(`${API_BASE_URL}/api/attendance/date-range?startDate=${today}&endDate=${today}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });
    const attendance = await attendanceResponse.json();

    // Update stats
    const totalStudentsElement = document.getElementById('total-students');
    const todayAttendanceElement = document.getElementById('today-attendance');
    
    if (totalStudentsElement) {
      totalStudentsElement.textContent = Array.isArray(students) ? students.length : 0;
    }
    
    if (todayAttendanceElement) {
      todayAttendanceElement.textContent = Array.isArray(attendance) ? attendance.length : 0;
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
}

// Update all user interface elements with user data
function updateUserInterface() {
  const user = getCurrentUser();
  if (!user) return;

  // Update sidebar footer
  const sidebarFooterAvatar = document.querySelector('.sidebar-footer-avatar');
  const sidebarFooterName = document.querySelector('.sidebar-footer-name');
  const sidebarFooterRole = document.querySelector('.sidebar-footer-role');
  
  if (sidebarFooterAvatar) {
    if (user.profile_image) {
      sidebarFooterAvatar.innerHTML = `<img src="${resolveProfileImageUrl(user.profile_image)}" alt="${user.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
    } else {
      sidebarFooterAvatar.textContent = user.name.charAt(0).toUpperCase();
    }
  }
  if (sidebarFooterName) sidebarFooterName.textContent = user.name;
  if (sidebarFooterRole) sidebarFooterRole.textContent = user.role;

  // Update header profile
  const userNameEl = document.getElementById('user-name');
  const userRoleEl = document.getElementById('user-role');
  const userAvatarInitial = document.getElementById('user-avatar-initial');
  const userAvatarImg = document.getElementById('user-avatar-img');
  const dropdownAvatarInitial = document.getElementById('dropdown-avatar-initial');
  const dropdownAvatarImg = document.getElementById('dropdown-avatar-img');

  if (userNameEl) userNameEl.textContent = user.name;
  if (userRoleEl) userRoleEl.textContent = user.role;

  // Update avatar images
  const updateAvatar = (initialEl, imgEl) => {
    if (user.profile_image) {
      if (initialEl) initialEl.style.display = 'none';
      if (imgEl) {
        imgEl.src = resolveProfileImageUrl(user.profile_image);
        imgEl.style.display = 'block';
      }
    } else {
      if (initialEl) {
        initialEl.textContent = user.name.charAt(0).toUpperCase();
        initialEl.style.display = 'flex';
      }
      if (imgEl) imgEl.style.display = 'none';
    }
  };

  updateAvatar(userAvatarInitial, userAvatarImg);
  updateAvatar(dropdownAvatarInitial, dropdownAvatarImg);

  // Update profile settings page if on that page
  const profileNameInput = document.getElementById('profile-name');
  const profileEmailInput = document.getElementById('profile-email');
  const profileRoleSelect = document.getElementById('profile-role');
  const currentProfileImage = document.getElementById('current-profile-image');
  const profileImageInitial = document.getElementById('profile-image-initial');

  if (profileNameInput) profileNameInput.value = user.name;
  if (profileEmailInput) profileEmailInput.value = user.email;
  if (profileRoleSelect) profileRoleSelect.value = user.role;

  if (currentProfileImage && profileImageInitial) {
    if (user.profile_image) {
      currentProfileImage.src = resolveProfileImageUrl(user.profile_image);
      currentProfileImage.style.display = 'block';
      profileImageInitial.style.display = 'none';
    } else {
      currentProfileImage.style.display = 'none';
      profileImageInitial.textContent = user.name.charAt(0).toUpperCase();
      profileImageInitial.style.display = 'flex';
    }
  }
}

// Handle profile image upload
async function handleProfileImageUpload(file) {
  if (!file) return;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    showAlert('Invalid file type. Please upload a JPG, PNG, or WEBP image.', 'error');
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    showAlert('File size too large. Maximum size is 5MB.', 'error');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('profile_image', file);

    const result = await profileAPI.uploadProfileImage(formData);

    // Update user in localStorage with new profile image
    const user = getCurrentUser();
    if (user) {
      user.profile_image = 'http://localhost:3000' + result.profile_image;
      localStorage.setItem('user', JSON.stringify(user));
    }

    // Update all UI elements
    updateUserInterface();
    
    showAlert('Profile image uploaded successfully!', 'success');
    return result;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    showAlert(error.message || 'Failed to upload profile image', 'error');
    throw error;
  }
}

// Handle profile image removal
async function handleProfileImageRemove() {
  try {
    await profileAPI.deleteProfileImage();

    // Update user in localStorage
    const user = getCurrentUser();
    if (user) {
      user.profile_image = null;
      localStorage.setItem('user', JSON.stringify(user));
    }

    // Update all UI elements
    updateUserInterface();
    
    showAlert('Profile image removed successfully!', 'success');
  } catch (error) {
    console.error('Error removing profile image:', error);
    showAlert(error.message || 'Failed to remove profile image', 'error');
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
  const protectedPages = ['dashboard.html', 'scan.html', 'reports.html', 'students.html', 'settings.html', 'attendance-history.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    checkAuth();
    // Update user interface with profile image
    updateUserInterface();
  }
  
  // Update dashboard if on dashboard page
  if (currentPage === 'dashboard.html') {
    updateDashboard();
  }
  
  // Handle profile image upload on settings page
  if (currentPage === 'settings.html') {
    initSettingsPage();
  }
  
  // Add logout event listener
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

// Initialize settings page functionality
function initSettingsPage() {
  const profileImageInput = document.getElementById('profile-image-input');
  const removeProfileImageBtn = document.getElementById('remove-profile-image');
  
  // Update remove button visibility based on current profile image
  const user = getCurrentUser();
  if (user && user.profile_image && removeProfileImageBtn) {
    removeProfileImageBtn.style.display = 'inline-flex';
  }
  
  if (profileImageInput) {
    profileImageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        // Show preview immediately using FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
          const currentProfileImage = document.getElementById('current-profile-image');
          const profileImageInitial = document.getElementById('profile-image-initial');
          if (currentProfileImage) {
            currentProfileImage.src = e.target.result;
            currentProfileImage.style.display = 'block';
          }
          if (profileImageInitial) {
            profileImageInitial.style.display = 'none';
          }
          // Show remove button when file is selected
          if (removeProfileImageBtn) {
            removeProfileImageBtn.style.display = 'inline-flex';
          }
        };
        reader.readAsDataURL(file);
        
        // Upload the file
        try {
          await handleProfileImageUpload(file);
        } catch (error) {
          // Revert preview if upload failed
          const user = getCurrentUser();
          if (user && user.profile_image) {
            const currentProfileImage = document.getElementById('current-profile-image');
            const profileImageInitial = document.getElementById('profile-image-initial');
            if (currentProfileImage) {
              currentProfileImage.src = `http://localhost:3000${user.profile_image}`;
            }
          } else {
            const currentProfileImage = document.getElementById('current-profile-image');
            const profileImageInitial = document.getElementById('profile-image-initial');
            if (currentProfileImage) currentProfileImage.style.display = 'none';
            if (profileImageInitial) {
              profileImageInitial.style.display = 'flex';
              profileImageInitial.textContent = user?.name?.charAt(0).toUpperCase() || 'U';
            }
          }
        }
      }
    });
  }
  
  if (removeProfileImageBtn) {
    removeProfileImageBtn.addEventListener('click', async () => {
      try {
        await handleProfileImageRemove();
        // Update UI to show initial
        const currentProfileImage = document.getElementById('current-profile-image');
        const profileImageInitial = document.getElementById('profile-image-initial');
        const removeBtn = document.getElementById('remove-profile-image');
        
        if (currentProfileImage) currentProfileImage.style.display = 'none';
        if (profileImageInitial) {
          const user = getCurrentUser();
          profileImageInitial.textContent = user?.name?.charAt(0).toUpperCase() || 'U';
          profileImageInitial.style.display = 'flex';
        }
        if (removeBtn) removeBtn.style.display = 'none';
      } catch (error) {
        // Error already handled in the function
      }
    });
  }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);