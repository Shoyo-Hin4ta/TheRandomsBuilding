import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, RotateCcw, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MealSizeSelector from '../MealComponents/MealSizeSelector';

const ImageCapture = ({ mealType, onBack, onComplete, isLoading }) => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captureMethod, setCaptureMethod] = useState(null); 
  const [capturedImage, setCapturedImage] = useState(null);
  const [size, setSize] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!capturedImage || !size) {
      setError('Please capture an image and select a size');
      return;
    }

    onComplete({
      mealType,
      size,
      name: name.trim() || `Meal ${Date.now()}`,
      image: capturedImage,
      entryType: 'image',
      date: new Date()
    });
  };

  React.useEffect(() => {
    if (captureMethod === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [captureMethod]);

  const renderCaptureOptions = () => (
    <div className="grid grid-cols-1 gap-4">
      <Button 
        className="flex items-center justify-center gap-2"
        onClick={() => setCaptureMethod('camera')}
        disabled={isLoading}
      >
        <Camera className="w-5 h-5" />
        Take Picture
      </Button>
      <Button 
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => {
          setCaptureMethod('gallery');
          fileInputRef.current?.click();
        }}
        disabled={isLoading}
      >
        <ImageIcon className="w-5 h-5" />
        Choose from Gallery
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle>Add Meal Image</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!captureMethod && !capturedImage && renderCaptureOptions()}

        {captureMethod === 'camera' && !capturedImage && (
          <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center text-white p-4 text-center">
                {error}
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-around bg-gradient-to-t from-black/50 to-transparent">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setCaptureMethod(null)}
                disabled={isLoading}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button
                size="lg"
                className="rounded-full bg-white text-black hover:bg-white/90"
                onClick={captureImage}
                disabled={isLoading}
              >
                <Camera className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={startCamera}
                disabled={isLoading}
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured meal"
                className="w-full h-full object-cover"
              />
            </div>

            <MealSizeSelector 
              value={size}
              onChange={setSize}
              disabled={isLoading}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Meal Name (optional)
              </label>
              <Input
                placeholder="Enter meal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setCapturedImage(null);
                  setCaptureMethod(null);
                }}
                disabled={isLoading}
              >
                Retake
              </Button>
              <Button
                className="flex-1"
                disabled={!size || isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageCapture;