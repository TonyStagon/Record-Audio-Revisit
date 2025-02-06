import React from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert, TextInput, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import styles from '../styles'; // Import your external styles file
import Icon from 'react-native-vector-icons/Ionicons'; // Updated to Ionicons
import * as Animatable from 'react-native-animatable'; // For button animation
import Slider from '@react-native-community/slider'; // Import Slider

export default function RecorderScreen() {
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [currentDuration, setCurrentDuration] = React.useState(0);
    const [playingSound, setPlayingSound] = React.useState(null);
    const [currentPlaybackPosition, setCurrentPlaybackPosition] = React.useState(0);
    const [soundDuration, setSoundDuration] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');

    const renameRecording = (index) => {
        Alert.prompt(
            'Rename Recording',
            'Enter a new name for this recording:', [{
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Rename',
                    onPress: (newName) => {
                        setRecordings((prevRecordings) => {
                            const updatedRecordings = [...prevRecordings];
                            updatedRecordings[index].name = newName;
                            return updatedRecordings;
                        });
                    },
                },
            ],
            'plain-text',
            recordings[index].name || `Recording #${index + 1}`
        );
    };

    const deleteRecording = (index) => {
        Alert.alert(
            'Delete Recording',
            'Are you sure you want to delete this recording?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        setRecordings((prevRecordings) => {
                            const updatedRecordings = prevRecordings.filter((_, i) => i !== index);
                            return updatedRecordings;
                        });
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const filteredRecordings = recordings.filter((recording) =>
        recording.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );
                setRecording(recording);

                recording.setOnRecordingStatusUpdate((status) => {
                    if (status.isRecording) {
                        setCurrentDuration(status.durationMillis);
                    }
                });
            }
        } catch (err) {
            console.error('Error starting recording', err);
        }
    }

    async function stopRecording() {
        setRecording(undefined);

        await recording.stopAndUnloadAsync();
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        setSoundDuration(status.durationMillis);

        setRecordings((prev) => [
            ...prev,
            {
                name: `Recording #${prev.length + 1}`,
                sound: sound,
                duration: getDurationFormatted(status.durationMillis),
                file: recording.getURI(),
            },
        ]);
        setCurrentDuration(0);
    }

    async function pauseRecording() {
        if (recording) {
            await recording.pauseAsync();
        }
    }

    async function discardRecording() {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        setCurrentDuration(0);
    }

    async function playRecording(sound) {
        if (playingSound) {
            await playingSound.stopAsync();
            setPlayingSound(null);
            setCurrentPlaybackPosition(0);
        }

        setPlayingSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isPlaying) {
                setCurrentPlaybackPosition(status.positionMillis);
            }
            if (status.didJustFinish) {
                setPlayingSound(null);
                setCurrentPlaybackPosition(0);
            }
        });

        await sound.replayAsync();
    }

    const onSliderValueChange = async(value) => {
        if (playingSound) {
            await playingSound.setPositionAsync(value);
            setCurrentPlaybackPosition(value);
        }
    };

    function getDurationFormatted(milliseconds) {
        const minutes = Math.floor(milliseconds / 1000 / 60);
        const seconds = Math.round((milliseconds / 1000) % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    function clearRecordings() {
        setRecordings([]);
    }

    return (
        <ImageBackground source={{uri: 'your-image-url-here'}} style={styles.container}>
            <Text style={styles.header}>Recorder</Text>

            <TextInput
                style={styles.searchBar}
                placeholder="Search "
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {recording && (
                <View style={styles.timerContainer}>
                    <Text style={styles.durationText}>
                        Recording: {getDurationFormatted(currentDuration)}
                    </Text>
                </View>
            )}

            {playingSound && (
                <View>
                    <Text style={styles.durationText}>
                        Playing: {getDurationFormatted(currentPlaybackPosition)} /{' '}
                        {getDurationFormatted(soundDuration)}
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={soundDuration}
                        value={currentPlaybackPosition}
                        onValueChange={onSliderValueChange}
                        thumbTintColor="#D32F2F" // Updated color
                        minimumTrackTintColor="#D32F2F" // Updated color
                        maximumTrackTintColor="#D32F2F" // Updated color
                    />
                </View>
            )}

            <View style={styles.controlsContainer}>
                {recording ? (
                    <>
                        <TouchableOpacity style={styles.controlButton} onPress={pauseRecording}>
                            <Icon name="pause-circle" size={50} color="#D32F2F" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton} onPress={stopRecording}>
                            <Icon name="square" size={50} color="#D32F2F" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton} onPress={discardRecording}>
                            <Icon name="trash-bin" size={50} color="#D32F2F" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <Animatable.View
                        animation="pulse"
                        iterationCount="infinite"
                        style={styles.recordButtonContainer}
                    >
                        <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                            <Icon name="mic-circle" size={60} color="#D32F2F" />
                        </TouchableOpacity>
                    </Animatable.View>
                )}
            </View>

            <FlatList
                data={filteredRecordings}
                renderItem={({ item, index }) => (
                    <View style={styles.recordingCard}>
                        <Text style={styles.recordingText}>
                            {item.name} | {item.duration}
                        </Text>
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => playRecording(item.sound)}
                            >
                                <Icon name="play-circle" size={30} color="#D32F2F" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => renameRecording(index)}
                            >
                                <Icon name="create" size={25} color="#FF9800" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => deleteRecording(index)}
                            >
                                <Icon name="trash" size={25} color="#2fd32f" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={
                    <Text style={styles.noRecordingsText}>
                        Click To Record
                    </Text>
                }
                style={styles.recordingsList}
            />

            {recordings.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={clearRecordings}>
                    <Text style={styles.clearButtonText}>RESTART</Text>
                </TouchableOpacity>
            )}
        </ImageBackground>
    );
}