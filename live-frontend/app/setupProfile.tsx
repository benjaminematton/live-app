import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as SecureStore from 'expo-secure-store';

// Use Expo's built-in environment variable support
// We no longer need GOOGLE_MAPS_API_KEY if the backend is calling Google
const API_BASE_URL = process.env.API_URL;

export default function SetupProfileScreen() {
  const router = useRouter();

  // Basic profile info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  // Location state
  const [locationName, setLocationName] = useState(""); // e.g., "New York"
  const [shareLocation, setShareLocation] = useState(false);

  // Notifications state
  const [enableNotifications, setEnableNotifications] = useState(false);

  // 🔹 When user toggles location sharing
  const handleToggleLocation = async (value: boolean) => {
    setShareLocation(value);
    if (value) {
      // 1) Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Denied", "We cannot access your location unless you grant permission.");
        setShareLocation(false);
        return;
      }

      // 2) Get user's current location
      const loc = await Location.getCurrentPositionAsync({});

      // 3) Reverse geocode via your BACKEND
      fetchCityFromCoords(loc.coords.latitude, loc.coords.longitude);
    }
  };

  // 🔹 Call your BACKEND instead of Google's endpoint directly
  const fetchCityFromCoords = async (latitude: number, longitude: number) => {
    try {
      // If your backend is protected, include the auth token
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        Alert.alert("Error", "You are not authenticated. Please sign in again.");
        return;
      }

      // e.g. GET /api/google-places/reverse-geocode?lat=X&lng=Y
      const url = `${API_BASE_URL}/api/google-places/reverse-geocode?lat=${latitude}&lng=${longitude}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`, // If your backend requires auth
        },
      });
      const data = await response.json();

      // data.results[0].formatted_address, etc. depends on your backend's response shape
      if (data.status === "OK" && data.results.length > 0) {
        const city = data.results[0].address_components.find((component: any) =>
          component.types.includes("locality")
        )?.long_name;
        setLocationName(city || "Unknown Location");
      }
    } catch (error) {
      console.error("Error fetching city from backend:", error);
    }
  };

  // 🔹 If user toggles notifications
  const handleToggleNotifications = async (value: boolean) => {
    setEnableNotifications(value);
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Notifications Denied",
          "We cannot send notifications unless permission is granted."
        );
        setEnableNotifications(false);
      }
    }
  };

  // 🔹 Called when user taps "Complete"
  const handleCompleteSetup = async () => {
    try {
      // Retrieve token for an authenticated request
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        Alert.alert("Error", "You are not authenticated. Please sign up again.");
        return;
      }

      const userProfileRequest = {
        username,
        firstName,
        lastName,
        shareLocation,
        getNotifications: enableNotifications,
        location: locationName
      };

      // PUT to your user profile endpoint
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userProfileRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Navigate to home screen on success
      router.push("/(tabs)/feed");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Set Up Your Profile</Text>

      {/* FIRST NAME */}
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
      />

      {/* LAST NAME */}
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />

      {/* USERNAME */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Choose a username"
      />

      {/* LOCATION */}
      <Text style={styles.label}>Location</Text>
      {shareLocation ? (
        <Text style={styles.locationText}>
          {locationName || "Detecting location..."}
        </Text>
      ) : (
        // STILL using GooglePlacesAutocomplete if user wants to manually search a city
        <GooglePlacesAutocomplete
          placeholder="Search your city"
          query={{
            key: '',
            language: "en",
            types: "(cities)",
          }}
          onPress={(data, details = null) => {
            setLocationName(data.description || "");
          }}
          fetchDetails
          styles={{
            textInput: styles.placesInput,
            container: { 
              marginBottom: 0,
              flex: 0  // Add this to prevent container from expanding
            },
            listView: {
              position: 'absolute',  // Position the suggestions list
              top: 45,              // Adjust based on your input height
              left: 0,
              right: 0,
              backgroundColor: 'white',
              zIndex: 1000,
            }
          }}
        />
      )}

      {/* SHARE LOCATION SWITCH */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Use my current location</Text>
        <Switch value={shareLocation} onValueChange={handleToggleLocation} />
      </View>

      {/* NOTIFICATIONS SWITCH */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Enable notifications</Text>
        <Switch value={enableNotifications} onValueChange={handleToggleNotifications} />
      </View>

      {/* COMPLETE BUTTON */}
      <TouchableOpacity style={styles.completeButton} onPress={handleCompleteSetup}>
        <Text style={styles.completeButtonText}>Complete</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

// ================== STYLES ==================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  placesInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: "#555",
  },
  completeButton: {
    backgroundColor: "#f15a24",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
