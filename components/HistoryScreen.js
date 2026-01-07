import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
// Make sure this path matches your project structure
import { getQuizHistoryFromFirebase } from "../services/firebaseService";
import { ArrowLeft } from 'lucide-react-native';

const TOPIC_EMOJIS = {
  science: '🔬',
  history: '📚',
  geography: '🌍',
  sports: '⚽',
  movies: '🎬',
  technology: '💻',
};

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await getQuizHistoryFromFirebase();
      // Ensure we always work with an array
      setHistory(Array.isArray(storedHistory) ? storedHistory : []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const renderItem = ({ item }) => {
    const percentage = Math.round((item.score / 10) * 100);
    // Safe emoji lookup
    const topicKey = item.topic ? item.topic.toLowerCase() : 'default';
    const emoji = TOPIC_EMOJIS[topicKey] || '📝';

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* Left Side: Icon + Topic info */}
          <View style={styles.leftSection}>
            <Text style={styles.emoji}>{emoji}</Text>
            <View>
              {/* Ensure topic is treated as a string */}
              <Text style={styles.topicTitle}>{String(item.topic)}</Text>
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>
          </View>

          {/* Right Side: Score */}
          <View style={styles.rightSection}>
            {/* FIX: Explicitly convert numbers to strings inside Text components */}
            <Text style={styles.scoreText}>{String(item.score)}/10</Text>
            <Text style={styles.percentageText}>{String(percentage)}%</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading History...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        {/* Spacer */}
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Your quiz history</Text>
          <Text style={styles.pageSubtitle}>Track your progress over time</Text>
        </View>

        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No quiz history yet</Text>
              <Text style={styles.emptySubText}>Start playing to see your history</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: {
    marginTop: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#09090b' },
  
  content: { flex: 1 },
  titleContainer: { padding: 24, paddingBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#09090b', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#71717a' },

  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  
  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  emoji: { fontSize: 32 },
  topicTitle: { fontSize: 16, fontWeight: '600', color: '#09090b', textTransform: 'capitalize' },
  dateText: { fontSize: 13, color: '#71717a', marginTop: 2 },
  
  rightSection: { alignItems: 'flex-end' },
  scoreText: { fontSize: 18, fontWeight: '700', color: '#09090b' },
  percentageText: { fontSize: 13, color: '#71717a' },

  // Empty State
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 20,
  },
  emptyText: { color: '#71717a', fontSize: 16, fontWeight: '500' },
  emptySubText: { color: '#a1a1aa', fontSize: 14, marginTop: 4 },
});

export default HistoryScreen;