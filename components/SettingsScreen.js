import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert, // Keep Alert for critical "Delete" confirmation only
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../config/firebase'; 
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

// IMPORT THE TOAST LIB THAT SUPPORTS YOUR CUSTOM CONFIG
import {Toast} from 'toastify-react-native'; 

const SettingsScreen = ({ navigation }) => {
  const { user, setUser } = useAuth();
  
  // Profile State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load initial data
  useEffect(() => {
    if (user) {
      setName(user.username || user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // --- 1. UPDATE PROFILE ---
  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Name cannot be empty',
        position: "bottom"
      });
      return;
    }

    setProfileLoading(true);
    try {
      const currentUser = auth.currentUser;
      
      // Update Firebase Auth
      if (currentUser.displayName !== name) {
        await updateProfile(currentUser, { displayName: name });
      }
      
      // Update Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { username: name });

      // Update Local State
      setUser({ ...user, username: name });

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your information has been saved successfully'
      });
      navigation.navigate('Home');

    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message
      });
    } finally {
      setProfileLoading(false);
        }
  };

  // --- 2. UPDATE PASSWORD ---
  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all password fields'
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters long'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Mismatch',
        text2: 'New passwords do not match'
      });
      return;
    }
    setPasswordLoading(false);
    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);
      
      Toast.show({
        type: 'success',
        text1: 'Security Update',
        text2: 'Your password has been changed successfully'
      });

      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigation.navigate('Home');

    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Toast.show({
          type: 'error',
          text: 'The current password you entered is wrong'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: 'The current password you entered is wrong'
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- 3. DELETE ACCOUNT ---
  const handleDeleteAccount = () => {
    // Keep Alert here because a Toast is too easy to miss for a destructive action
    Alert.alert(
      "Delete Account",
      "Are you sure? This will permanently delete your data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const currentUser = auth.currentUser;
              await deleteDoc(doc(db, 'users', currentUser.uid));
              await deleteUser(currentUser);
              // App.js handles the navigation switch automatically
            } catch (error) {
              console.error(error);
              Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: 'Please log out and log in again, then try.'
              });
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header - Fixed at Top */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* 1. Profile Information */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profile Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput 
                style={styles.input} 
                value={name} 
                onChangeText={setName} 
                placeholder="Your Name" 
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={[styles.input, styles.disabledInput]} 
                value={email} 
                editable={false} 
              />
            </View>

            <TouchableOpacity 
              style={styles.primaryBtn} 
              onPress={handleUpdateProfile}
              disabled={profileLoading}
            >
              {profileLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>

          {/* 2. Change Password */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Change Password</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput 
                style={styles.input} 
                value={currentPassword} 
                onChangeText={setCurrentPassword} 
                secureTextEntry 
                placeholder="Enter current password"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput 
                style={styles.input} 
                value={newPassword} 
                onChangeText={setNewPassword} 
                secureTextEntry 
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput 
                style={styles.input} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry 
                placeholder="Confirm new password"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <TouchableOpacity 
              style={styles.primaryBtn} 
              onPress={handleUpdatePassword}
              disabled={passwordLoading}
            >
               {passwordLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Update Password</Text>}
            </TouchableOpacity>
          </View>        

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#09090b',
  },
  scrollContent: {
    flexGrow: 1, // Ensures content can grow and scroll
    padding: 24,
    paddingBottom: 60, // Extra space at bottom for safe scrolling
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    marginBottom: 24,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#09090b',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#09090b',
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  primaryBtn: {
    backgroundColor: '#09090b', // Black
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  // Danger Styles
  dangerCard: {
    borderColor: '#fca5a5', // Light red border
    backgroundColor: '#fef2f2', // Very light red bg
  },
  dangerText: {
    color: '#ef4444',
  },
  dangerDesc: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 16,
    lineHeight: 20,
  },
  dangerBtn: {
    backgroundColor: '#ef4444',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default SettingsScreen;