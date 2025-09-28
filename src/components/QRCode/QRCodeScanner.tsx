import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  X, 
  User, 
  Clock, 
  Shield,
  RefreshCw,
  Camera,
  CameraOff
} from 'lucide-react';

interface QRCodeScannerProps {
  onScanResult: (result: any) => void;
  onClose: () => void;
  userRole: string;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanResult,
  onClose,
  userRole
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraPermission(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // In a real implementation, you would use a QR code scanning library here
    // For demo purposes, we'll simulate scanning
    simulateQRScan();
  };

  const simulateQRScan = () => {
    // Simulate QR code detection
    const mockQRData = {
      type: 'safelink_verification',
      userCode: 'DEMO123456',
      timestamp: Date.now() - 30000, // 30 seconds ago
      version: '1.0',
      security: {
        hash: 'a1b2c3d4e5f6g7h8',
        nonce: 'xyz789abc'
      }
    };

    setScanResult(mockQRData);
    verifyQRCode(mockQRData);
  };

  const verifyQRCode = async (qrData: any) => {
    try {
      // Validate QR code structure
      if (!qrData.type || qrData.type !== 'safelink_verification') {
        setIsValid(false);
        setVerificationStatus('Invalid QR code format');
        return;
      }

      // Check timestamp (QR codes expire after 5 minutes)
      const now = Date.now();
      const qrTime = qrData.timestamp;
      const timeDiff = now - qrTime;
      const fiveMinutes = 5 * 60 * 1000;

      if (timeDiff > fiveMinutes) {
        setIsValid(false);
        setVerificationStatus('QR code has expired');
        return;
      }

      // Verify security hash
      const isValidHash = await verifySecurityHash(qrData.userCode, qrData.security.hash);
      
      if (!isValidHash) {
        setIsValid(false);
        setVerificationStatus('Security verification failed');
        return;
      }

      // All checks passed
      setIsValid(true);
      setVerificationStatus('Verification successful');
      
      // Call the result handler
      onScanResult({
        userCode: qrData.userCode,
        timestamp: qrData.timestamp,
        verified: true,
        role: userRole
      });

    } catch (error) {
      setIsValid(false);
      setVerificationStatus('Verification error');
    }
  };

  const verifySecurityHash = async (userCode: string, hash: string): Promise<boolean> => {
    // In a real implementation, this would verify the hash against the server
    // For demo purposes, we'll simulate verification
    return hash.length === 16 && userCode.length >= 6;
  };

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
    setIsValid(null);
    setVerificationStatus('');
  };

  const stopScanning = () => {
    setIsScanning(false);
    stopCamera();
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsValid(null);
    setVerificationStatus('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">QR Code Scanner</h2>
              <p className="text-blue-100 text-sm">Verify SafeLink users</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Camera Permission Status */}
          {cameraPermission === false && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">Camera access denied. Please enable camera permissions.</span>
              </div>
            </div>
          )}

          {/* Scanner Controls */}
          {!isScanning && !scanResult && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Scan
              </h3>
              <p className="text-gray-600 mb-6">
                Point your camera at a SafeLink QR code to verify the user
              </p>
              <button
                onClick={startScanning}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
              >
                <Camera className="w-4 h-4" />
                <span>Start Scanning</span>
              </button>
            </div>
          )}

          {/* Camera View */}
          {isScanning && (
            <div className="mb-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed rounded-lg w-48 h-48 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-white/50" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={stopScanning}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Stop</span>
                </button>
                <button
                  onClick={scanQRCode}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Scan Results */}
          {scanResult && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    isValid ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {verificationStatus}
                  </span>
                </div>
                
                {isValid && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-green-800">
                        User Code: {scanResult.userCode}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-green-800">
                        Generated: {new Date(scanResult.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-green-800">
                        Security: Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={resetScanner}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Scan Another</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
