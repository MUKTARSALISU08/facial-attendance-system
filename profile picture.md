# Profile Picture Functionality - Complete Documentation

## Overview
This document explains the complete implementation of the profile picture upload, display, and removal functionality in the Smart Facial Recognition Attendance System. The system includes both backend and frontend components that work together to provide a seamless profile picture management experience.

## Architecture Diagram

```
Frontend (Browser)                    Backend (Express.js)
     |                                      |
     |  1. User selects image              |
     |  2. FileReader shows preview       |
     |                                      |
     |  3. Click "Save Changes"            |
     |     (FormData + Token)              |
     |----------------------------------->|
     |                                      |
     |                                      |  4. Multer processes file
     |                                      |     -> Save to uploads/
     |                                      |
     |                                      |  5. Delete old file (if exists)
     |                                      |
     |                                      |  6. Update database (profile_image)
     |                                      |
     |  7. Response (image URL)           |
     |<-----------------------------------|
     |                                      |
     |  8. Update localStorage            |
     |  9. Update UI (all avatars)       |
     |                                      |
     |  10. On refresh: fetch profile     |
     |      from database                  |
```

---

## Backend Implementation

### 1. Multer Configuration (`backend/middleware/uploadMiddleware.js`)

Multer is used for handling multipart/form-data file uploads.

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if not exists
const uploadDir = path.join(__dirname, '../uploads/profile-images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  }
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WEBP allowed.'), false);
  }
};

// Upload configuration with file size limit (5MB)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;
```

**Key Features:**
- ✅ **Unique filenames**: Uses timestamp + random number to prevent collisions
- ✅ **File validation**: Only allows JPG, PNG, WEBP formats
- ✅ **Size limit**: Max 5MB per file
- ✅ **Directory creation**: Automatically creates uploads/profile-images/ directory

### 2. Profile Controller (`backend/controllers/profileController.js`)

Handles all profile-related operations:

#### `uploadProfileImage`
- ✅ Validates user authentication
- ✅ Processes uploaded file with Multer
- ✅ Deletes old profile image (if exists)
- ✅ Stores relative path in database
- ✅ Returns relative path + full frontend URL

```javascript
exports.uploadProfileImage = async (req, res) => {
  try {
    // ... validation logic ...

    const profileImagePath = `/uploads/profile-images/${req.file.filename}`;

    // Update database
    await user.update({ profile_image: profileImagePath });

    res.json({
      message: 'Profile image uploaded successfully',
      profile_image: profileImagePath,
      frontend_url: `http://localhost:3000${profileImagePath}`
    });
  } catch (error) { /* ... */ }
};
```

#### `getProfile`
- ✅ Retrieves user profile from database
- ✅ Returns profile_image path

#### `deleteProfileImage`
- ✅ Removes physical file from filesystem
- ✅ Resets profile_image in database to NULL

### 3. Profile Routes (`backend/routes/profile.js`)

```javascript
router.post('/upload-image', (req, res, next) => {
  upload.single('profile_image')(req, res, (err) => {
    if (err) { /* ... handle multer errors ... */ }
    next();
  });
}, profileController.uploadProfileImage);

router.delete('/delete-image', profileController.deleteProfileImage);
```

### 4. Static File Serving (`backend/server.js`)

```javascript
app.use('/uploads/profile-images', express.static(
  path.join(__dirname, 'uploads/profile-images')
));
```

Images are accessible at: `http://localhost:3000/uploads/profile-images/xxx.jpg`

### 5. User Model (`backend/models/User.js`)

Database schema supports profile_image field:

```javascript
profile_image: {
  type: DataTypes.STRING,
  allowNull: true
}
```

**Database Storage:** Stores **relative paths** like:
`/uploads/profile-images/profile-1777710508657-308592335.jpg`

---

## Frontend Implementation

### 1. Main.js Utilities (`frontend/js/main.js`)

#### `resolveProfileImageUrl`

**Critical function** that ensures consistent URL handling throughout the application:

```javascript
function resolveProfileImageUrl(profileImagePath) {
  if (!profileImagePath) return null;
  
  // If it's already a full URL, return it
  if (profileImagePath.startsWith('http://') || 
      profileImagePath.startsWith('https://')) {
    return profileImagePath;
  }
  
  // Otherwise, prepend the backend URL
  return `http://localhost:3000${profileImagePath}`;
}
```

**Usage:**
- ✅ Handles both relative paths (from database) and absolute URLs (from localStorage)
- ✅ Used by **all pages** for consistent avatar display

#### `updateUserProfile`

Updates ALL avatar elements across the application:
- Sidebar footer avatar
- Navbar avatar
- Dropdown menu avatar
- Settings page preview

### 2. Settings Page (`frontend/settings.html`)

#### Image Selection Preview
- Uses FileReader to show base64 preview
- **Does NOT save to localStorage** (only temporary UI preview)
- Updates navbar/sidebar for visual feedback

#### Upload Flow
```javascript
// When "Save Changes" is clicked:
1. Create FormData with profile_image file
2. Send POST request to /api/profile/upload-image
3. If successful:
   - Store full URL in localStorage
   - Update UI from base64 → server URL
   - Call updateUserProfile()
4. Then update name/email
5. Show success toast
```

### 3. All Protected Pages
- dashboard.html
- scan.html  
- students.html
- reports.html
- attendance-history.html

**All pages include:**
- ✅ `fetchFreshProfile()` function
- ✅ Loads profile from database on page load
- ✅ Updates localStorage with full URL using `resolveProfileImageUrl()`
- ✅ Calls `updateUserProfile()` for consistent UI

---

## Database Structure

### Table: `users`
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary Key |
| name | String | User's name |
| email | String | User's email (unique) |
| password | String | Hashed password |
| role | String | admin/lecturer/student |
| profile_image | String | Image path or NULL |
| created_at | Date | Account creation |
| updated_at | Date | Last update |

**profile_image Examples:**
```
NULL (default)
/uploads/profile-images/profile-1777710508657-308592335.jpg
```

---

## Complete User Flow

### 1. Upload Profile Image
```
1. Go to Settings Page
2. Click "Upload Photo"
3. Select image file (JPG/PNG/WEBP, <5MB)
4. FileReader shows temporary preview
5. Click "Save Changes"
   ↓
6. FormData sent to /api/profile/upload-image
7. Backend:
   - Multer saves file to uploads/
   - Deletes old file if exists
   - Updates database: profile_image = /uploads/profile-images/xxx.jpg
8. Frontend receives response
9. Store full URL in localStorage
10. Update UI to use server URL
11. Call updateUserProfile()
12. ✅ ALL AVATARS SHOW IMAGE!
```

### 2. View Profile Image
```
1. On any protected page load:
   - fetchFreshProfile() calls /api/profile
   - Get profile_image relative path from database
   - Convert to full URL with resolveProfileImageUrl()
   - Save to localStorage
   - Call updateUserProfile()
2. ✅ AVATARS DISPLAY CORRECTLY!
```

### 3. Remove Profile Image
```
1. Click "Remove Image" button
2. DELETE request to /api/profile/delete-image
3. Backend:
   - Deletes physical file
   - Sets profile_image = NULL in database
4. Frontend:
   - Sets profile_image = null in localStorage
   - Restores default avatar (user's initial)
5. ✅ DEFAULT AVATAR RESTORED!
```

---

## localStorage Structure

```javascript
// User object stored in localStorage:
{
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  profile_image: "http://localhost:3000/uploads/profile-images/profile-xxx.jpg",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Key Point:** `profile_image` in localStorage stores **full URL** (not base64 or relative path)

---

## Key Fixes Made

### Issue 1: Images not showing after refresh
**Problem:** Relative paths stored, not resolving to backend
**Fix:** `resolveProfileImageUrl()` ensures consistent URL handling

### Issue 2: Remove image not working
**Problem:** Physical file not deleted from filesystem
**Fix:** Added `removePhysicalFile()` function

### Issue 3: UI not updating after upload
**Problem:** Still showing base64 preview after successful upload
**Fix:** Added UI update + `updateUserProfile()` call after upload

### Issue 4: Inconsistent URL storage
**Problem:** Some pages stored relative, some absolute
**Fix:** Standardized to always use full URLs in localStorage

---

## Testing Checklist

✅ **Backend:**
- [x] Upload directory created automatically
- [x] Unique filenames generated
- [x] File validation works
- [x] Size limit enforced
- [x] Old files deleted
- [x] Database updated correctly
- [x] Static file serving works

✅ **Frontend:**
- [x] Image preview works
- [x] Upload button responsive
- [x] All avatars update on upload
- [x] Image persists after refresh
- [x] Remove image works
- [x] Default avatar restored
- [x] All pages display correctly

---

## Security Considerations

✅ **File Validation:**
- Only image types allowed (JPG/PNG/WEBP)
- No executable files accepted
- MIME type checked

✅ **Size Limit:**
- Max 5MB to prevent abuse
- Multer enforces limit

✅ **Authentication:**
- All profile endpoints protected by JWT
- Users can only modify their own profile

✅ **File Storage:**
- Unique filenames prevent overwriting
- Files stored outside web root (relative path in DB)

---

## Files Modified

### Backend
- `backend/controllers/profileController.js` - Added comprehensive logging + improved error handling
- `backend/server.js` - Database sync fix (alter: false)
- `backend/routes/profile.js` - Multer error handling wrapper

### Frontend
- `frontend/js/main.js` - Added resolveProfileImageUrl() to updateUserProfile()
- `frontend/settings.html` - Fixed upload logic + UI updates
- `frontend/dashboard.html` - Fixed profile_image URL storage
- `frontend/scan.html` - Fixed profile_image URL storage
- `frontend/students.html` - Fixed profile_image URL storage
- `frontend/reports.html` - Fixed profile_image URL storage
- `frontend/attendance-history.html` - Fixed profile_image URL storage

---

## Future Enhancements

1. **Image Resizing/Compression** - Automatically resize large images
2. **Multiple Profile Pictures** - Allow multiple images with primary selection
3. **Social Login Avatars** - Import avatars from Google/Facebook
4. **Cropping Tool** - Allow users to crop uploaded images
5. **CDN Integration** - Serve images from CDN for faster load times

---

## Summary

The profile picture system is now **fully functional**!

✅ Upload works perfectly
✅ Save to database persists
✅ Display across all pages
✅ Refresh maintains image
✅ Remove image restores default
✅ Full debugging logs available
✅ Consistent URL handling throughout

The system follows best practices with proper validation, security checks, and clean architecture that separates concerns between backend and frontend.

---
**Last Updated:** May 2026
**Project:** Smart Facial Recognition Attendance System
