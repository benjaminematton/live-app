// app/setup/UsernameSetup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";

export default function UsernameSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const [localUsername, setLocalUsername] = useState(profile.username || "");

  const handleNext = () => {
    // store in context
    setProfile((prev) => ({ ...prev, username: localUsername }));
    // go next
    router.push("/setup/LocationSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your username</Text>
      <Text style={styles.subtitle}>How do you want to be known on Beli?</Text>

      <View style={styles.usernameRow}>
        <Text style={{ color: "#999", marginRight: 4 }}>@</Text>
        <TextInput
          style={styles.input}
          placeholder="username"
          value={localUsername}
          onChangeText={setLocalUsername}
        />
      </View>
      <Text style={styles.hint}>You can always change this later.</Text>

      <TouchableOpacity style={styles.continueBtn} onPress={handleNext}>
        <Text style={{ color: "#fff" }}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  hint: {
    color: "#999",
    marginBottom: 40,
  },
  continueBtn: {
    backgroundColor: "#9BBCC4", // example teal color
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
});
