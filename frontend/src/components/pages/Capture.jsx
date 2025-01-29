import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImagePlus, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PhotoCapture = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Failed to access camera. Please ensure you have given camera permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    try {
      if (!videoRef.current || !isCameraActive) {
        throw new Error('Camera is not ready');
      }

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to capture image');
        }
        setCapturedImage(blob);
        stopCamera();
        setError(null);
      }, 'image/jpeg', 0.8);

    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture image. Please try again.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    setCapturedImage(file);
    stopCamera();
    setError(null);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    startCamera();
  };

  const savePhoto = async () => {
    if (!capturedImage) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', capturedImage, 
        capturedImage.name || 'captured-photo.jpg'
      );

      const uploadResponse = await fetch('http://localhost:3000/api/upload-image', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await uploadResponse.json();
      console.log('Upload success:', result);
      
      // Clear the captured image after successful upload
      setCapturedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setError(null);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to save image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!capturedImage ? (
        <>
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onError={(e) => {
                console.error('Video error:', e);
                setError('Error loading camera feed');
                setIsCameraActive(false);
              }}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={startCamera}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isCameraActive 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={isCameraActive}
            >
              <Camera className="w-5 h-5" />
              Start Camera
            </button>
            
            <button
              onClick={capturePhoto}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isCameraActive 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isCameraActive}
            >
              <ImagePlus className="w-5 h-5" />
              Capture
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer">
              <Upload className="w-5 h-5" />
              Upload File
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(capturedImage)}
              alt="Captured photo"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={retakePhoto}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              disabled={isUploading}
            >
              Retake
            </button>
            
            <button
              onClick={savePhoto}
              className={`px-4 py-2 ${
                isUploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white rounded-lg`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Save Photo'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoCapture;