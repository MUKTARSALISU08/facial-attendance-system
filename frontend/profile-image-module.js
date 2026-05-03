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
    alert('Invalid file type. Please use JPG, PNG, or WEBP.');
    this.value = '';
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File too large. Maximum size is 5MB.');
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
  
  if (!confirm('Remove profile image?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    console.log('[ProfileImage] Sending delete request...');
    
    const response = await fetch(`${API_BASE_URL}/api/profile/delete-image`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    });
    
    const result = await response.json();
    console.log('[ProfileImage] Delete response:', response.status, result);
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete image');
    }
    
    // Success - update UI
    currentProfileImage.src = '';
    currentProfileImage.style.display = 'none';
    profileImageInitial.style.display = 'flex';
    removeProfileImageBtn.style.display = 'none';
    profileImageInput.value = '';
    pendingProfileImageFile = null;
    currentProfileImageUrl = null;
    
    // Update localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    userData.profile_image = null;
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('[ProfileImage] localStorage updated');
    
    // Update navbar avatars
    updateAllAvatars();
    
    alert('Profile image removed');
    
  } catch (error) {
    console.error('[ProfileImage] Delete error:', error);
    alert(error.message || 'Failed to remove image');
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
    
    const response = await fetch(`${API_BASE_URL}/api/profile/upload-image`, {
      method: 'POST',
      headers: {
        'x-auth-token': token
      },
      body: formData
    });
    
    const result = await response.json();
    console.log('[ProfileImage] Upload response:', response.status, result);
    
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
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
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
    
    return true;
    
  } catch (error) {
    console.error('[ProfileImage] Upload error:', error);
    alert(error.message || 'Failed to upload image');
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
    
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load profile');
    }
    
    const data = await response.json();
    console.log('[ProfileImage] Profile data:', {
      name: data.name,
      profile_image: data.profile_image,
      profile_image_url: data.profile_image_url
    });
    
    // Update form fields
    document.getElementById('profile-name').value = data.name || '';
    document.getElementById('profile-email').value = data.email || '';
    document.getElementById('profile-role').value = data.role || 'lecturer';
    
    // Update profile image
    if (data.profile_image_url) {
      currentProfileImageUrl = data.profile_image_url;
      currentProfileImage.src = data.profile_image_url;
      currentProfileImage.style.display = 'block';
      profileImageInitial.style.display = 'none';
      removeProfileImageBtn.style.display = 'inline-block';
      
      // Update localStorage with FULL URL from server
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
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
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
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
  if (pendingProfileImageFile) {
    console.log('[ProfileImage] Uploading new image...');
    const uploadSuccess = await uploadProfileImage();
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
    
    const result = await response.json();
    console.log('[ProfileImage] Update response:', response.status, result);
    
    if (!response.ok) {
      throw new Error(result.message || 'Update failed');
    }
    
    // Update localStorage with new name
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    userData.name = name;
    userData.email = email;
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update UI
    document.getElementById('user-name').textContent = name;
    updateAllAvatars();
    
    alert('Profile updated successfully!');
    
  } catch (error) {
    console.error('[ProfileImage] Update error:', error);
    alert(error.message || 'Failed to update profile');
  }
});

// ===================================================================
// INITIALIZE: Load profile on page load
// ===================================================================
console.log('[ProfileImage] Module loaded, initializing...');
loadProfileImage();
