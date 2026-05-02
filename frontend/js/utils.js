// Utility functions for the application

// Format date to YYYY-MM-DD format
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format time to HH:MM format
function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  return formatDate(new Date());
}

// Get current time in HH:MM format
function getCurrentTime() {
  return formatTime(new Date());
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password strength (at least 6 characters)
function validatePassword(password) {
  return password.length >= 6;
}

// Show alert message
function showAlert(message, type = 'info') {
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alert.style.position = 'fixed';
  alert.style.top = '20px';
  alert.style.right = '20px';
  alert.style.zIndex = '1000';
  alert.style.padding = '15px 20px';
  alert.style.borderRadius = '4px';
  alert.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  alert.style.transition = 'all 0.3s ease';
  alert.style.opacity = '0';
  alert.style.transform = 'translateX(100%)';
  
  // Add to document
  document.body.appendChild(alert);
  
  // Animate in
  setTimeout(() => {
    alert.style.opacity = '1';
    alert.style.transform = 'translateX(0)';
  }, 100);
  
  // Animate out and remove
  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(alert);
    }, 300);
  }, 3000);
}

// Show loading spinner
function showLoading(message = 'Loading...') {
  // Create loading container
  const loading = document.createElement('div');
  loading.id = 'loading-spinner';
  loading.style.position = 'fixed';
  loading.style.top = '0';
  loading.style.left = '0';
  loading.style.width = '100%';
  loading.style.height = '100%';
  loading.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  loading.style.display = 'flex';
  loading.style.flexDirection = 'column';
  loading.style.justifyContent = 'center';
  loading.style.alignItems = 'center';
  loading.style.zIndex = '10000';
  
  // Create spinner
  const spinner = document.createElement('div');
  spinner.style.border = '4px solid #f3f3f3';
  spinner.style.borderTop = '4px solid #007bff';
  spinner.style.borderRadius = '50%';
  spinner.style.width = '40px';
  spinner.style.height = '40px';
  spinner.style.animation = 'spin 1s linear infinite';
  spinner.style.marginBottom = '15px';
  
  // Create message
  const loadingMessage = document.createElement('div');
  loadingMessage.textContent = message;
  loadingMessage.style.fontSize = '16px';
  loadingMessage.style.color = '#333';
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Assemble loading element
  loading.appendChild(spinner);
  loading.appendChild(loadingMessage);
  
  // Add to document
  document.body.appendChild(loading);
}

// Hide loading spinner
function hideLoading() {
  const loading = document.getElementById('loading-spinner');
  if (loading) {
    document.body.removeChild(loading);
  }
  
  // Remove animation style
  const style = document.querySelector('style');
  if (style && style.textContent.includes('@keyframes spin')) {
    document.head.removeChild(style);
  }
}

// Convert canvas to base64 image
function canvasToBase64(canvas) {
  return canvas.toDataURL('image/jpeg', 0.8);
}

// Download file from blob
function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export functions
export {
  formatDate,
  formatTime,
  getTodayDate,
  getCurrentTime,
  validateEmail,
  validatePassword,
  showAlert,
  showLoading,
  hideLoading,
  canvasToBase64,
  downloadFile
};