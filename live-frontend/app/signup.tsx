import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await SecureStore.setItemAsync('userToken', data.token);
        router.replace('/setupProfile');
      } else {
        alert(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Close Button (Back Navigation) */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Create an Account</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A0A0A0"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#A0A0A0"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Text style={styles.showPassword}>{secureText ? "👁️" : "🙈"}</Text>
        </TouchableOpacity>
      </View>

      {/* Password Requirement Text */}
      <Text style={styles.passwordNote}>Passwords must contain at least 8 characters.</Text>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Terms and Privacy Policy */}
      <Text style={styles.termsText}>
        By signing up you are agreeing to our <Text style={styles.linkText}>Terms of Service</Text>. View our <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>

      {/* OR Separator */}
      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.orLine} />
      </View>

      {/* Social Login Buttons */}
      <TouchableOpacity style={styles.socialButton}>
        <Text>🔴 Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Text>🔵 Continue with Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Text>⚫ Continue with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  closeButton: { alignSelf: 'flex-end', padding: 10 },
  closeText: { fontSize: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 10 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  passwordInput: { flex: 1, padding: 12 },
  showPassword: { padding: 10 },
  passwordNote: { fontSize: 12, color: '#555', marginBottom: 15 },
  signUpButton: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  signUpButtonText: { color: '#666', fontSize: 16 },
  termsText: { fontSize: 12, textAlign: 'center', color: '#777', marginBottom: 15 },
  linkText: { color: '#007BFF', textDecorationLine: 'underline' },
  orContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  orLine: { flex: 1, height: 1, backgroundColor: '#ccc' },
  orText: { marginHorizontal: 10, fontSize: 14, color: '#777' },
  socialButton: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
});
