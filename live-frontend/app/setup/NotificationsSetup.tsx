// app/setup/NotificationsSetup.tsx
import React from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";

export default function NotificationsSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  const handleToggle = (value: boolean) => {
    setProfile((prev) => ({ ...prev, notificationsEnabled: value }));
  };

  const handleNext = async () => {
    router.push("/setup/PhotoSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Notifications?</Text>

      <View style={styles.switchRow}>
        <Text>Notifications</Text>
        <Switch
          value={profile.notificationsEnabled}
          onValueChange={handleToggle}
        />
      </View>

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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
