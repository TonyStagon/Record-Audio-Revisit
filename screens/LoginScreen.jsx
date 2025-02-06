import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      if (!userDetails) {
        Alert.alert('Error', 'No registered user found.');
        return;
      }

      const { email: storedEmail, password: storedPassword } = JSON.parse(userDetails);
      if (email === storedEmail && password === storedPassword) {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => navigation.navigate('RecordingsList') },
        ]);
      } else {
        Alert.alert('Error', 'Invalid credentials.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA', // Changed background color
    padding: 30, // Increased padding for more spacing
  },
  title: {
    fontSize: 26, // Increased font size
    fontWeight: '700', // Bolded the title
    color: '#FF6347', // Changed title color
    marginBottom: 30, // Increased margin for separation
  },
  input: {
    width: '100%',
    height: 55, // Increased height for better accessibility
    borderWidth: 1,
    borderColor: '#F1C40F', // Changed border color
    borderRadius: 10, // Increased border radius
    paddingHorizontal: 15, // More padding for the text
    fontSize: 18, // Increased font size for inputs
    backgroundColor: '#FFF', // Kept the background white
    marginBottom: 20, // Increased margin for separation
  },
  button: {
    width: '100%',
    height: 55, // Increased button height
    backgroundColor: '#32CD32', // Changed background to green
    borderRadius: 10, // Rounded corners for the button
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15, // Added top margin for spacing
  },
  buttonText: {
    color: '#FFF', // White text on the button
    fontSize: 20, // Larger font size
    fontWeight: '600', // Made text semi-bold
  },
});
