import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faEdit, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  loadData,
  setData,
  updateData,
  removeData,
  deleteAllData,
} from '../database/dbFunctions';
import {
  handleImagePick,
  handleDocumentPick,
  handlePlayAudio,
  handlePauseAudio,
} from '../Utils/mediaHandlers';

library.add(faTrashAlt, faEdit, faPlay, faPause);

export default function Home() {
  const [Mision, setMision] = useState<Agentes[]>([]);
  const [idToUpdate, setIdToUpdate] = useState<number | null>(null);
  const [fecha, setFecha] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState('');
  const [audio, setAudio] = useState('');
  const [showDatePpicker, setShowDatePpicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadData(setMision);
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, [soundObject]);

  const resetForm = () => {
    setFecha('');
    setTitulo('');
    setDescripcion('');
    setFoto('');
    setAudio('');
    if (soundObject) {
      soundObject.unloadAsync();
    }
    setIsPlaying(false);
  };

  const showDatePicker = () => {
    setShowDatePpicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePpicker(Platform.OS === 'ios');
    setDate(currentDate);
    setFecha(currentDate.toISOString().split('T')[0]);
  };

  const handleEdit = (item: Agentes) => {
    setIdToUpdate(item.id);
    setFecha(item.date);
    setTitulo(item.title);
    setDescripcion(item.description);
    setFoto(item.photo);
    setAudio(item.audio);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{idToUpdate ? 'Editar Mision' : 'Agregar Mision'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={fecha}
            onChangeText={setFecha}
            onFocus={showDatePicker}
          />
          {showDatePpicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                textColor="white" // Este prop no está soportado en Android
              />
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Título"
            placeholderTextColor="#aaa"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            placeholderTextColor="#aaa"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <TouchableOpacity style={styles.imagePickerButton} onPress={() => handleImagePick(setFoto)}>
            <Text style={styles.imagePickerButtonText}>Seleccionar Imagen</Text>
          </TouchableOpacity>
          {foto ? (
            <Image
              source={{ uri: `data:image/png;base64,${foto}` }}
              style={styles.image}
            />
          ) : null}
          <TouchableOpacity style={styles.imagePickerButton} onPress={() => handleDocumentPick(setAudio)}>
            <Text style={styles.imagePickerButtonText}>Seleccionar Audio</Text>
          </TouchableOpacity>
          <Button
            title={idToUpdate ? 'Actualizar Mision' : 'Agregar Mision'}
            onPress={idToUpdate ? () => updateData(idToUpdate, fecha, titulo, descripcion, foto, audio, () => loadData(setMision), resetForm, setIdToUpdate) : () => setData(fecha, titulo, descripcion, foto, audio, () => loadData(setMision), resetForm)}
            color="#007bff"
          />
        </View>

        {Mision.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardText}>Fecha: {item.date}</Text>
            <Text style={styles.cardText}>Título: {item.title}</Text>
            <Text style={styles.cardText}>Descripción: {item.description}</Text>
            {item.photo && (
              <Image
                source={{ uri: `data:image/png;base64,${item.photo}` }}
                style={styles.image}
              />
            )}
            {item.audio && (
              <View style={styles.audioContainer}>
                <Text style={[styles.cardText, { marginBottom: 5 }]}>Audio:</Text>
                <View style={styles.audioControls}>
                  {!isPlaying ? (
                    <TouchableOpacity onPress={() => handlePlayAudio(item.audio, setSoundObject, setIsPlaying, soundObject)}>
                      <FontAwesomeIcon icon={faPlay} size={24} color="blue" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handlePauseAudio(soundObject, setIsPlaying)}>
                      <FontAwesomeIcon icon={faPause} size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.cardButton}>
                <FontAwesomeIcon icon={faEdit} size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeData(item.id, () => loadData(setMision), soundObject)} style={styles.cardButton}>
                <FontAwesomeIcon icon={faTrashAlt} size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.deleteAllButton} onPress={() => deleteAllData(() => loadData(setMision), soundObject)}>
          <Text style={styles.deleteAllButtonText}>Eliminar Todos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1b1b1b',
  },
  formContainer: {
    marginBottom: 40,
    marginTop: 85,
    padding: 20,
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  datePickerContainer: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  imagePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    marginBottom: 10,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cardButton: {
    padding: 10,
  },
  deleteAllButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  deleteAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
