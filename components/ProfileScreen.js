import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getQuizHistoryFromFirebase } from "../services/firebaseService";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const getStats = async () => {
    try {
      const historyData = await getQuizHistoryFromFirebase();
      setHistory(historyData || []); // Ensure it is an array
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      } else {
        console.error("Logout function is undefined in Context!");
      }
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  const getInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
      return names[0][0].toUpperCase();
    }
    return user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  const getSuccessRate = () => {
    if (!history || history.length === 0) return 0;
    const totalScore = history.reduce((acc, h) => acc + (h.score || 0), 0);
    const maxPossibleScore = history.length * 10;
    return Math.round((totalScore / maxPossibleScore) * 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* User Stats Card */}
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.username || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getSuccessRate()}%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.actionBtnText}>Account Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionBtn, styles.logoutBtn]} 
            onPress={handleLogout}
          >
            <Text style={[styles.actionBtnText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>

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
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#09090b',
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#09090b',
  },
  userEmail: {
    fontSize: 14,
    color: '#71717a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#09090b',
  },
  statLabel: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },
  actionsContainer: {
    gap: 12,
  },
  actionBtn: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#09090b',
  },
  logoutBtn: {
    borderColor: '#e5e7eb',
  },
  logoutText: {
    color: '#ef4444',
  },
});

export default ProfileScreen;