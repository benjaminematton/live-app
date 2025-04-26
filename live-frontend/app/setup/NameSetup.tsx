// app/setup/NameSetup.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "./ProfileContext";

export default function NameSetup() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  const handleNext = () => {
    setProfile((prev) => ({ 
      ...prev, 
      firstName: profile.firstName,
      lastName: profile.lastName 
    }));
    router.push("/setup/UsernameSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's Your Name?</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={profile.firstName}
        onChangeText={(val) =>
          setProfile((prev) => ({ ...prev, firstName: val }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={profile.lastName}
        onChangeText={(val) =>
          setProfile((prev) => ({ ...prev, lastName: val }))
        }
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={{ color: "#fff" }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  nextButton: {
    backgroundColor: "blue",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
});
