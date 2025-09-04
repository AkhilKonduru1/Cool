import { apiService } from '@/services/apiService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Sign In Modal Component
interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
  onSignIn: (user: any) => void;
  onSignUp: (user: any) => void;
}

export function SignInModal({ visible, onClose, onSignIn, onSignUp }: SignInModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !username)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const user = await apiService.signUp(email, password, username);
        onSignUp(user);
      } else {
        const user = await apiService.signIn(email, password);
        onSignIn(user);
      }
      onClose();
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#FF6B9D', '#C44569', '#8E44AD']}
          style={styles.modalHeader}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.modalSubtitle}>
            {isSignUp ? 'Join the adventure community' : 'Sign in to continue your journey'}
          </Text>
        </LinearGradient>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Choose a username"
                  placeholderTextColor="#6C757D"
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#6C757D"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#6C757D"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.toggleButtonText}>
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Share Modal Component
interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  adventure?: any;
}

export function ShareModal({ visible, onClose, adventure }: ShareModalProps) {
  const [shareText, setShareText] = useState('');

  const handleShare = () => {
    // In a real app, you would use the Share API
    Alert.alert('Shared!', 'Your adventure has been shared with friends!');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#00B894', '#00A085', '#00CEC9']}
          style={styles.modalHeader}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Share Adventure</Text>
          <Text style={styles.modalSubtitle}>Tell your friends about your amazing experience</Text>
        </LinearGradient>

        <View style={styles.modalContent}>
          <View style={styles.adventurePreview}>
            <Text style={styles.adventureTitle}>{adventure?.title || 'My Adventure'}</Text>
            <Text style={styles.adventureDescription}>
              {adventure?.description || 'Just had an amazing adventure!'}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Add a message (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={shareText}
              onChangeText={setShareText}
              placeholder="What made this adventure special?"
              placeholderTextColor="#6C757D"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.shareOptions}>
            <TouchableOpacity style={styles.shareOption}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              <Text style={styles.shareOptionText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareOption}>
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
              <Text style={styles.shareOptionText}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareOption}>
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
              <Text style={styles.shareOptionText}>Instagram</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Share Adventure</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Notification Center Component
interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
  notifications?: any[];
}

export function NotificationCenter({ visible, onClose, notifications = [] }: NotificationCenterProps) {
  const mockNotifications = [
    {
      id: '1',
      title: 'New Friend Request',
      message: 'Sarah Chen wants to be your friend',
      time: '2 minutes ago',
      type: 'friend_request',
      unread: true,
    },
    {
      id: '2',
      title: 'Adventure Reminder',
      message: 'Time for your daily adventure!',
      time: '1 hour ago',
      type: 'reminder',
      unread: true,
    },
    {
      id: '3',
      title: 'Badge Earned',
      message: 'You earned the "Explorer" badge!',
      time: '3 hours ago',
      type: 'achievement',
      unread: false,
    },
  ];

  const allNotifications = notifications.length > 0 ? notifications : mockNotifications;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#8E44AD', '#9B59B6', '#E74C3C']}
          style={styles.modalHeader}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Notifications</Text>
          <Text style={styles.modalSubtitle}>Stay updated with your adventure community</Text>
        </LinearGradient>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {allNotifications.map((notification) => (
            <TouchableOpacity key={notification.id} style={styles.notificationItem}>
              <View style={styles.notificationIcon}>
                <Ionicons 
                  name={
                    notification.type === 'friend_request' ? 'person-add' :
                    notification.type === 'reminder' ? 'time' :
                    notification.type === 'achievement' ? 'trophy' : 'notifications'
                  } 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {notification.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#C44569',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
  adventurePreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adventureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  adventureDescription: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  shareOption: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareOptionText: {
    fontSize: 12,
    color: '#2D3436',
    marginTop: 8,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#00B894',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  notificationItem: {
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
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8E44AD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
  },
});

