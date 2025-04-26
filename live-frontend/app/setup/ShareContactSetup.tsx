// app/setup/ShareContactsSetup.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";

export default function ShareContactsSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  const handleAllow = () => {
    setProfile((prev) => ({ ...prev, shareContacts: true }));
    router.push("/setup/EmailSetup");
  };

  const handleSkip = () => {
    setProfile((prev) => ({ ...prev, shareContacts: false }));
    router.push("/setup/EmailSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover your friends already on the app</Text>
      <Text style={styles.subtitle}>
        so you can see where they're eating
      </Text>

      {/* bullet points, etc. */}
      <Text style={{ marginVertical: 8 }}>• See where friends are eating</Text>
      <Text style={{ marginVertical: 8 }}>• Plan group dinners</Text>
      <Text style={{ marginVertical: 8 }}>• Share recommendations</Text>

      <TouchableOpacity style={styles.allowBtn} onPress={handleAllow}>
        <Text style={{ color: "#fff" }}>Allow contacts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={{ color: "#999" }}>Not now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 24,
  },
  allowBtn: {
    backgroundColor: "#00494C",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 20,
  },
  skipBtn: { alignItems: "center" },
});
