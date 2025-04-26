// app/setup/EmailSetup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";

export default function EmailSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const [localEmail, setLocalEmail] = useState(profile.email || "");

  const handleNext = () => {
    setProfile((prev) => ({ ...prev, email: localEmail }));
    router.push("/setup/PasswordSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your email?</Text>
      <Text style={styles.subtitle}>You can always change this later.</Text>

      <TextInput
        style={styles.input}
        placeholder="email@example.com"
        value={localEmail}
        onChangeText={setLocalEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

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
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 40,
  },
  continueBtn: {
    backgroundColor: "#9BBCC4",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
});
