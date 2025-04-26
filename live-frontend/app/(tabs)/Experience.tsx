import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter, router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

/** Mocks: 
 *  Real code would import your createExperience method & post to the backend.
 *  Also, a date/time picker library or a custom modal for the date. 
 */

export default function NewExperience() {
  const router = useRouter();
  const [activities, setActivities] = useState<Array<{
    name: string;
    address: string;
  }>>([]);

  const [title, setTitle] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // For demonstration, we store activity "titles" only. 
  // In real code, you'd store full ActivityRequest objects.

  const handleSaveExperience = async () => {
    if (!title) {
      Alert.alert("Missing title", "Please enter a title for your experience.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('startDate', dateTime ? dateTime.toISOString() : '');
      formData.append('visibility', 'PUBLIC');
      
      if (photoUri) {
        formData.append('photo', {
          uri: photoUri,
          type: 'image/jpeg', // adjust based on your image type
          name: 'photo.jpg'
        } as any);
      }

      if (activities.length > 0) {
        activities.forEach((activity, index) => {
          formData.append(`activities[${index}]`, JSON.stringify(activity));
        });
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/experiences`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create experience');

      const result = await response.json();
      router.back(); // Navigate back on success
    } catch (error) {
      Alert.alert('Error', 'Failed to create experience. Please try again.');
      console.error(error);
    }
  };

  const handlePickImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to select an image.');
      return;
    }

    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePickDate = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') {
      return;
    }
    if (selectedDate) {
      setDateTime(selectedDate);
    }
  };

  const handleAddActivity = () => {
    router.push({
      pathname: "/AddActivity"
    });
  };

  // Replace the existing useEffect
  const params = useLocalSearchParams();
  
  useEffect(() => {
    if (params.newActivity) {
      const activity = JSON.parse(params.newActivity as string);
      
      // Fetch address for the new activity
      getAddressFromCoords(activity.latitude, activity.longitude)
        .then(address => {
          setActivities(prev => [...prev, { ...activity, address }]);
        });
    }
  }, [params.newActivity]);

  // Add a function to fetch address from coordinates
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/google-places/reverse-geocode?lat=${lat}&lng=${lng}`
      );
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      return data.results[0]?.formatted_address || 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not found';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Event</Text>
        <TouchableOpacity onPress={handleSaveExperience}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Title */}
        <View style={styles.section}>
          <TextInput
            style={styles.titleInput}
            placeholder="Untitled Event"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Image */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.eventImage} />
            ) : (
              <Text style={styles.imageButtonText}>Choose an Image</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.dateButton} onPress={handlePickDate}>
            <Text style={styles.dateButtonText}>
              {dateTime ? dateTime.toLocaleString() : "Set a date..."}
            </Text>
          </TouchableOpacity>
          <Text style={styles.pollText}>
            Can't decide when? Poll your guests →
          </Text>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={dateTime || new Date()}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Activities */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.addActivityButton} onPress={handleAddActivity}>
            <Text style={styles.addActivityText}>Add Activity</Text>
          </TouchableOpacity>

          {/* Display actual activities */}
          {activities.map((activity, idx) => (
            <View key={idx} style={styles.activityItem}>
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityLocation}>
                {activity.address}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ============= STYLES =============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F0DA", // light green background
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#E5F0DA",
  },
  cancelText: {
    fontSize: 16,
    color: "blue",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Righteous_400Regular',
    color: '#000',
  },
  saveText: {
    fontSize: 16,
    color: "blue",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  titleInput: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
  },
  imageButton: {
    backgroundColor: "#d3eccb",
    padding: 20,
    alignItems: "center",
    borderRadius: 8,
  },
  imageButtonText: {
    color: "#444",
    fontSize: 16,
  },
  eventImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  dateButton: {
    backgroundColor: "#d3eccb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#444",
  },
  pollText: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 4,
  },
  addActivityButton: {
    backgroundColor: "#C8E3B0",
    borderRadius: 8,
    padding: 12,
  },
  addActivityText: {
    fontSize: 16,
    color: "#444",
  },
  activityItem: {
    backgroundColor: '#d3eccb',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  activityLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
