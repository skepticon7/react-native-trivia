import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform, ActivityIndicator,
} from 'react-native';
import { History, User, Lock } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTodaysQuizHistoryFromFirebase } from '../services/firebaseService';

const DAILY_LIMIT = 10;

const TOPICS = [
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'history', name: 'History', emoji: '📚' },
  { id: 'geography', name: 'Geography', emoji: '🌍' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'movies', name: 'Movies', emoji: '🎬' },
  { id: 'technology', name: 'Technology', emoji: '💻' },
];

// ---------------- LOCK CARD ----------------
const LockCard = () => (
    <View style={styles.lockWrapper}>
      <View style={styles.lockCard}>
        <Lock size={28} color="#09090b" />
        <Text style={styles.lockTitle}>Daily limit reached</Text>
        <Text style={styles.lockText}>
          You’ve completed all quizzes today.
          Come back tomorrow 🎉
        </Text>
      </View>
    </View>
);

const HomeScreen = ({ navigation }) => {
  const [dailyProgress, setDailyProgress] = useState(0);
  const [loading , setLoading] = useState(true);

  const isLocked = dailyProgress >= DAILY_LIMIT;
  const progressPercent = Math.min(
      (dailyProgress / DAILY_LIMIT) * 100,
      100
  );

  const loadProgress = async () => {
    try {
      const todayQuizzes = await getTodaysQuizHistoryFromFirebase();
      setDailyProgress(todayQuizzes.length);
    } catch (error) {
      console.error('Error loading progress from Firebase', error);
      setDailyProgress(0);
    }finally {
      setLoading(false);
    }
  };

  useFocusEffect(
      useCallback(() => {
        loadProgress();
      }, [])
  );

  // ---------------- HEADER ----------------
  const renderHeader = () => (
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <Text style={styles.appTitle}>Trivia</Text>

          <View style={styles.iconGroup}>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <History size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <User size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>


        {!isLocked && (
            <>
              <View style={styles.introSection}>
                <Text style={styles.heading}>Choose a topic</Text>
                <Text style={styles.subHeading}>Pick your category for today</Text>
              </View>
              <View style={styles.progressCard}>
                <View style={styles.progressTextRow}>
                  <Text style={styles.progressLabel}>Daily progress</Text>
                  <Text style={styles.progressValue}>
                    {dailyProgress}/{DAILY_LIMIT}
                  </Text>
                </View>

                <View style={styles.progressBarBackground}>
                  <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progressPercent}%` },
                      ]}
                  />
                </View>
              </View>
            </>

        )}




      </View>
  );

  // ---------------- TOPIC CARD ----------------
  const renderItem = ({ item }) => (
      <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Quiz', { topicId: item.id })}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </TouchableOpacity>
  );

  if(loading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading Profile...</Text>
        </View>
    );
  }

  // ---------------- RENDER ----------------
  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <FlatList
            data={isLocked ? [] : TOPICS}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={isLocked ? <LockCard /> : null}
            showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ---------- LAYOUT ----------
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContent: {
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },

  // ---------- HEADER ----------
  headerContainer: {
    marginBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#09090b',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 15,
  },

  // ---------- INTRO ----------
  introSection: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#09090b',
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 14,
    color: '#71717a',
  },

  // ---------- PROGRESS ----------
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#09090b',
  },
  progressValue: {
    fontSize: 14,
    color: '#71717a',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f4f4f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#09090b',
    borderRadius: 4,
  },

  // ---------- GRID ----------
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#09090b',
  },

  // ---------- LOCK ----------
  lockWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  lockCard: {
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  lockTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#09090b',
  },
  lockText: {
    marginTop: 6,
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 20,
  },
});


export default HomeScreen;
