// app/setup/LocationSetup.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";

export default function LocationSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  const handleNext = () => {
    router.push("/setup/ShareLocationSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where Are You Located?</Text>

      <TextInput
        style={styles.input}
        placeholder="City or Neighborhood"
        value={profile.locationName}
        onChangeText={(val) => setProfile((prev) => ({ ...prev, locationName: val }))}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={{ color: "#fff" }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={{ color: "#fff" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 24,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  backButton: {
    backgroundColor: "gray",
    borderRadius: 6,
    padding: 12,
  },
  nextButton: {
    backgroundColor: "blue",
    borderRadius: 6,
    padding: 12,
  },
});
