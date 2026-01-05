import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { History, User } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native'; // Optional: Refreshes data when you come back

const TOPICS = [
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'history', name: 'History', emoji: '📚' },
  { id: 'geography', name: 'Geography', emoji: '🌍' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'movies', name: 'Movies', emoji: '🎬' },
  { id: 'technology', name: 'Technology', emoji: '💻' },
];

const HomeScreen = ({ navigation }) => {
  const [dailyProgress, setDailyProgress] = useState(0);

  const loadProgress = async () => {
    try {
      const today = new Date().toDateString();
      const lastQuizDate = await AsyncStorage.getItem('lastQuizDate');
      const quizzesToday = await AsyncStorage.getItem('quizzesToday');

      if (lastQuizDate === today && quizzesToday) {
        setDailyProgress(parseInt(quizzesToday, 10));
      } else if (lastQuizDate !== today) {
        // New day, reset progress
        await AsyncStorage.setItem('quizzesToday', '0');
        await AsyncStorage.setItem('lastQuizDate', today);
        setDailyProgress(0);
      }
    } catch (error) {
      console.error('Error loading progress', error);
    }
  };

  // Load data on mount and whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  // --- COMPONENT: Header & Progress Section ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>Trivia</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => navigation.navigate('History')}
          >
            <History size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => navigation.navigate('Profile')}
          >
            <User size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Intro Text */}
      <View style={styles.introSection}>
        <Text style={styles.heading}>Choose a topic</Text>
        <Text style={styles.subHeading}>Pick your category for today</Text>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>Daily progress</Text>
          <Text style={styles.progressValue}>{dailyProgress}/10</Text>
        </View>
        {/* Custom Progress Bar */}
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${Math.min(dailyProgress * 10, 100)}%` } 
            ]} 
          />
        </View>
      </View>
    </View>
  );

  // --- COMPONENT: Grid Item ---
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Quiz', { topicId: item.id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <FlatList
        data={TOPICS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        
        // Grid Configuration
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        
        // Header
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // "bg-background"
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContent: {
    padding: 24, // "p-6"
    paddingBottom: 40,
  },
  
  // --- HEADER STYLES ---
  headerContainer: {
    marginBottom: 32, // "space-y-8" equivalent
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // "border-border"
    paddingBottom: 16,
    marginHorizontal: -24, // Extend border to edges
    paddingHorizontal: 24,
  },
  appTitle: {
    fontSize: 20, // "text-xl"
    fontWeight: '700', // "font-bold"
    color: '#09090b',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 8, // "gap-2"
  },
  iconBtn: {
    padding: 8,
  },

  // --- INTRO STYLES ---
  introSection: {
    marginBottom: 16, // "space-y-4"
  },
  heading: {
    fontSize: 24, // "text-2xl"
    fontWeight: '700', // "font-bold"
    color: '#09090b',
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 14, // "text-sm"
    color: '#71717a', // "text-muted-foreground"
  },

  // --- PROGRESS CARD STYLES ---
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 8, // "rounded-lg" (default Card radius)
    padding: 16, // "p-4"
    borderWidth: 1,
    borderColor: '#e5e7eb', // "border-border"
    // Shadow (Subtle like shadcn)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14, // "text-sm"
    fontWeight: '500', // "font-medium"
    color: '#09090b',
  },
  progressValue: {
    fontSize: 14, // "text-sm"
    color: '#71717a', // "text-muted-foreground"
  },
  progressBarBackground: {
    height: 8, // "h-2"
    backgroundColor: '#f4f4f5', // "bg-secondary" (light gray)
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#09090b', // "bg-primary" (black in shadcn default theme)
    borderRadius: 4,
  },

  // --- GRID STYLES ---
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16, // "gap-4"
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8, // "rounded-lg"
    padding: 24, // "p-6"
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // Hover/Press effect handled by opacity, but adding shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    gap: 12, // "gap-3"
  },
  emoji: {
    fontSize: 36, // "text-4xl"
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500', // "font-medium"
    color: '#09090b',
  },
});

export default HomeScreen;