// app/setup/PasswordSetup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";

export default function PasswordSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const [localPassword, setLocalPassword] = useState(profile.password || "");

  const handleNext = () => {
    setProfile((prev) => ({ ...prev, password: localPassword }));
    router.push("/setup/NameSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Password</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        secureTextEntry
        value={localPassword}
        onChangeText={setLocalPassword}
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
    marginBottom: 16,
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
