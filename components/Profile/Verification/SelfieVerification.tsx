import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface CameraBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onPhotoTaken: (uri: string) => void;
  onUploadComplete?: (uri: string) => void; // Make this optional
}

const CameraBottomSheet = ({ visible, onClose, onPhotoTaken, onUploadComplete }: CameraBottomSheetProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        setCapturedImage(photo.uri);
        // Call onUploadComplete if provided
        if (onUploadComplete) {
          onUploadComplete(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onPhotoTaken(capturedImage);
    }
    onClose();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.bottomSheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Take Selfie</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {capturedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />
              <View style={styles.previewButtons}>
                <TouchableOpacity style={styles.button} onPress={retakePhoto}>
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.confirmButton]} 
                  onPress={confirmPhoto}
                >
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>Use Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <CameraView
                style={styles.camera}
                facing="front"  // Always use front camera
                ref={cameraRef}
                onCameraReady={() => setIsCameraReady(true)}
              >
                <View style={styles.cameraOverlay}>
                  <View style={styles.faceGuide} />
                </View>
              </CameraView>

              <View style={styles.controls}>
                <TouchableOpacity 
                  style={styles.captureButton} 
                  onPress={takePicture}
                  disabled={!isCameraReady}
                >
                  <Text style={styles.captureButtonInner}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  camera: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: '#333',
    fontSize: 12,
    marginTop: 4,
  },
  // captureButton: {
  //   width: 70,
  //   height: 70,
  //   borderRadius: 35,
  //   backgroundColor: 'rgba(255,255,255,0.3)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderWidth: 3,
  //   borderColor: 'white',
  // },
  captureButtonInner: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 34,
    color: '#333',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '70%',
    borderRadius: 12,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: 'white',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CameraBottomSheet;