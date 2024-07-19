import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Principal from './src/components/Principal';
import AcercaDe from './src/components/AcercaDe';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Principal}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Usuario_001</Text>
                <Image source={require('./assets/perro.jpg')} style={styles.profileImage} />
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity style={styles.headerRightButton} onPress={() => navigation.navigate('Acerca de')}>
                <Icon name="info-circle" size={24} color="#fff" style={styles.headerRightIcon} />
                <Text style={styles.headerRightText}>Acerca de</Text>
              </TouchableOpacity>
            ),
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#1b1b1b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          })}
        />
        <Stack.Screen
          name="Acerca de"
          component={AcercaDe}
          options={{
            headerTitle: 'Acerca de',
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#1b1b1b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerRightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerRightIcon: {
    marginRight: 5,
  },
  headerRightText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
