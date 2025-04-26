import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExperienceCreation } from '@/app/contexts/ExperienceCreationContext';
import { useHideTabBar } from '@/hooks/hideTabBar';

export default function CreateExperience() {
  useHideTabBar();

  const router = useRouter();
  const [planName, setPlanName] = useState('');
  const isValid = planName.length > 0 && planName.length <= 60;
  const { setExperienceData } = useExperienceCreation();
  const handleContinue = () => {
    setExperienceData({ title: planName });
    router.push('/create/select-image');
  };    

  
return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0} // adjust if needed
    >
      <View style={styles.container}>
        {/* Main Content */}
        <View style={styles.top}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Plan</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Plan Name</Text>
            <Text style={styles.subheading}>Enter plan name to get started</Text>

            <TextInput
              placeholder="Enter Name"
              value={planName}
              onChangeText={setPlanName}
              maxLength={60}
              placeholderTextColor="#aaa"
              style={styles.input}
            />

            <View style={styles.infoRow}>
            <Ionicons
              name={isValid ? 'checkmark-circle' : 'information-circle-outline'}
              size={14}
              color={isValid ? 'green' : '#aaa'}
            />
              <Text style={styles.infoText}> No more than 60 characters</Text>
            </View>
          </View>
        </View>

        {/* Bottom: Continue Button */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isValid ? '#3a7bd5' : '#e0eaff' },
            ]}
            disabled={!isValid}
            onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  top: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  progressDot: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0eaff',
  },
  progressDotActive: {
    backgroundColor: '#5296f3',
  },
  content: {
    marginTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f6f7',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#aaa',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
