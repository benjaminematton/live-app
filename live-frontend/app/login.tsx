import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store the JWT token from AuthResponse
        await SecureStore.setItemAsync('userToken', data.token);
        router.replace('/(tabs)');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Log in to Live</Text>

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

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

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
    loginButton: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    loginButtonText: { color: '#666', fontSize: 16 },
    termsText: { fontSize: 12, textAlign: 'center', color: '#777', marginBottom: 15 },
    linkText: { color: '#007BFF', textDecorationLine: 'underline' },
    orContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    orLine: { flex: 1, height: 1, backgroundColor: '#ccc' },
    orText: { marginHorizontal: 10, fontSize: 14, color: '#777' },
    socialButton: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    forgotText: { color: '#007BFF', textAlign: 'center', marginBottom: 15 },
  });
