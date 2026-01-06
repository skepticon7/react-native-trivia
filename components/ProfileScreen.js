import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform, ActivityIndicator,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import {getQuizHistoryFromFirebase} from "../services/firebaseService";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [loading , setLoading] = useState(true);
  const [history , setHistory] = useState([]);

  const getStats = async () => {
    try{
      const historyData = await getQuizHistoryFromFirebase();
      setHistory(historyData);
      console.log(historyData);
    }catch (e) {
      console.log(e);
    }finally {
      setLoading(false);
    }
  }

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

  // Helper to get initials (e.g., "JD" from "John Doe")
  const getInitials = () => {
    if (user?.displayName) {
        const names = user.displayName.split(' ');
        if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
        return names[0][0].toUpperCase();
    }
    return user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  const getSuccessRate = () => {
    const totalAnswered = history.reduce((acc, h) => acc + (h.score || 0), 0);
    if(totalAnswered === 0) return null;
    return (totalAnswered / (history.length * 10)) * 100;
  }

  if(loading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading Profile...</Text>
        </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center title */}
      </View>

      {/* --- Main Content --- */}
      <View style={styles.content}>
        
        {/* User Stats Card */}
        <View style={styles.card}>
          {/* Top Section: Avatar & Info */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <View>
              {/* Display Username or fallback to "User" */}
              <Text style={styles.userName}>{user?.username || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Bottom Section: Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{history.length !== 0 ? `${getSuccessRate()}%` : '0%'}</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            {/*<View style={styles.statItem}>*/}
            {/*  <Text style={styles.statValue}>5</Text>*/}
            {/*  <Text style={styles.statLabel}>Streak</Text>*/}
            {/*</View>*/}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionBtn}>
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
  
  // Header
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

  // Content
  content: {
    padding: 24,
  },

  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    marginBottom: 24,
    // Shadow
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
    backgroundColor: '#09090b', // Primary black
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
    color: '#71717a', // muted-foreground
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

  // Buttons
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
    color: '#ef4444', // Destructive Red
  },
});

export default ProfileScreen;