import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';



SplashScreen.preventAutoHideAsync();

export default function App() {

  // states
  const [facing, setFacing] = useState<CameraType>('back');
  const [showCamera, setShowCamera] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');

  // camera permission
  const [permission, requestPermission] = useCameraPermissions();

  // camera ref
  const cameraRef = useRef<any>();

  const [loaded, error] = useFonts({
    Poppins_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // capture image 
  async function handleCapture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      Alert.alert('Photo Saved!', `Your photo has been saved to your library: ${asset.uri}`);
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {showCamera && (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} flash={flashMode} enableTorch={false}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setFlashMode(flashMode === 'on' ? 'off' : 'on')}>
              <Text style={styles.text}>{flashMode === 'on' ? 'Flash ON' : 'Flash OFF'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCapture}>
              <Text style={styles.text}>Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
      <Button title={showCamera ? 'Close Camera' : 'Show Camera'} onPress={() => setShowCamera(!showCamera)} />
      <Text style={styles.title}>Camera App
</Text>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "lightgray",
    padding: 16,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins_400Regular',
    
  },
  title: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
    
  },
});
