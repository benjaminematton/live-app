// app/setup/PhotoSetup.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";
import * as SecureStore from 'expo-secure-store';

export default function PhotoSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  const handlePickPhoto = () => {
    Alert.alert("Pick Photo", "Would open an ImagePicker here.");
    // e.g. after user picks:
    // setProfile(prev => ({ ...prev, photoUri: result.uri }));
  };

  const createUser = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync('userToken')}`
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          email: profile.email,
          password: profile.password,
          locationName: profile.locationName,
          shareLocation: profile.shareLocation,
          notificationsEnabled: profile.notificationsEnabled,
          photoUri: profile.photoUri
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      // Navigate to feed screen
      router.replace("/(tabs)/feed");
    } catch (error) {
      Alert.alert("Error", "Failed to create user profile. Please try again.");
      console.error(error);
    }
  };

  const handleFinish = async (withPhoto: boolean) => {
    if (withPhoto) {
      handlePickPhoto();
      // Assuming photo picker will call createUser after successful upload
      await createUser();
    } else {
      await createUser();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Profile Photo</Text>

      <TouchableOpacity style={styles.photoButton} onPress={() => handleFinish(true)}>
        {profile.photoUri ? (
          <Image source={{ uri: profile.photoUri }} style={styles.photo} />
        ) : (
          <Text style={{ color: "#666" }}>Choose Photo</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipBtn} onPress={() => handleFinish(false)}>
        <Text style={{ color: "#999" }}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  photoButton: {
    backgroundColor: "#eee",
    width: 200,
    height: 200,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 6,
  },
  skipBtn: {
    backgroundColor: "gray",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
});
