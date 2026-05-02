// Face recognition functionality using face-api.js

// Load face-api.js models
async function loadFaceModels() {
  try {
    // Load models from GitHub CDN
    await faceapi.nets.ssdMobilenetv1.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    await faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    console.log('Face models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face models:', error);
    return false;
  }
}

// Initialize webcam for face detection
function initWebcam(videoElement) {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          resolve(stream);
        };
      })
      .catch(error => {
        console.error('Error accessing webcam:', error);
        reject(error);
      });
  });
}

// Extract facial encoding from an image
async function getFaceEncoding(image) {
  try {
    const detections = await faceapi.detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();
    
    if (detections.length === 0) {
      throw new Error('No face detected');
    }
    
    if (detections.length > 1) {
      throw new Error('Multiple faces detected. Please ensure only one face is visible.');
    }
    
    return detections[0].descriptor;
  } catch (error) {
    console.error('Error extracting face encoding:', error);
    throw error;
  }
}

// Compare face encodings
function compareFaceEncodings(knownEncoding, unknownEncoding, threshold = 0.6) {
  const distance = faceapi.euclideanDistance(knownEncoding, unknownEncoding);
  return {
    distance,
    match: distance < threshold
  };
}

// Detect and draw face landmarks on video stream
async function detectAndDrawFaces(videoElement, canvasElement) {
  try {
    const detections = await faceapi.detectAllFaces(videoElement)
      .withFaceLandmarks()
      .withFaceDescriptors();
    
    // Clear canvas
    canvasElement.getContext('2d').clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Resize canvas to match video dimensions
    faceapi.matchDimensions(canvasElement, videoElement);
    
    // Draw detections on canvas
    const resizedDetections = faceapi.resizeResults(detections, videoElement);
    faceapi.draw.drawDetections(canvasElement, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvasElement, resizedDetections);
    
    return detections;
  } catch (error) {
    console.error('Error detecting faces:', error);
    return [];
  }
}

// Start face recognition process for attendance
async function startFaceRecognition(videoElement, canvasElement, onMatch) {
  // Load models
  const modelsLoaded = await loadFaceModels();
  if (!modelsLoaded) {
    alert('Error loading face models. Please check the models directory.');
    return;
  }
  
  // Initialize webcam
  try {
    await initWebcam(videoElement);
  } catch (error) {
    alert('Error accessing webcam. Please allow camera permissions.');
    return;
  }
  
  // Fetch all students with their facial encodings
  let students = [];
  try {
    const response = await fetch('http://localhost:3000/api/students', {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });
    students = await response.json();
    
    // Convert facial encodings from JSON to Float32Array
    students = students.map(student => ({
      ...student,
      facialEncoding: student.facialEncoding ? new Float32Array(Object.values(student.facialEncoding)) : null
    })).filter(student => student.facialEncoding);
    
    if (students.length === 0) {
      alert('No students with facial encodings found. Please register students first.');
      return;
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    alert('Error fetching students. Please try again.');
    return;
  }
  
  // Start recognition loop
  const recognitionInterval = setInterval(async () => {
    try {
      const detections = await detectAndDrawFaces(videoElement, canvasElement);
      
      if (detections.length === 1) {
        const unknownEncoding = detections[0].descriptor;
        
        // Compare with all students
        let bestMatch = null;
        let lowestDistance = Infinity;
        
        for (const student of students) {
          const { distance, match } = compareFaceEncodings(student.facialEncoding, unknownEncoding);
          
          if (match && distance < lowestDistance) {
            lowestDistance = distance;
            bestMatch = student;
          }
        }
        
        if (bestMatch) {
          clearInterval(recognitionInterval);
          onMatch(bestMatch);
        }
      }
    } catch (error) {
      console.error('Error in recognition loop:', error);
    }
  }, 1000); // Run every 1 second
  
  return recognitionInterval;
}

// Capture face from webcam for student registration
async function captureFaceForRegistration(videoElement) {
  try {
    // Load models
    const modelsLoaded = await loadFaceModels();
    if (!modelsLoaded) {
      throw new Error('Error loading face models');
    }
    
    // Initialize webcam
    await initWebcam(videoElement);
    
    // Wait for video to be ready
    await new Promise(resolve => {
      videoElement.onloadeddata = resolve;
    });
    
    // Capture frame and extract face encoding
    const encoding = await getFaceEncoding(videoElement);
    
    // Stop webcam
    videoElement.srcObject.getTracks().forEach(track => track.stop());
    
    return encoding;
  } catch (error) {
    console.error('Error capturing face:', error);
    throw error;
  }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadFaceModels,
    initWebcam,
    getFaceEncoding,
    compareFaceEncodings,
    detectAndDrawFaces,
    startFaceRecognition,
    captureFaceForRegistration
  };
}