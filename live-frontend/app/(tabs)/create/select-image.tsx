import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useExperienceCreation } from '@/app/contexts/ExperienceCreationContext';

export default function SelectImage() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const isValid = imageUri !== null;
  const { experienceData, setExperienceData } = useExperienceCreation();
  const handleContinue = () => {
    if (isValid) {
        setExperienceData({
            ...experienceData,
            photo: imageUri,
          });
      router.push('/create/select-date');
    }
  };
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to grant photo access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
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
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Select an Image</Text>
            <Text style={styles.subheading}>Tap to pick an image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <Text style={styles.imageText}>Tap to pick an image</Text>
              )}
            </TouchableOpacity>
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
  imagePicker: {
    backgroundColor: '#f0f0f0',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#666',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
