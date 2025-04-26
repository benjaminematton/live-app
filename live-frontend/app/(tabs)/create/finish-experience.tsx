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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExperienceCreation } from '@/app/contexts/ExperienceCreationContext';
import { createExperience, shareExperience } from '@/app/api/experience';
import { UserResponse, ShareExperienceRequest } from '@/app/types/types';
import { getFriends } from '@/app/api/user';

export default function FinishExperience() {
  const router = useRouter();

  const { experienceData, setExperienceData } = useExperienceCreation();
  const visibilityOptions = ['PUBLIC', 'PRIVATE', 'FRIENDS'] as const;
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE' | 'FRIENDS'>('PRIVATE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAllFriends, setSelectAllFriends] = useState(false);
  const [friendResults, setFriendResults] = useState<UserResponse[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<UserResponse[]>([]);

  const toggleSelect = (friend: UserResponse) => {
    if (selectedFriends.some(f => f.id === friend.id)) {
      setSelectedFriends(prev => prev.filter(f => f.id !== friend.id));
    } else {
      setSelectedFriends(prev => [...prev, friend]);
    }
  };

  useEffect(() => {
    if (searchQuery.length >= 2) { 
      getFriends(searchQuery).then(setFriendResults);
    } else {
      setFriendResults([]);
    }
  }, [searchQuery]);

  const toggleSelectAll = () => {
    setSelectAllFriends(!selectAllFriends);
    setSelectedFriends(friendResults);
  };

  const handleContinue = async () => {
    setExperienceData({
        ...experienceData,
        visibility: visibility as 'PUBLIC' | 'PRIVATE' | 'FRIENDS',
    });
    const experience = await createExperience(experienceData);
    if (selectedFriends.length > 0) {
        const selectedFriendsIds = selectedFriends.map(friend => friend.id);
        const shareExperienceRequest: ShareExperienceRequest = {
            experienceId: experience.id,
            sharedWithUserIds: selectedFriendsIds,
        };
        await shareExperience(shareExperienceRequest);
    }
    router.push('/feed');
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
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.heading}>Finalize Plan</Text>
            <Text style={styles.subheading}>Finish up your plan by selecting a visibility and inviting friends to join along!</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                <Text>Share the visibility of your plan with other on the app:</Text>
                {visibilityOptions.map((v) => (
                    <TouchableOpacity
                    key={v}
                    onPress={() => setVisibility(v)}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: visibility === v ? '#007AFF' : '#CCC',
                        backgroundColor: visibility === v ? '#007AFF' : '#FFF',
                    }}
                    >
                    <Text style={{ color: visibility === v ? '#FFF' : '#000' }}>{v}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <Text>Invite All Friends</Text>
                <Switch
                    value={selectAllFriends}
                    onValueChange={toggleSelectAll}
                />
                </View>

                <TextInput
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {friendResults.map(friend => (
                    <TouchableOpacity key={friend.id} onPress={() => toggleSelect(friend)}>
                        <Text>{friend.fullName} ({friend.username})</Text>
                    </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>

        {/* Bottom: Continue Button */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: '#3a7bd5' },
            ]}
            onPress={handleContinue}>
            <Text style={styles.buttonText}>Create Plan</Text>
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
