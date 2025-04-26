import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useExperienceCreation } from '@/app/contexts/ExperienceCreationContext';
import { ActivityRequest, ActivityDraft } from '@/app/types/types';
import { v4 as uuidv4 } from 'uuid';

export default function CreateActivities() {
    const router = useRouter();
  
    const { experienceData, setExperienceData } = useExperienceCreation();
    
    const [activityMap, setActivityMap] = useState(new Map<string, ActivityDraft>());

    const upsertActivity = (a: ActivityDraft) =>
        setActivityMap(prev => {
          const newMap = new Map(prev);
          newMap.set(a.id, a);
          return newMap;
    });

    const handleContinue = () => {
        const activities: ActivityRequest[] = Array.from(activityMap.values()).map(draft => ({
          title: draft.title,
          description: draft.description,
          location: draft.location,
          startTime: draft.startTime ?? new Date(), // ensure string format
        }));
      
        setExperienceData({
            ...experienceData,
            activities: activities as ActivityRequest[],
        });
      
        router.push('/create/finish-experience');
    };

    interface Props {
        onAdd: (a: ActivityDraft) => void;     // parent callback
        defaultValue?: ActivityDraft;          // optional initial data (edit flow)
      }
      
    const ActivityInputCard = ({ onAdd, defaultValue }: Props) => {
        const [open, setOpen] = useState(!defaultValue);         // show form first if no default
        const [activity, setActivity] = useState<ActivityDraft>(
          defaultValue ? { ...defaultValue, id: uuidv4() } : { id: uuidv4(), title: '', description: '', location: '', startTime: new Date() }       
    );

    const handleSubmit = () => {
        upsertActivity(activity);
        setOpen(false);                    // collapse into the title button
    };
    
    const reopen = () => setOpen(true);
    
    return open ? (
        <View style={styles.form}>
        <TextInput
            style={styles.activityInput}
            placeholder="Activity Title"
            value={activity.title}
            onChangeText={title => setActivity({ ...activity, title })}
        />
        <TextInput
            style={styles.activityInput}
            placeholder="Description (optional)"
            value={activity.description}
            onChangeText={description => setActivity({ ...activity, description })}
        />
        <TextInput
            style={styles.activityInput}
            placeholder="Location"
            value={activity.location}
            onChangeText={location => setActivity({ ...activity, location })}
        />
        <DateTimePicker
            value={activity.startTime ?? new Date()}
            mode="datetime"
            minuteInterval={15}
            display="default"
            onChange={(_, selectedDate) =>
            selectedDate && setActivity({ ...activity, startTime: selectedDate })
            }
        />
    
        <TouchableOpacity
            style={[
            styles.activitySubmitButton,
            !(activity.title && activity.location) && { opacity: 0.4 },
            ]}
            onPress={handleSubmit}
            disabled={!(activity.title && activity.location)}
        >
            <Text style={styles.activityAddButtonText}>Submit</Text>
        </TouchableOpacity>
        </View>
    ) : (
        /* ================== COLLAPSED MODE ================== */
        <TouchableOpacity style={styles.activityCollapsed} onPress={reopen}>
        <Text style={styles.activityCollapsedText}>{activity.title}</Text>
        </TouchableOpacity>
    );
    }

    

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
                    <View style={styles.progressDot} />
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={styles.progressDot} />
                </View>

                {/* Content */}
                <ScrollView style={{ flex: 1 }}>
                    <Text style={styles.heading}>Add Activities</Text>
                    <Text style={styles.subheading}>Create your activity list</Text>

                {/* collapsed or editable cards */}
                {Array.from(activityMap.values()).map((a, idx) => (
                    <ActivityInputCard
                        key={idx}
                        defaultValue={a}
                        onAdd={updated => upsertActivity(updated)}
                    />
                    ))}

                    <ActivityInputCard onAdd={a => upsertActivity(a)} />
                </ScrollView>
            </View>

            {/* Bottom: Continue Button */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={[
                    styles.button,
                    { backgroundColor: activityMap.size > 0 ? '#3a7bd5' : '#e0eaff' },
                    ]}
                    disabled={activityMap.size === 0}
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
    form: {
        marginTop: 20,
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0eaff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#5296f3',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    activityList: {
        marginTop: 20,
        maxHeight: 200,
    },
    activityItem: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#e0eaff',
        borderRadius: 8,
        marginBottom: 8,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    activityLocation: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
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
    activityForm: {
        marginVertical: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        gap: 8,
      },
      activityInput: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 6,
        padding: 8,
      },
      activitySubmitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center',
      },
      activityAddButtonText: { color: '#fff', fontWeight: '600' },
    
      activityCollapsed: {
        backgroundColor: '#F1F1F1',
        borderRadius: 8,
        padding: 12,
        marginVertical: 12,
      },
      activityCollapsedText: { fontWeight: '600' },
    });