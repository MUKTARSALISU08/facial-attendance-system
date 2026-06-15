// Face recognition functionality using face-api.js
// Clean implementation using SSD MobileNet v1

async function loadFaceModels() {
  const MODEL_PATH = `${API_BASE_URL}/assets/models`;
  console.log(
    "[Face Recognition] =============================================",
  );
  console.log("[Face Recognition] Loading face models...");
  console.log("[Face Recognition] Model Path:", MODEL_PATH);
  console.log(
    "[Face Recognition] =============================================",
  );

  try {
    console.log("[Face Recognition] Loading SSD MobileNet v1...");
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_PATH);
    console.log("[Face Recognition] ✅ SSD MobileNet v1 loaded");

    console.log("[Face Recognition] Loading Face Landmark 68...");
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH);
    console.log("[Face Recognition] ✅ Face Landmark 68 loaded");

    console.log("[Face Recognition] Loading Face Recognition...");
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH);
    console.log("[Face Recognition] ✅ Face Recognition loaded");

    console.log(
      "[Face Recognition] =============================================",
    );
    console.log("[Face Recognition] ✅ All models loaded successfully!");
    console.log(
      "[Face Recognition] =============================================",
    );
    return true;
  } catch (error) {
    console.error(
      "[Face Recognition] =============================================",
    );
    console.error("[Face Recognition] ❌ Error loading face models");
    console.error("[Face Recognition] Error:", error.message);
    console.error(
      "[Face Recognition] =============================================",
    );
    return false;
  }
}

function initWebcam(videoElement) {
  console.log("[Face Recognition] Initializing webcam...");

  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          console.log("[Face Recognition] ✅ Webcam initialized successfully");
          resolve(stream);
        };
      })
      .catch((error) => {
        console.error(
          "[Face Recognition] ❌ Error accessing webcam:",
          error.message,
        );
        reject(error);
      });
  });
}

async function getFaceEncoding(image) {
  console.log("[Face Recognition] Extracting face encoding...");

  try {
    const detections = await faceapi
      .detectAllFaces(
        image,
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }),
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length === 0) {
      throw new Error("No face detected");
    }

    if (detections.length > 1) {
      throw new Error(
        "Multiple faces detected. Please ensure only one face is visible.",
      );
    }

    console.log("[Face Recognition] ✅ Face encoding extracted successfully");
    console.log(
      "[Face Recognition] Descriptor length:",
      detections[0].descriptor.length,
    );
    return detections[0].descriptor;
  } catch (error) {
    console.error(
      "[Face Recognition] ❌ Error extracting face encoding:",
      error.message,
    );
    throw error;
  }
}

function compareFaceEncodings(knownEncoding, unknownEncoding, threshold = 0.5) {
  try {
    if (!(knownEncoding instanceof Float32Array)) {
      console.error("[Face Recognition] ❌ knownEncoding is not Float32Array");
      return { distance: Infinity, match: false };
    }
    if (!(unknownEncoding instanceof Float32Array)) {
      console.error(
        "[Face Recognition] ❌ unknownEncoding is not Float32Array",
      );
      return { distance: Infinity, match: false };
    }

    if (knownEncoding.length !== unknownEncoding.length) {
      console.error("[Face Recognition] ❌ Encoding length mismatch");
      return { distance: Infinity, match: false };
    }

    const distance = faceapi.euclideanDistance(knownEncoding, unknownEncoding);
    const match = distance < threshold;

    console.log(
      "[Face Recognition] Distance:",
      distance.toFixed(4),
      "- Threshold:",
      threshold,
      "- Match:",
      match,
    );

    return { distance, match };
  } catch (error) {
    console.error(
      "[Face Recognition] ❌ Error comparing face encodings:",
      error.message,
    );
    return { distance: Infinity, match: false };
  }
}

async function detectAndDrawFaces(videoElement, canvasElement) {
  try {
    console.log("[Face Recognition] ==============================================");
    console.log("[Face Recognition] detectAndDrawFaces called");
    
    // Check video element
    console.log("[Face Recognition] Video element:", videoElement);
    console.log("[Face Recognition] Video readyState:", videoElement.readyState);
    console.log("[Face Recognition] Video paused:", videoElement.paused);
    console.log("[Face Recognition] Video playing:", !videoElement.paused && videoElement.readyState >= 2);
    
    // Check if video has a valid stream
    console.log("[Face Recognition] Video srcObject:", videoElement.srcObject);
    if (videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      console.log("[Face Recognition] Video tracks:", tracks.length);
      tracks.forEach((track, i) => {
        console.log("[Face Recognition] Track", i, "- kind:", track.kind, "- enabled:", track.enabled);
      });
    }
    
    // More robust check for video readiness
    if (videoElement.readyState < 2 || videoElement.paused) {
      console.log("[Face Recognition] ⚠️ Video not ready (readyState:", videoElement.readyState + ", paused:", videoElement.paused + ")");
      console.log("[Face Recognition] ==============================================");
      return [];
    }

    const videoWidth = videoElement.videoWidth || videoElement.width || 640;
    const videoHeight = videoElement.videoHeight || videoElement.height || 480;
    
    console.log("[Face Recognition] Video dimensions:", videoWidth, "x", videoHeight);
    console.log("[Face Recognition] Canvas dimensions:", canvasElement.width, "x", canvasElement.height);

    // Set canvas to actual video dimensions, not CSS dimensions
    const displayWidth = videoElement.offsetWidth;
    const displayHeight = videoElement.offsetHeight;
    console.log("[Face Recognition] Video display dimensions:", displayWidth, "x", displayHeight);

    if (canvasElement.width !== videoWidth || canvasElement.height !== videoHeight) {
      console.log("[Face Recognition] Resizing canvas to", videoWidth, "x", videoHeight);
      canvasElement.width = videoWidth;
      canvasElement.height = videoHeight;
    }

    console.log("[Face Recognition] Starting face detection...");
    const startTime = Date.now();
    
    // Use detectAllFaces like registration does
    const detections = await faceapi
      .detectAllFaces(videoElement, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const endTime = Date.now();
    console.log("[Face Recognition] Detection completed in", (endTime - startTime), "ms");
    console.log("[Face Recognition] Found", detections.length, "face(s)");

    // Log detailed detection info
    detections.forEach((det, index) => {
      console.log("[Face Recognition] Face", index + 1, "- Confidence:", det.detection.score.toFixed(4));
      console.log("[Face Recognition] Face", index + 1, "- Has descriptor:", det.descriptor !== undefined);
      if (det.descriptor) {
        console.log("[Face Recognition] Face", index + 1, "- Descriptor length:", det.descriptor.length);
        console.log("[Face Recognition] Face", index + 1, "- Descriptor type:", Object.prototype.toString.call(det.descriptor));
      }
    });

    const ctx = canvasElement.getContext("2d");
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Draw detection box on canvas
    if (detections.length > 0) {
      // Draw the detection on canvas
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      detections.forEach(det => {
        const box = det.detection.box;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
      });
      
      // Also draw landmarks if available
      detections.forEach(det => {
        if (det.landmarks) {
          ctx.fillStyle = '#16a34a';
          det.landmarks.positions.forEach(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      });
    }

    console.log("[Face Recognition] Returning", detections.length, "detections");
    console.log("[Face Recognition] ==============================================");
    
    return detections;
  } catch (error) {
    console.error("[Face Recognition] ==============================================");
    console.error("[Face Recognition] ❌ Error detecting faces:", error.message);
    console.error("[Face Recognition] Stack:", error.stack);
    console.error("[Face Recognition] ==============================================");
    return [];
  }
}

function showFaceRecognitionToast(message, type = "error") {
  let toast = document.getElementById("face-recognition-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "face-recognition-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(toast);
  }

  toast.style.backgroundColor = type === "success" ? "#10b981" : "#ef4444";
  toast.textContent = message;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3000);
}

async function startFaceRecognition(
  videoElement,
  canvasElement,
  onMatch,
  onError,
) {
  console.log(
    "[Face Recognition] =============================================",
  );
  console.log("[Face Recognition] Starting face recognition process...");
  console.log(
    "[Face Recognition] =============================================",
  );

  console.log("[Face Recognition] Step 1: Loading face models...");
  const modelsLoaded = await loadFaceModels();
  if (!modelsLoaded) {
    const errorMsg =
      "Failed to load face recognition models. Please check if all model files exist in assets/models/";
    console.error("[Face Recognition]", errorMsg);
    showFaceRecognitionToast(errorMsg);
    if (onError) onError(errorMsg);
    return;
  }

  console.log("[Face Recognition] Step 2: Initializing webcam...");
  try {
    await initWebcam(videoElement);
  } catch (error) {
    const errorMsg = "Error accessing webcam. Please allow camera permissions.";
    console.error("[Face Recognition]", errorMsg);
    showFaceRecognitionToast(errorMsg);
    if (onError) onError(errorMsg);
    return;
  }

  await new Promise((resolve) => {
    const checkReady = () => {
      if (videoElement.readyState >= 2) {
        resolve();
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  });

  console.log("[Face Recognition] Step 3: Fetching students...");
  let students = [];
  try {
    const response = await fetch(`${API_BASE_URL}/api/students`, {
      headers: { "x-auth-token": localStorage.getItem("token") },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    students = await response.json();
    console.log("[Face Recognition] Fetched", students.length, "students");

    students = students
      .map((student) => {
        let facialEncoding = null;
        if (student.facialEncoding) {
          try {
            const encodingData =
              typeof student.facialEncoding === "string"
                ? JSON.parse(student.facialEncoding)
                : student.facialEncoding;

            if (Array.isArray(encodingData)) {
              facialEncoding = new Float32Array(encodingData);
            } else if (
              typeof encodingData === "object" &&
              encodingData !== null
            ) {
              const values = Object.values(encodingData);
              if (values.length > 0 && typeof values[0] === "number") {
                facialEncoding = new Float32Array(values);
              }
            }
          } catch (e) {
            console.error(
              "[Face Recognition] Error parsing facial encoding for:",
              student.name,
              e,
            );
          }
        }
        return { ...student, facialEncoding };
      })
      .filter((student) => student.facialEncoding !== null);

    console.log(
      "[Face Recognition] Students with valid encodings:",
      students.length,
    );

    if (students.length === 0) {
      const errorMsg =
        "No students with facial data found. Please register students first.";
      console.error("[Face Recognition]", errorMsg);
      showFaceRecognitionToast(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }
  } catch (error) {
    console.error("[Face Recognition] Error fetching students:", error.message);
    const errorMsg = "Error fetching students. Please try again.";
    showFaceRecognitionToast(errorMsg);
    if (onError) onError(errorMsg);
    return;
  }

  console.log("[Face Recognition] Step 4: Starting recognition loop...");
  let noFaceCount = 0;
  let noMatchCount = 0;
  const MAX_NO_FACE = 10;
  const MAX_NO_MATCH = 15;

  const recognitionInterval = setInterval(async () => {
    try {
      const detections = await detectAndDrawFaces(videoElement, canvasElement);

      if (detections.length === 1) {
        noFaceCount = 0;
        const unknownEncoding = detections[0].descriptor;

        console.log(
          "[Face Recognition] Face detected - comparing with students...",
        );

        let bestMatch = null;
        let lowestDistance = Infinity;

        for (const student of students) {
          const { distance, match } = compareFaceEncodings(
            student.facialEncoding,
            unknownEncoding,
          );

          if (match && distance < lowestDistance) {
            lowestDistance = distance;
            bestMatch = student;
          }
        }

        if (bestMatch) {
          console.log(
            "[Face Recognition] =============================================",
          );
          console.log("[Face Recognition] ✅ Match found:", bestMatch.name);
          console.log(
            "[Face Recognition] Distance:",
            lowestDistance.toFixed(4),
          );
          console.log(
            "[Face Recognition] =============================================",
          );
          clearInterval(recognitionInterval);
          onMatch(bestMatch);
        } else {
          noMatchCount++;
          if (noMatchCount >= MAX_NO_MATCH) {
            console.log(
              "[Face Recognition] ⚠️ No match found after multiple attempts",
            );
            showFaceRecognitionToast(
              "No matching student found. Please ensure your face is registered.",
              "warning",
            );
            noMatchCount = 0;
          }
        }
      } else if (detections.length > 1) {
        console.log("[Face Recognition] ⚠️ Multiple faces detected");
      } else {
        noFaceCount++;
        if (noFaceCount >= MAX_NO_FACE) {
          console.log("[Face Recognition] ⚠️ No face detected");
          showFaceRecognitionToast(
            "No face detected. Please position your face in front of camera.",
            "warning",
          );
          noFaceCount = 0;
        }
      }
    } catch (error) {
      console.error(
        "[Face Recognition] Error in recognition loop:",
        error.message,
      );
    }
  }, 1000);

  return recognitionInterval;
}

async function captureFaceForRegistration(videoElement) {
  console.log(
    "[Face Recognition] =============================================",
  );
  console.log("[Face Recognition] Capturing face for registration...");
  console.log(
    "[Face Recognition] =============================================",
  );

  try {
    console.log("[Face Recognition] Step 1: Loading face models...");
    const modelsLoaded = await loadFaceModels();
    if (!modelsLoaded) {
      throw new Error("Failed to load face models");
    }

    console.log("[Face Recognition] Step 2: Initializing webcam...");
    await initWebcam(videoElement);

    await new Promise((resolve) => {
      videoElement.onloadeddata = resolve;
    });

    console.log("[Face Recognition] Step 3: Extracting face encoding...");
    const encoding = await getFaceEncoding(videoElement);

    videoElement.srcObject.getTracks().forEach((track) => track.stop());

    console.log(
      "[Face Recognition] =============================================",
    );
    console.log(
      "[Face Recognition] ✅ Face captured successfully for registration",
    );
    console.log("[Face Recognition] Descriptor length:", encoding.length);
    console.log(
      "[Face Recognition] =============================================",
    );
    return encoding;
  } catch (error) {
    console.error("[Face Recognition] ❌ Error capturing face:", error.message);
    throw error;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadFaceModels,
    initWebcam,
    getFaceEncoding,
    compareFaceEncodings,
    detectAndDrawFaces,
    startFaceRecognition,
    captureFaceForRegistration,
  };
}
