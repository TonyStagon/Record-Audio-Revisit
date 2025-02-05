import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AudioPlayer from './AudioPlayer';

const recordings = [
  { id: '1', uri: 'https://example.com/audio1.mp3', date: '2024-01-01' },
  { id: '2', uri: 'https://example.com/audio2.mp3', date: '2024-01-02' },
];

export default function HomeScreen() {
  const [selectedRecording, setSelectedRecording] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Notes</Text>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteItem}
            onPress={() => setSelectedRecording(item.uri)}
          >
            <Text style={styles.noteText}>Recording - {item.date}</Text>
            {selectedRecording === item.uri && <AudioPlayer uri={item.uri} />}
          </TouchableOpacity>
        )}
      />
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
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 16,
  },
});