import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, MapPin, AlertCircle, RotateCcw } from 'lucide-react';

// Anatomical region mapping based on MediaPipe Pose landmarks
const BODY_REGIONS = {
  head: { name: 'Head', landmarks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], color: '#8b5cf6' },
  neck: { name: 'Neck', landmarks: [11, 12], color: '#06b6d4' },
  leftShoulder: { name: 'Left Shoulder', landmarks: [11], color: '#3b82f6' },
  rightShoulder: { name: 'Right Shoulder', landmarks: [12], color: '#3b82f6' },
  chest: { name: 'Chest', landmarks: [11, 12, 23, 24], color: '#ef4444' },
  leftArm: { name: 'Left Arm', landmarks: [13, 15], color: '#22c55e' },
  rightArm: { name: 'Right Arm', landmarks: [14, 16], color: '#22c55e' },
  leftElbow: { name: 'Left Elbow', landmarks: [13], color: '#eab308' },
  rightElbow: { name: 'Right Elbow', landmarks: [14], color: '#eab308' },
  leftWrist: { name: 'Left Wrist', landmarks: [15], color: '#f97316' },
  rightWrist: { name: 'Right Wrist', landmarks: [16], color: '#f97316' },
  abdomen: { name: 'Abdomen', landmarks: [23, 24], color: '#ec4899' },
  leftHip: { name: 'Left Hip', landmarks: [23], color: '#14b8a6' },
  rightHip: { name: 'Right Hip', landmarks: [24], color: '#14b8a6' },
  leftKnee: { name: 'Left Knee', landmarks: [25], color: '#a855f7' },
  rightKnee: { name: 'Right Knee', landmarks: [26], color: '#a855f7' },
  leftAnkle: { name: 'Left Ankle', landmarks: [27], color: '#06b6d4' },
  rightAnkle: { name: 'Right Ankle', landmarks: [28], color: '#06b6d4' },
};

// Connection pairs for drawing the skeleton
const POSE_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
  [25, 27], [26, 28],
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
];

const ARBodyLocator = ({ onRegionDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectedRegion, setDetectedRegion] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const streamRef = useRef(null);
  const poseRef = useRef(null);
  const animFrameRef = useRef(null);

  const startCamera = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);

      // Try to load MediaPipe Pose
      try {
        const { Pose } = await import('https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js');
        const pose = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`
        });
        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        pose.onResults(handlePoseResults);
        poseRef.current = pose;
        detectPose();
      } catch {
        // MediaPipe failed to load, fall back to simulated skeleton
        console.warn('MediaPipe Pose not available, using simulated skeleton overlay');
        startSimulatedPose();
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access to use AR body locator.');
      console.error(err);
    }
    setLoading(false);
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setCameraActive(false);
    setLandmarks(null);
    setDetectedRegion(null);
  }, []);

  const handlePoseResults = useCallback((results) => {
    if (results.poseLandmarks) {
      setLandmarks(results.poseLandmarks);
      drawSkeleton(results.poseLandmarks);
    }
  }, []);

  const detectPose = useCallback(async () => {
    if (!poseRef.current || !videoRef.current || !cameraActive) return;
    try {
      await poseRef.current.send({ image: videoRef.current });
    } catch {}
    animFrameRef.current = requestAnimationFrame(detectPose);
  }, [cameraActive]);

  // Simulated pose for demo when MediaPipe isn't available
  const startSimulatedPose = useCallback(() => {
    const simulate = () => {
      if (!canvasRef.current || !videoRef.current) return;
      const canvas = canvasRef.current;
      const w = canvas.width = videoRef.current.videoWidth || 640;
      const h = canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      const time = Date.now() / 1000;
      const breathe = Math.sin(time * 1.5) * 3;

      // Simulated landmark positions (normalized)
      const simLandmarks = [
        { x: 0.5, y: 0.12, z: 0 },  // 0 nose
        { x: 0.49, y: 0.10, z: 0 },  // 1 left eye inner
        { x: 0.48, y: 0.10, z: 0 },  // 2 left eye
        { x: 0.47, y: 0.10, z: 0 },  // 3 left eye outer
        { x: 0.51, y: 0.10, z: 0 },  // 4 right eye inner
        { x: 0.52, y: 0.10, z: 0 },  // 5 right eye
        { x: 0.53, y: 0.10, z: 0 },  // 6 right eye outer
        { x: 0.46, y: 0.12, z: 0 },  // 7 left ear
        { x: 0.54, y: 0.12, z: 0 },  // 8 right ear
        { x: 0.49, y: 0.14, z: 0 },  // 9 mouth left
        { x: 0.51, y: 0.14, z: 0 },  // 10 mouth right
        { x: 0.38, y: 0.28 + breathe / h, z: 0 },  // 11 left shoulder
        { x: 0.62, y: 0.28 + breathe / h, z: 0 },  // 12 right shoulder
        { x: 0.30, y: 0.42, z: 0 },  // 13 left elbow
        { x: 0.70, y: 0.42, z: 0 },  // 14 right elbow
        { x: 0.25, y: 0.55, z: 0 },  // 15 left wrist
        { x: 0.75, y: 0.55, z: 0 },  // 16 right wrist
        { x: 0.24, y: 0.58, z: 0 },  // 17 left pinky
        { x: 0.76, y: 0.58, z: 0 },  // 18 right pinky
        { x: 0.23, y: 0.57, z: 0 },  // 19 left index
        { x: 0.77, y: 0.57, z: 0 },  // 20 right index
        { x: 0.24, y: 0.56, z: 0 },  // 21 left thumb
        { x: 0.76, y: 0.56, z: 0 },  // 22 right thumb
        { x: 0.42, y: 0.58 + breathe / h, z: 0 },  // 23 left hip
        { x: 0.58, y: 0.58 + breathe / h, z: 0 },  // 24 right hip
        { x: 0.40, y: 0.75, z: 0 },  // 25 left knee
        { x: 0.60, y: 0.75, z: 0 },  // 26 right knee
        { x: 0.39, y: 0.92, z: 0 },  // 27 left ankle
        { x: 0.61, y: 0.92, z: 0 },  // 28 right ankle
      ];

      setLandmarks(simLandmarks);
      drawSkeleton(simLandmarks);
      animFrameRef.current = requestAnimationFrame(simulate);
    };
    simulate();
  }, []);

  const drawSkeleton = useCallback((lm) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width = 640;
    const h = canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;

    POSE_CONNECTIONS.forEach(([a, b]) => {
      if (lm[a] && lm[b]) {
        ctx.beginPath();
        ctx.moveTo(lm[a].x * w, lm[a].y * h);
        ctx.lineTo(lm[b].x * w, lm[b].y * h);
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0;

    // Draw landmarks
    lm.forEach((point, idx) => {
      if (!point) return;
      const x = point.x * w;
      const y = point.y * h;

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = idx <= 10 ? '#8b5cf6' : '#06b6d4';
      ctx.fill();

      // Bright center
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

    // Highlight detected region
    if (detectedRegion) {
      const region = BODY_REGIONS[detectedRegion];
      if (region) {
        region.landmarks.forEach(li => {
          if (lm[li]) {
            ctx.beginPath();
            ctx.arc(lm[li].x * w, lm[li].y * h, 16, 0, 2 * Math.PI);
            ctx.strokeStyle = region.color;
            ctx.lineWidth = 3;
            ctx.shadowColor = region.color;
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });
      }
    }
  }, [detectedRegion]);

  const handleCanvasClick = useCallback((e) => {
    if (!landmarks || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 640 / rect.width;
    const scaleY = 480 / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX / 640;
    const clickY = (e.clientY - rect.top) * scaleY / 480;

    // Find nearest landmark
    let minDist = Infinity;
    let nearestIdx = -1;

    landmarks.forEach((lm, idx) => {
      if (!lm) return;
      const dist = Math.sqrt((lm.x - clickX) ** 2 + (lm.y - clickY) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = idx;
      }
    });

    if (minDist > 0.08) return; // too far from any landmark

    // Map to body region
    for (const [regionKey, region] of Object.entries(BODY_REGIONS)) {
      if (region.landmarks.includes(nearestIdx)) {
        setDetectedRegion(regionKey);
        onRegionDetected?.({
          region: region.name,
          key: regionKey,
          confidence: Math.round((1 - minDist / 0.08) * 100),
          coordinates: landmarks[nearestIdx],
        });
        break;
      }
    }
  }, [landmarks, onRegionDetected]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/50">
        {/* Video feed */}
        <video
          ref={videoRef}
          className={`w-full h-[360px] object-cover ${cameraActive ? 'block' : 'hidden'}`}
          playsInline
          muted
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* AR Canvas overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full cursor-crosshair ${cameraActive ? 'block' : 'hidden'}`}
          onClick={handleCanvasClick}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Placeholder when camera is off */}
        {!cameraActive && (
          <div className="w-full h-[360px] flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
              <Camera className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AR Symptom Locator</h3>
            <p className="text-sm text-slate-400 max-w-xs mb-6">
              Enable your webcam to see a skeletal overlay. Click on any body part to log it as a symptom location.
            </p>
            <button
              onClick={startCamera}
              disabled={loading}
              className="glass-button px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Initializing Camera...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Enable Camera
                </>
              )}
            </button>
          </div>
        )}

        {/* Camera active controls */}
        {cameraActive && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">AR Active</span>
            </div>
            <button
              onClick={stopCamera}
              className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-red-500/30 transition-colors"
              title="Stop Camera"
            >
              <CameraOff className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Instructions overlay */}
        {cameraActive && !detectedRegion && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-cyan-400 shrink-0 animate-bounce" />
              <p className="text-sm text-slate-200">
                Click on any body part in the skeleton overlay to identify the anatomical region
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300">{error}</p>
            <button onClick={startCamera} className="text-sm text-red-400 hover:text-red-300 mt-2 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Try Again
            </button>
          </div>
        </div>
      )}

      {/* Detected Region Display */}
      <AnimatePresence>
        {detectedRegion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: BODY_REGIONS[detectedRegion]?.color }}
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  {BODY_REGIONS[detectedRegion]?.name} Detected
                </p>
                <p className="text-xs text-slate-400">Region logged as symptom location</p>
              </div>
            </div>
            <button
              onClick={() => setDetectedRegion(null)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ARBodyLocator;
