import { Audio } from 'expo-av';
import * as SQLite from 'expo-sqlite/legacy';
import { Alert } from 'react-native';
import db from './dbconfig'

export const loadData = (setEmergencia: (data: Agentes[]) => void) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM Agentes',
      [],
      (_, { rows }) => {
        const resultados = rows._array as Agentes[];
        setEmergencia(resultados);
      },
      (_, error) => {
        console.error('Error en la consulta SQL:', error);
        return true;
      }
    );
  });
};

export const setData = async (fecha: string, titulo: string, descripcion: string, foto: string, audio: string, loadData: () => void, resetForm: () => void) => {
  if (!fecha || !titulo || !descripcion || !foto || !audio) {
    Alert.alert('Warning!', 'Por favor introduce todos los datos');
    return;
  }

  try {
    await db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Agentes (date, title, description, photo, audio) VALUES (?, ?, ?, ?, ?);',
        [fecha, titulo, descripcion, foto, audio],
        (_, { insertId }) => {
          console.log('Registro insertado con ID:', insertId);
          loadData();
          resetForm();
        }
      );
    });
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
  }
};

export const updateData = async (idToUpdate: number | null, fecha: string, titulo: string, descripcion: string, foto: string, audio: string, loadData: () => void, resetForm: () => void, setIdToUpdate: (id: number | null) => void) => {
  if (!idToUpdate || !fecha || !titulo || !descripcion || !foto || !audio) {
    Alert.alert('Warning!', 'Por favor selecciona un registro y completa todos los campos');
    return;
  }

  try {
    await db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Agentes SET date=?, title=?, description=?, photo=?, audio=? WHERE id=?;',
        [fecha, titulo, descripcion, foto, audio, idToUpdate],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`Registro actualizado con ID ${idToUpdate}`);
            setIdToUpdate(null);
            resetForm();
            loadData();
          }
        }
      );
    });
  } catch (error) {
    console.error('Error al actualizar en la base de datos:', error);
  }
};

export const removeData = (id: number, loadData: () => void, soundObject: Audio.Sound | null) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM Agentes WHERE id=?;',
        [id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`Registro eliminado con ID ${id}`);
            if (soundObject) {
              soundObject.unloadAsync();
            }
            loadData();
          }
        }
      );
    });
  } catch (error) {
    console.error('Error al eliminar en la base de datos:', error);
  }
};

export const deleteAllData = (loadData: () => void, soundObject: Audio.Sound | null) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM Agentes;',
        [],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log('Todos los registros han sido eliminados');
            if (soundObject) {
              soundObject.unloadAsync();
            }
            loadData();
          }
        }
      );
    });
  } catch (error) {
    console.error('Error al eliminar todos los registros:', error);
  }
};
