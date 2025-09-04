import { AdventureResult, AdventureSpinner } from '@/components/AdventureComponents';
import LocationInput from '@/components/LocationInput';
import { NotificationCenter, ShareModal, SignInModal } from '@/components/ModalComponents';
import { ActivitySelector, DailyStreakWidget, MemoryCapsule, UserStats } from '@/components/WidgetComponents';
import { apiService, User } from '@/services/apiService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface Adventure {
  title: string;
  description: string;
  emoji: string;
  estimatedTime: string;
  cost: string;
  location: string;
  tips: string[];
  category: string;
}

export default function HomeScreen() {
  const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(null);
  const [availableActivities, setAvailableActivities] = useState<Adventure[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // User stats - now comes from backend
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    adventuresCompleted: 0,
    badgesEarned: 0,
  });

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const authenticated = await apiService.isAuthenticated();
      if (authenticated) {
        const userProfile = await apiService.getProfile();
        setUser(userProfile);
        setUserStats({
          points: userProfile.points,
          level: userProfile.level,
          streak: userProfile.streak,
          adventuresCompleted: userProfile.adventures_completed,
          badgesEarned: userProfile.badges_earned,
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdventureGenerated = (adventures: Adventure[]) => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    setAvailableActivities(adventures);
    setShowActivitySelector(true);
  };

  const handleActivitySelected = async (activity: Adventure) => {
    setCurrentAdventure(activity);
    setShowActivitySelector(false);
    setShowResult(true);
    
    // Save adventure to backend
    if (isAuthenticated) {
      try {
        await apiService.saveAdventure({
          title: activity.title,
          description: activity.description,
          location: activity.location,
          category: activity.category,
          points_earned: 50, // Default points
        });
        
        // Refresh user stats
        const userProfile = await apiService.getProfile();
        setUserStats({
          points: userProfile.points,
          level: userProfile.level,
          streak: userProfile.streak,
          adventuresCompleted: userProfile.adventures_completed,
          badgesEarned: userProfile.badges_earned,
        });
      } catch (error) {
        console.error('Failed to save adventure:', error);
      }
    }
  };

  const handleLocationSet = (location: Location) => {
    setUserLocation(location);
  };

  const handleSaveToMemory = (adventure: Adventure) => {
    // This will be handled by the MemoryCapsule component
  };

  const handleGetDirections = () => {
    // In a real app, this would open maps with directions
    console.log('Getting directions for:', currentAdventure);
  };

  const handleNewAdventure = () => {
    setShowResult(false);
    setShowActivitySelector(false);
    setCurrentAdventure(null);
    setAvailableActivities([]);
    setResetCounter(prev => prev + 1); // Trigger reset in AdventureSpinner
  };

  const handleShareAdventure = async (friends: string[], message: string) => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    
    try {
      // In a real implementation, you would send the share request to your backend
      console.log('Sharing adventure with:', friends, 'Message:', message);
      Alert.alert('Shared!', 'Your adventure has been shared with your friends!');
    } catch (error) {
      console.error('Failed to share adventure:', error);
      Alert.alert('Error', 'Failed to share adventure. Please try again.');
    }
  };

  const handleNotificationPress = (notification: any) => {
    console.log('Notification pressed:', notification);
    // Handle different notification types
  };

  const handleLevelUp = () => {
    Alert.alert('Level Up!', 'Congratulations on reaching a new level!');
  };

  const handleStreakMilestone = () => {
    Alert.alert('Streak Milestone!', 'Keep up the great work with your adventure streak!');
  };

  const handleStreakUpdate = async (newStreak: number) => {
    if (!isAuthenticated) return;
    
    try {
      // Update streak in backend
      console.log('Streak updated to:', newStreak);
      // In a real implementation, you would call an API to update the streak
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const response = await apiService.signIn(email, password);
      setUser(response.user);
      setUserStats({
        points: response.user.points,
        level: response.user.level,
        streak: response.user.streak,
        adventuresCompleted: response.user.adventures_completed,
        badgesEarned: response.user.badges_earned,
      });
      setIsAuthenticated(true);
      setShowSignIn(false);
      Alert.alert('Welcome back!', `Hello ${response.user.username}!`);
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, username: string) => {
    try {
      const response = await apiService.signUp(email, password, username);
      setUser(response.user);
      setUserStats({
        points: response.user.points,
        level: response.user.level,
        streak: response.user.streak,
        adventuresCompleted: response.user.adventures_completed,
        badgesEarned: response.user.badges_earned,
      });
      setIsAuthenticated(true);
      setShowSignIn(false);
      Alert.alert('Welcome to Eventure!', `Hello ${response.user.username}! Let's start your first adventure!`);
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await apiService.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setUserStats({
        points: 0,
        level: 1,
        streak: 0,
        adventuresCompleted: 0,
        badgesEarned: 0,
      });
      Alert.alert('Signed out', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#FF6B9D', '#C44569', '#8E44AD']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.appTitle}>Eventure</Text>
            <Text style={styles.appSubtitle}>Turn Everyday Moments into Mini-Adventures</Text>
            {isAuthenticated && user && (
              <Text style={styles.welcomeText}>Welcome back, {user.username}!</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            {isAuthenticated ? (
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => setShowNotifications(true)}
              >
                <Ionicons name="notifications" size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => setShowSignIn(true)}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <UserStats
          user={{
            level: userStats.level,
            points: userStats.points,
            adventures_completed: user?.adventures_completed || 0,
            badges_earned: user?.badges_earned || 0,
          }}
        />

        <DailyStreakWidget
          currentStreak={userStats.streak}
          longestStreak={14}
          onStreakUpdate={handleStreakUpdate}
        />
        
        <LocationInput onLocationSet={handleLocationSet} />
        
        {userLocation && (
          <>
            <AdventureSpinner 
              onAdventureGenerated={handleAdventureGenerated}
              userLocation={userLocation}
              resetTrigger={resetCounter}
            />
            
            {showActivitySelector && availableActivities.length > 0 && (
              <ActivitySelector
                activities={availableActivities}
                onActivitySelect={handleActivitySelected}
              />
            )}
            
            {showResult && currentAdventure && (
              <AdventureResult
                adventure={currentAdventure}
                onSaveToMemory={handleSaveToMemory}
                onGetDirections={handleGetDirections}
                onShare={() => setShowShareModal(true)}
                onNewAdventure={handleNewAdventure}
              />
            )}
          </>
        )}

        {!userLocation && (
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedTitle}>Start Your First Adventure</Text>
            <Text style={styles.getStartedText}>
              Set your location above to begin discovering amazing activities near you!
            </Text>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => {
                if (!isAuthenticated) {
                  setShowSignIn(true);
                } else {
                  Alert.alert('Set Location', 'Please set your location using the location input above to start your adventure!');
                }
              }}
            >
              <LinearGradient
                colors={['#FF6B9D', '#C44569']}
                style={styles.gradientButton}
              >
                <Text style={styles.getStartedButtonText}>
                  {isAuthenticated ? 'Set Location to Start' : 'Sign In to Start'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <MemoryCapsule memories={[]} onViewMemories={() => {}} />
      </View>

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        adventure={currentAdventure ? {
          title: currentAdventure.title,
          description: currentAdventure.description,
          emoji: currentAdventure.emoji,
          location: currentAdventure.location,
        } : {
          title: 'Sample Adventure',
          description: 'A fun adventure to share',
          emoji: '🎯',
          location: 'Sample Location',
        }}
        onShare={handleShareAdventure}
      />

      <NotificationCenter
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNotificationPress={handleNotificationPress}
      />

      <SignInModal
        visible={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 22,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#2D3436',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  getStartedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  getStartedText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  getStartedButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
