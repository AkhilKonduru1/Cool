import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Daily Streak Widget Component
interface DailyStreakWidgetProps {
  currentStreak: number;
  onStreakClick?: () => void;
}

export function DailyStreakWidget({ currentStreak, onStreakClick }: DailyStreakWidgetProps) {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <TouchableOpacity style={styles.streakWidget} onPress={onStreakClick}>
      <LinearGradient
        colors={['#FF6B9D', '#C44569', '#8E44AD']}
        style={styles.streakGradient}
      >
        <Animated.View style={[styles.streakIcon, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="flame" size={24} color="#FFFFFF" />
        </Animated.View>
        <View style={styles.streakContent}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// User Stats Component
interface UserStatsProps {
  user?: {
    level: number;
    points: number;
    adventures_completed: number;
    badges_earned: number;
  };
}

export function UserStats({ user }: UserStatsProps) {
  const defaultUser = {
    level: 0,
    points: 0,
    adventures_completed: 0,
    badges_earned: 0,
  };
  
  const userData = user || defaultUser;
  const [animatedStats, setAnimatedStats] = useState({
    level: 0,
    points: 0,
    adventures: 0,
    badges: 0,
  });

  useEffect(() => {
    const animateValue = (target: number, setter: (value: number) => void, duration: number = 1000) => {
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        setter(current);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    animateValue(userData.level, (value) => setAnimatedStats(prev => ({ ...prev, level: value })));
    animateValue(userData.points, (value) => setAnimatedStats(prev => ({ ...prev, points: value })));
    animateValue(userData.adventures_completed, (value) => setAnimatedStats(prev => ({ ...prev, adventures: value })));
    animateValue(userData.badges_earned, (value) => setAnimatedStats(prev => ({ ...prev, badges: value })));
  }, [userData]);

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Ionicons name="trophy" size={20} color="#FF6B9D" />
        </View>
        <Text style={styles.statNumber}>{animatedStats.level}</Text>
        <Text style={styles.statLabel}>Level</Text>
      </View>
      
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Ionicons name="star" size={20} color="#FF6B9D" />
        </View>
        <Text style={styles.statNumber}>{animatedStats.points.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Points</Text>
      </View>
      
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Ionicons name="compass" size={20} color="#FF6B9D" />
        </View>
        <Text style={styles.statNumber}>{animatedStats.adventures}</Text>
        <Text style={styles.statLabel}>Adventures</Text>
      </View>
      
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Ionicons name="medal" size={20} color="#FF6B9D" />
        </View>
        <Text style={styles.statNumber}>{animatedStats.badges}</Text>
        <Text style={styles.statLabel}>Badges</Text>
      </View>
    </View>
  );
}

// Memory Capsule Component
interface MemoryCapsuleProps {
  memories?: any[];
  onViewMemories?: () => void;
}

export function MemoryCapsule({ memories = [], onViewMemories }: MemoryCapsuleProps) {
  const recentMemories = memories.slice(0, 3);

  return (
    <TouchableOpacity style={styles.memoryCapsule} onPress={onViewMemories}>
      <LinearGradient
        colors={['#00B894', '#00A085', '#00CEC9']}
        style={styles.memoryGradient}
      >
        <View style={styles.memoryHeader}>
          <Ionicons name="heart" size={24} color="#FFFFFF" />
          <Text style={styles.memoryTitle}>Memory Capsule</Text>
        </View>
        
        <View style={styles.memoryContent}>
          {recentMemories.length > 0 ? (
            recentMemories.map((memory, index) => (
              <View key={index} style={styles.memoryItem}>
                <Text style={styles.memoryEmoji}>{memory.emoji || '🌟'}</Text>
                <Text style={styles.memoryText} numberOfLines={1}>
                  {memory.title || memory.description || 'Adventure Memory'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMemoryText}>No memories yet</Text>
          )}
        </View>
        
        <View style={styles.memoryFooter}>
          <Text style={styles.memoryCount}>{memories.length} memories</Text>
          <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// Activity Selector Component
interface ActivitySelectorProps {
  onActivitySelect: (activity: any) => void;
  activities?: any[];
}

export function ActivitySelector({ onActivitySelect, activities = [] }: ActivitySelectorProps) {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const handleSelect = (activity: any) => {
    setSelectedActivity(activity);
    onActivitySelect(activity);
  };

  return (
    <View style={styles.activitySelector}>
      <Text style={styles.selectorTitle}>Choose Your Adventure</Text>
      <View style={styles.activitiesGrid}>
        {activities.map((activity, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.activityCard,
              selectedActivity === activity && styles.selectedActivityCard
            ]}
            onPress={() => handleSelect(activity)}
          >
            <Text style={styles.activityEmoji}>{activity.emoji}</Text>
            <Text style={[
              styles.activityTitle,
              selectedActivity === activity && styles.selectedActivityText
            ]}>
              {activity.title}
            </Text>
            <Text style={[
              styles.activityDescription,
              selectedActivity === activity && styles.selectedActivityText
            ]}>
              {activity.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Daily Streak Widget Styles
  streakWidget: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  streakGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  streakIcon: {
    marginRight: 12,
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // User Stats Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },

  // Memory Capsule Styles
  memoryCapsule: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  memoryGradient: {
    padding: 20,
  },
  memoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  memoryContent: {
    marginBottom: 16,
  },
  memoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  memoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    flex: 1,
  },
  emptyMemoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  memoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memoryCount: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // Activity Selector Styles
  activitySelector: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedActivityCard: {
    backgroundColor: '#FF6B9D',
    transform: [{ scale: 1.05 }],
  },
  activityEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
    textAlign: 'center',
  },
  activityDescription: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedActivityText: {
    color: '#FFFFFF',
  },
});
