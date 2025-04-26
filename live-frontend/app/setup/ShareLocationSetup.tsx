// app/setup/ShareLocationSetup.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";

export default function ShareLocationSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  const handleAllow = () => {
    // we can set shareLocation = true
    setProfile((prev) => ({ ...prev, shareLocation: true }));
    router.push("/setup/NotificationsSetup");
  };

  const handleSkip = () => {
    // shareLocation = false
    setProfile((prev) => ({ ...prev, shareLocation: false }));
    router.push("/setup/NotificationsSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Use Beli anywhere</Text>
      <Text style={styles.subtitle}>
        Beli needs location permission in order to provide maps and recommendations
      </Text>

      {/* Big button for "Allow location" */}
      <TouchableOpacity style={styles.allowBtn} onPress={handleAllow}>
        <Text style={{ color: "#fff" }}>Allow location</Text>
      </TouchableOpacity>

      {/* "Not now" */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={{ color: "#999" }}>Not now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  subtitle: { fontSize: 15, color: "#555", marginBottom: 40 },
  allowBtn: {
    backgroundColor: "#00494C",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  skipBtn: {
    alignItems: "center",
  },
});
