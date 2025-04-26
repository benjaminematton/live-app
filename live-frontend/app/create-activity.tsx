import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CreateActivity() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const newActivity = {
      name: activityName,
      description,
      latitude: params.latitude,
      longitude: params.longitude,
      timestamp: new Date().toISOString(),
      type: 'custom',
    };

    router.navigate({
      pathname: "../",
      params: {
        newActivity: JSON.stringify(newActivity)
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Activity Name"
        value={activityName}
        onChangeText={setActivityName}
        placeholderTextColor="#999"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor="#999"
      />
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Create Activity</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#111',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#f15a24',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 