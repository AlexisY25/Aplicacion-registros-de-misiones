import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('Seguridad.db');

export default db;
