import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';

export const handleImagePick = async (setFoto: (foto: string) => void) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso necesario', 'Por favor, permite el acceso a la galería para seleccionar una imagen.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    base64: true,
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
    setFoto(result.assets[0].base64 || '');
  }
};

export const handleDocumentPick = async (setAudio: (audio: string) => void) => {
  try {
    const result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled) {
      const base64Audio = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setAudio(base64Audio);
    }
  } catch (error) {
    console.error('Error al seleccionar el documento:', error);
  }
};

export const handlePlayAudio = async (base64Audio: string, setSoundObject: (sound: Audio.Sound | null) => void, setIsPlaying: (playing: boolean) => void, soundObject: Audio.Sound | null) => {
  if (soundObject) {
    await soundObject.unloadAsync();
  }

  const audioData = `data:audio/mp3;base64,${base64Audio}`;

  const newSoundObject = new Audio.Sound();

  try {
    await newSoundObject.loadAsync({ uri: audioData });
    setSoundObject(newSoundObject);
    await newSoundObject.playAsync();
    setIsPlaying(true);
  } catch (error) {
    console.error('Error al reproducir el audio:', error);
  }
};

export const handlePauseAudio = async (soundObject: Audio.Sound | null, setIsPlaying: (playing: boolean) => void) => {
  if (soundObject) {
    await soundObject.pauseAsync();
    setIsPlaying(false);
  }
};
