import { apiService, User } from '@/services/apiService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

const colorSchemes: ColorScheme[] = [
  {
    name: 'Default',
    primary: '#FF6B9D',
    secondary: '#C44569',
    accent: '#8E44AD'
  },
  {
    name: 'Ocean',
    primary: '#00B894',
    secondary: '#00A085',
    accent: '#00CEC9'
  },
  {
    name: 'Sunset',
    primary: '#E17055',
    secondary: '#D63031',
    accent: '#FDCB6E'
  },
  {
    name: 'Forest',
    primary: '#00B894',
    secondary: '#00A085',
    accent: '#55A3FF'
  },
  {
    name: 'Purple',
    primary: '#8E44AD',
    secondary: '#9B59B6',
    accent: '#E74C3C'
  }
];

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColorScheme, setSelectedColorScheme] = useState(colorSchemes[0]);
  
  // Edit profile states
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const authenticated = await apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const userProfile = await apiService.getProfile();
        setUser(userProfile);
        setEditUsername(userProfile.username);
        setEditEmail(userProfile.email);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    if (!editUsername || !editEmail) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // In a real app, you would call an API to update the profile
      Alert.alert('Success', 'Profile updated successfully!');
      setShowEditModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      // In a real app, you would call an API to change password
      Alert.alert('Success', 'Password changed successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    }
  };

  const handleSignOut = async () => {
    try {
      await apiService.signOut();
      setIsAuthenticated(false);
      setUser(null);
      Alert.alert('Signed out', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setSelectedColorScheme(scheme);
    setShowColorModal(false);
    Alert.alert('Color Scheme Updated', `Switched to ${scheme.name} theme!`);
  };

  if (!isAuthenticated || !user) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#FF6B9D', '#C44569', '#8E44AD']}
          style={styles.header}
        >
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Sign in to access your profile</Text>
        </LinearGradient>
        
        <View style={styles.content}>
          <View style={styles.signInPrompt}>
            <Text style={styles.signInTitle}>Sign In Required</Text>
            <Text style={styles.signInText}>
              Please sign in to view and edit your profile settings.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[selectedColorScheme.primary, selectedColorScheme.secondary, selectedColorScheme.accent]}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: selectedColorScheme.accent }]}>
              <Text style={styles.avatarText}>
                {user.username.split('').slice(0, 2).join('').toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>Level {user.level}</Text>
              <Text style={styles.pointsText}>{user.points.toLocaleString()} points</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Profile Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowEditModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={24} color="#6C757D" />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6C757D" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowPasswordModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#6C757D" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6C757D" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowColorModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="color-palette-outline" size={24} color="#6C757D" />
              <Text style={styles.settingText}>Color Scheme</Text>
            </View>
            <View style={styles.colorPreview}>
              <View style={[styles.colorDot, { backgroundColor: selectedColorScheme.primary }]} />
              <Ionicons name="chevron-forward" size={20} color="#6C757D" />
            </View>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#6C757D" />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E9ECEF', true: selectedColorScheme.primary }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#6C757D'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={24} color="#6C757D" />
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#E9ECEF', true: selectedColorScheme.primary }}
              thumbColor={locationEnabled ? '#FFFFFF' : '#6C757D'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color="#6C757D" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E9ECEF', true: selectedColorScheme.primary }}
              thumbColor={darkMode ? '#FFFFFF' : '#6C757D'}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.adventures_completed}</Text>
              <Text style={styles.statLabel}>Adventures</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.badges_earned}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                value={editUsername}
                onChangeText={setEditUsername}
                placeholder="Enter username"
                placeholderTextColor="#6C757D"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter email"
                placeholderTextColor="#6C757D"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={handleChangePassword}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#6C757D"
                secureTextEntry
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#6C757D"
                secureTextEntry
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#6C757D"
                secureTextEntry
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Color Scheme Modal */}
      <Modal
        visible={showColorModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowColorModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowColorModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose Color Scheme</Text>
            <View style={{ width: 60 }} />
          </View>
          
          <View style={styles.modalContent}>
            {colorSchemes.map((scheme, index) => (
              <TouchableOpacity
                key={index}
                style={styles.colorSchemeItem}
                onPress={() => handleColorSchemeChange(scheme)}
              >
                <View style={styles.colorSchemePreview}>
                  <View style={[styles.colorBar, { backgroundColor: scheme.primary }]} />
                  <View style={[styles.colorBar, { backgroundColor: scheme.secondary }]} />
                  <View style={[styles.colorBar, { backgroundColor: scheme.accent }]} />
                </View>
                <Text style={styles.colorSchemeName}>{scheme.name}</Text>
                {selectedColorScheme.name === scheme.name && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6C757D',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 16,
  },
  pointsText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#2D3436',
    marginLeft: 12,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signInPrompt: {
    alignItems: 'center',
    padding: 40,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  signInText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6C757D',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  modalSave: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3436',
    backgroundColor: '#FFFFFF',
  },
  colorSchemeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorSchemePreview: {
    flexDirection: 'row',
    marginRight: 16,
  },
  colorBar: {
    width: 20,
    height: 40,
    marginRight: 4,
    borderRadius: 4,
  },
  colorSchemeName: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
  },
});

