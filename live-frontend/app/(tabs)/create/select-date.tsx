import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useExperienceCreation } from '@/app/contexts/ExperienceCreationContext';

export default function SelectDate() {
  const router = useRouter();
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const isValid = startDateTime !== null;
  const { experienceData, setExperienceData } = useExperienceCreation();

  const handleContinue = () => {
    if (isValid) {
        setExperienceData({
            ...experienceData,
            startDate: startDateTime,
            endDate: endDateTime ?? undefined,
          });
      router.push('/create/select-assistant');
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
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Select an Date & Time</Text>
            <Text style={styles.subheading}>Tap to pick an date & time</Text>
            <View style={{ 
                marginBottom: 20,
            }}>
                <Text style={[styles.subTitle, { marginBottom: 8, backgroundColor: '#e0eaff', padding: 8, marginHorizontal: -24 }]}>Start</Text>
                <View style={{ alignItems: 'center' }}>
                    <DateTimePicker
                        value={startDateTime ?? new Date()}
                        mode="datetime"
                        minuteInterval={15}
                        display={'default'}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) setStartDateTime(selectedDate);
                        }}
                    /> 
                </View>
            </View>
            <View>
                <Text style={[styles.subTitle, { marginBottom: 8, backgroundColor: '#e0eaff', padding: 8, marginHorizontal: -24 }]}>End</Text>
                <View style={{ alignItems: 'center' }}>
                    <DateTimePicker
                        value={endDateTime ?? new Date()}
                        mode="datetime"
                        minuteInterval={15}
                        display={'default'}
                        minimumDate={startDateTime ?? undefined}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) setEndDateTime(selectedDate);
                        }}
                    /> 
                </View>
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
  subTitle: {
    fontSize: 16,
    color: '#666',
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
