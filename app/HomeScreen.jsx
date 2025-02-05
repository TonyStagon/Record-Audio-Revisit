import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordings([...recordings, { uri, date: new Date().toLocaleString() }]);
  };

  const playRecording = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Notes</Text>

      <FlatList
        data={recordings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.noteItem} onPress={() => playRecording(item.uri)}>
            <Text style={styles.noteText}>Recording - {item.date}</Text>
            <Icon name="play-circle" size={24} color="#ff5733" />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
        <Icon name={recording ? "stop" : "mic"} size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e0a314',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 16,
  },
  recordButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff5733',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});