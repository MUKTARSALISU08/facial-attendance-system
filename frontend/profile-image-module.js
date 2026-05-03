// ===================================================================
// PROFILE IMAGE MODULE - CLEAN REBUILD
// ===================================================================

const API_BASE_URL = 'http://localhost:3000';

// State
let currentProfileImageUrl = null;
let pendingProfileImageFile = null;

// DOM Elements
const profileImageInput = document.getElementById('profile-image-input');
const currentProfileImage = document.getElementById('current-profile-image');
const profileImageInitial = document.getElementById('profile-image-initial');
const removeProfileImageBtn = document.getElementById('remove-profile-image');
const profileImagePreviewContainer = document.querySelector('.profile-image-preview');

// ===================================================================
// UTILITY: Show Toast Notification
// ===================================================================
function showToast(message, type = 'success') {
  // Remove existing toast if any
  const existingToast = document.getElementById('profile-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'profile-toast';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  // Set background color based on type
  if (type === 'success') {
    toast.style.backgroundColor = '#10b981';
  } else if (type === 'error') {
    toast.style.backgroundColor = '#ef4444';
  } else if (type === 'info') {
    toast.style.backgroundColor = '#3b82f6';
  }

  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// ===================================================================
// UTILITY: Safe JSON Parse
// ===================================================================
function safeJsonParse(text, defaultValue = {}) {
  if (!text || typeof text !== 'string') {
    console.log('[ProfileImage] safeJsonParse: empty or invalid input');
    return defaultValue;
  }
  try {
    const parsed = JSON.parse(text);
    console.log('[ProfileImage] safeJsonParse: success:', JSON.stringify(parsed).substring(0, 200));
    return parsed;
  } catch (error) {
    console.error('[ProfileImage] safeJsonParse error:', error.message);
    return defaultValue;
  }
}

// ===================================================================
// UTILITY: Safe Fetch Response Handling
// ===================================================================
async function safeResponseJson(response) {
  try {
    // First check if response has content
    const text = await response.text();
    console.log('[ProfileImage] Response body length:', text.length);
    console.log('[ProfileImage] Response body preview:', text.substring(0, 300));
    
    if (!text || text.trim() === '') {
      console.log('[ProfileImage] Response body is empty');
      return {};
    }
    
    return safeJsonParse(text);
  } catch (error) {
    console.error('[ProfileImage] safeResponseJson error:', error.message);
    return {};
  }
}

// ===================================================================
// UTILITY: Get Safe User Data from localStorage
// ===================================================================
function getSafeUserData() {
  const userStr = localStorage.getItem('user');
  return safeJsonParse(userStr, { name: '', email: '', profile_image: null });
}

// ===================================================================
// PREVIEW: When user selects an image, show preview (DO NOT SAVE)
// ===================================================================
profileImageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  
  if (!file) {
    console.log('[ProfileImage] No file selected');
    return;
  }
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showToast('Invalid file type. Please use JPG, PNG, or WEBP.', 'error');
    this.value = '';
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('File too large. Maximum size is 5MB.', 'error');
    this.value = '';
    return;
  }
  
  console.log('[ProfileImage] File selected:', file.name, file.size, 'bytes');
  
  // Store file for upload
  pendingProfileImageFile = file;
  
  // Show preview using FileReader
  const reader = new FileReader();
  reader.onload = function(event) {
    const imageData = event.target.result;
    console.log('[ProfileImage] Preview generated, length:', imageData.length);
    
    // Update preview UI
    currentProfileImage.src = imageData;
    currentProfileImage.style.display = 'block';
    profileImageInitial.style.display = 'none';
    removeProfileImageBtn.style.display = 'inline-block';
  };
  reader.readAsDataURL(file);
});

// ===================================================================
// REMOVE: When user clicks "Remove Image"
// ===================================================================
removeProfileImageBtn.addEventListener('click', async function() {
  console.log('[ProfileImage] Remove button clicked');
  
  // Remove confirm dialog - update UI immediately
  try {
    const token = localStorage.getItem('token');
    console.log('[ProfileImage] Sending delete request...');
    
    const response = await fetch(`${API_BASE_URL}/api/profile/delete-image`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('[ProfileImage] Delete response status:', response.status);
    const result = await safeResponseJson(response);
    console.log('[ProfileImage] Delete result:', result);
    
    // Update UI immediately (optimistic update)
    currentProfileImage.src = '';
    currentProfileImage.style.display = 'none';
    profileImageInitial.style.display = 'flex';
    removeProfileImageBtn.style.display = 'none';
    profileImageInput.value = '';
    pendingProfileImageFile = null;
    currentProfileImageUrl = null;
    
    // Update localStorage
    const userData = getSafeUserData();
    userData.profile_image = null;
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('[ProfileImage] localStorage updated after remove');
    
    // Update navbar avatars
    updateAllAvatars();
    
    // Handle success/failure after UI update
    if (!response.ok) {
      const errorMsg = result.message || 'Failed to delete image from server';
      console.error('[ProfileImage] Delete failed:', errorMsg);
    }
    
  } catch (error) {
    console.error('[ProfileImage] Delete error:', error);
  }
});

// ===================================================================
// UPLOAD: When form is submitted, upload pending image
// ===================================================================
async function uploadProfileImage() {
  if (!pendingProfileImageFile) {
    console.log('[ProfileImage] No pending file to upload');
    return false;
  }
  
  console.log('[ProfileImage] Starting upload...');
  
  const formData = new FormData();
  formData.append('profile_image', pendingProfileImageFile);
  
  try {
    const token = localStorage.getItem('token');
    console.log('[ProfileImage] Token present:', !!token);
    
    const response = await fetch(`${API_BASE_URL}/api/profile/upload-image`, {
      method: 'POST',
      headers: {
        'x-auth-token': token
      },
      body: formData
    });
    
    console.log('[ProfileImage] Upload response status:', response.status);
    const result = await safeResponseJson(response);
    console.log('[ProfileImage] Upload result:', result);
    
    if (!response.ok) {
      throw new Error(result.message || 'Upload failed');
    }
    
    // Success!
    const fullUrl = result.profile_image_url;
    console.log('[ProfileImage] Upload successful! URL:', fullUrl);
    
    // Update state
    currentProfileImageUrl = fullUrl;
    pendingProfileImageFile = null;
    
    // Update localStorage with FULL URL
    const userData = getSafeUserData();
    userData.profile_image = fullUrl;
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('[ProfileImage] localStorage updated with:', fullUrl);
    
    // Update UI to show actual uploaded image (not base64 preview)
    currentProfileImage.src = fullUrl;
    currentProfileImage.style.display = 'block';
    profileImageInitial.style.display = 'none';
    removeProfileImageBtn.style.display = 'inline-block';
    
    // Update navbar avatars
    updateAllAvatars();
    
    // Show success toast
    showToast('Profile image uploaded successfully');
    
    return true;
    
  } catch (error) {
    console.error('[ProfileImage] Upload error:', error);
    showToast(error.message || 'Failed to upload image', 'error');
    return false;
  }
}

// ===================================================================
// RENDER: Load profile image from database on page load
// ===================================================================
async function loadProfileImage() {
  console.log('[ProfileImage] Loading profile image...');
  
  try {
    const token = localStorage.getItem('token');
    console.log('[ProfileImage] Token present:', !!token);
    
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('[ProfileImage] Load profile response status:', response.status);
    
    if (!response.ok) {
      throw new Error('Failed to load profile');
    }
    
    const data = await safeResponseJson(response);
    console.log('[ProfileImage] Profile data:', {
      name: data.name,
      profile_image: data.profile_image,
      profile_image_url: data.profile_image_url
    });
    
    // Update form fields
    if (document.getElementById('profile-name')) {
      document.getElementById('profile-name').value = data.name || '';
    }
    if (document.getElementById('profile-email')) {
      document.getElementById('profile-email').value = data.email || '';
    }
    if (document.getElementById('profile-role')) {
      document.getElementById('profile-role').value = data.role || 'lecturer';
    }
    
    // Update profile image
    if (data.profile_image_url) {
      currentProfileImageUrl = data.profile_image_url;
      currentProfileImage.src = data.profile_image_url;
      currentProfileImage.style.display = 'block';
      profileImageInitial.style.display = 'none';
      removeProfileImageBtn.style.display = 'inline-block';
      
      // Update localStorage with FULL URL from server
      const userData = getSafeUserData();
      userData.profile_image = data.profile_image_url;
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('[ProfileImage] localStorage synced with server URL');
    } else {
      // No image - show initial
      currentProfileImageUrl = null;
      currentProfileImage.style.display = 'none';
      profileImageInitial.style.display = 'flex';
      profileImageInitial.textContent = (data.name || 'U').charAt(0).toUpperCase();
      removeProfileImageBtn.style.display = 'none';
    }
    
    // Update navbar avatars
    updateAllAvatars();
    
  } catch (error) {
    console.error('[ProfileImage] Load error:', error);
  }
}

// ===================================================================
// UPDATE ALL AVATARS: Update every profile image element in the UI
// ===================================================================
function updateAllAvatars() {
  const userData = getSafeUserData();
  const profileUrl = userData.profile_image;
  
  console.log('[ProfileImage] Updating all avatars, URL:', profileUrl);
  
  // Sidebar avatar
  const sidebarAvatar = document.getElementById('user-avatar-img');
  const sidebarInitial = document.getElementById('user-avatar-initial');
  
  if (sidebarAvatar && profileUrl) {
    sidebarAvatar.src = profileUrl;
    sidebarAvatar.style.display = 'block';
    if (sidebarInitial) sidebarInitial.style.display = 'none';
  } else if (sidebarAvatar) {
    sidebarAvatar.style.display = 'none';
    if (sidebarInitial) {
      sidebarInitial.style.display = 'flex';
      sidebarInitial.textContent = (userData.name || 'U').charAt(0).toUpperCase();
    }
  }
  
  // Dropdown avatar
  const dropdownAvatar = document.getElementById('dropdown-avatar-img');
  const dropdownInitial = document.getElementById('dropdown-avatar-initial');
  
  if (dropdownAvatar && profileUrl) {
    dropdownAvatar.src = profileUrl;
    dropdownAvatar.style.display = 'block';
    if (dropdownInitial) dropdownInitial.style.display = 'none';
  } else if (dropdownAvatar) {
    dropdownAvatar.style.display = 'none';
    if (dropdownInitial) {
      dropdownInitial.style.display = 'flex';
      dropdownInitial.textContent = (userData.name || 'U').charAt(0).toUpperCase();
    }
  }
}

// ===================================================================
// FORM SUBMIT: Handle profile form submission
// ===================================================================
document.getElementById('profile-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  console.log('\n[ProfileImage] === FORM SUBMIT ===');
  
  // 1. Upload profile image FIRST (if there's a new one)
  let uploadSuccess = true;
  if (pendingProfileImageFile) {
    console.log('[ProfileImage] Uploading new image...');
    uploadSuccess = await uploadProfileImage();
    if (!uploadSuccess) {
      console.log('[ProfileImage] Upload failed, aborting');
      return;
    }
  }
  
  // 2. Update name/email
  try {
    const token = localStorage.getItem('token');
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    
    console.log('[ProfileImage] Updating name/email:', name, email);
    
    const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ name, email })
    });
    
    console.log('[ProfileImage] Update response status:', response.status);
    const result = await safeResponseJson(response);
    console.log('[ProfileImage] Update result:', result);
    
    if (!response.ok) {
      throw new Error(result.message || 'Update failed');
    }
    
    // Update localStorage with new name
    const userData = getSafeUserData();
    userData.name = name;
    userData.email = email;
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update UI
    if (document.getElementById('user-name')) {
      document.getElementById('user-name').textContent = name;
    }
    updateAllAvatars();
    
    // Show success toast instead of alert
    showToast('Profile updated successfully!');
    
  } catch (error) {
    console.error('[ProfileImage] Update error:', error);
    showToast(error.message || 'Failed to update profile', 'error');
  }
});

// ===================================================================
// INITIALIZE: Load profile on page load
// ===================================================================
console.log('[ProfileImage] Module loaded, initializing...');
loadProfileImage();