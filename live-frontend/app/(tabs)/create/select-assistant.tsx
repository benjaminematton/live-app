import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExperienceCreation } from '@/app/contexts/ExperienceCreationContext';
import { ActivityRequest, ActivityResponse, ChatMsg} from '@/app/types/types';
import { useAssistant} from '@/hooks/aiAssistant';

export default function SelectAssistant() {
  const router = useRouter();

  const {msgs, sendInitial, refine, loading} = useAssistant();
  
  const [input, setInput] = useState('');
  const [activities, setActivities] = useState<ActivityRequest[]>([]);
  const listRef = useRef<FlatList>(null);

  const { experienceData, setExperienceData } = useExperienceCreation();

  useEffect(() => { listRef.current?.scrollToEnd({ animated: true }); }, [msgs]);

  useEffect(() => {
    const last = [...msgs].reverse().find(m => m.role === 'assistant');
    if (last) setActivities(last.activities as ActivityRequest[]);
  }, [msgs]);

  const sendPrompt = async () => {
    if (!input.trim() || loading) return;

    if (msgs.length === 0) {
      await sendInitial(input.trim());
    } else {
      await refine(input.trim());
    }
    setInput('');
  };

  const handleContinue = () => {
    if (activities.length > 0) {
      setExperienceData({
        ...experienceData,
        activities: activities as ActivityRequest[],
      });
    }
    router.push('/create/select-activities');
  };

  const UserBubble = ({ text }: { text: string }) => (
    <View style={{ alignSelf: 'flex-end', backgroundColor: '#DCF8C6',
                   margin: 6, padding: 10, borderRadius: 8, maxWidth: '80%' }}>
      <Text>{text}</Text>
    </View>
  );
  
  const AssistantCard = ({ activities }: { activities: ActivityResponse[] }) => (
    <View style={{ alignSelf: 'flex-start', backgroundColor: '#F1F1F1',
                   margin: 6, padding: 10, borderRadius: 8, width: '90%' }}>
      {activities.map(a => (
        <View key={a.id} style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: '600' }}>{a.title}</Text>
          <Text>{a.location}</Text>
          <Text>{new Date(a.startTime).toLocaleString()}</Text>
        </View>
      ))}
    </View>
  );
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* ---------- Header + progress + copy ---------- */}
          <View style={styles.top}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>Create Plan</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>

            <View style={styles.content}>
              <Text style={styles.heading}>Assistant Planner</Text>
              <Text style={styles.subheading}>Describe your plan</Text>

              {/* ---------- Chat list ---------- */}
              <FlatList
                ref={listRef}
                data={msgs}
                keyExtractor={m => m.id}
                renderItem={({ item }) =>
                  item.role === 'user'
                    ? <UserBubble text={item.text!} />
                    : <AssistantCard activities={item.activities!} />
                }
              />

              {/* ---------- Input row ---------- */}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Describe or refine your plan…"
                  editable={!loading}
                  multiline={true}
                />
                <TouchableOpacity onPress={sendPrompt} disabled={loading}>
                  <Text style={styles.send}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottom}>
          {/* ---------- Continue button ---------- */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: '#3a7bd5'},
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: 24,
  },
  top: { flex: 1 },
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
  title: { fontSize: 16, fontWeight: '600' },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  progressDot: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0eaff',
  },
  progressDotActive: { backgroundColor: '#5296f3' },
  content: { marginTop: 40 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subheading: { fontSize: 16, color: '#666', marginBottom: 20 },

  /* chat bubbles */
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    margin: 6,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  assistantCard: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F1F1',
    margin: 6,
    padding: 10,
    borderRadius: 8,
    width: '90%',
  },

  /* input bar */
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  textInput: { 
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    height: 100,
    backgroundColor: '#f0f0f0', 
    color: '#000',
    textAlignVertical: 'top',
    textAlign: 'left'
  },
  send: { marginLeft: 12, color: '#007AFF' },

  /* continue button */
  button: {
    alignSelf: 'stretch',
    marginTop: 'auto',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: '600' },

  error: { color: '#d00', marginLeft: 12, marginTop: 8 },
});
