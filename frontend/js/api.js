// API utility functions for backend communication

// Base API URL
const API_BASE_URL = 'https://facial-attendance-system-production.up.railway.app/api';

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('token');
}

// Generic API request function
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json'
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers['x-auth-token'] = token;
  }

  const options = {
    method,
    headers
  };

  // Add data for POST/PUT requests
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // Parse response as JSON
    const responseData = await response.json();
    
    // Check if response is successful
    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed');
    }
    
    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Authentication API
const authAPI = {
  // Login user
  login: async (email, password) => {
    return apiRequest('/auth/login', 'POST', { email, password });
  },
  
  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', 'POST', userData);
  },
  
  // Get current user profile
  getProfile: async () => {
    return apiRequest('/auth/profile');
  }
};

// Students API
const studentsAPI = {
  // Get all students
  getAll: async () => {
    return apiRequest('/students');
  },
  
  // Get student by ID
  getById: async (id) => {
    return apiRequest(`/students/${id}`);
  },
  
  // Create new student
  create: async (studentData) => {
    return apiRequest('/students', 'POST', studentData);
  },
  
  // Update student
  update: async (id, studentData) => {
    return apiRequest(`/students/${id}`, 'PUT', studentData);
  },
  
  // Delete student
  delete: async (id) => {
    return apiRequest(`/students/${id}`, 'DELETE');
  },
  
  // Get students by department
  getByDepartment: async (department) => {
    return apiRequest(`/students/department/${department}`);
  },
  
  // Get students by level
  getByLevel: async (level) => {
    return apiRequest(`/students/level/${level}`);
  }
};

// Attendance API
const attendanceAPI = {
  // Mark attendance
  mark: async (attendanceData) => {
    return apiRequest('/attendance', 'POST', attendanceData);
  },
  
  // Get all attendance records
  getAll: async () => {
    return apiRequest('/attendance');
  },
  
  // Get attendance by student ID
  getByStudentId: async (studentId) => {
    return apiRequest(`/attendance/student/${studentId}`);
  },
  
  // Get attendance by date range
  getByDateRange: async (startDate, endDate, course = null) => {
    let url = `/attendance/date-range?startDate=${startDate}&endDate=${endDate}`;
    if (course) {
      url += `&course=${course}`;
    }
    return apiRequest(url);
  },
  
  // Get attendance by course
  getByCourse: async (course) => {
    return apiRequest(`/attendance/course/${course}`);
  },
  
  // Generate attendance report
  generateReport: async (startDate, endDate, course = null) => {
    let url = `/attendance/report/generate?startDate=${startDate}&endDate=${endDate}`;
    if (course) {
      url += `&course=${course}`;
    }
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate report');
    }
    
    // Get blob for CSV download
    const blob = await response.blob();
    const urlObj = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = urlObj;
    a.download = `attendance_report_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlObj);
  }
};

// Profile API
const profileAPI = {
  // Get profile
  getProfile: async () => {
    return apiRequest('/profile');
  },
  
  // Upload profile image
  uploadProfileImage: async (formData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/profile/upload-image`, {
      method: 'POST',
      headers: {
        'x-auth-token': token
      },
      body: formData
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to upload profile image');
    }
    
    return responseData;
  },
  
  // Update profile
  updateProfile: async (profileData) => {
    return apiRequest('/profile/update', 'PUT', profileData);
  },
  
  // Delete profile image
  deleteProfileImage: async () => {
    return apiRequest('/profile/delete-image', 'DELETE');
  }
};

// Expose API to global window
window.authAPI = authAPI;
window.studentsAPI = studentsAPI;
window.attendanceAPI = attendanceAPI;
window.profileAPI = profileAPI;
