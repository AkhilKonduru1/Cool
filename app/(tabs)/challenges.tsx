import { apiService, User } from '@/services/apiService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'exploration' | 'social' | 'creative' | 'fitness' | 'learning';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  progress: number;
  maxProgress: number;
  timeLeft: string;
  isCompleted: boolean;
  isActive: boolean;
  emoji: string;
  rewards: string[];
  requirements: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isEarned: boolean;
  earnedDate?: string;
  category: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  isCurrentUser: boolean;
  weeklyProgress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  points: number;
  category: string;
}

export default function ChallengesScreen() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'badges' | 'achievements'>('challenges');
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    }
  };

  // Mock data - in a real app, this would come from your backend
  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Morning Explorer',
      description: 'Complete an adventure before 10 AM',
      type: 'daily',
      category: 'exploration',
      difficulty: 'easy',
      points: 50,
      progress: 0,
      maxProgress: 1,
      timeLeft: '6h 23m',
      isCompleted: false,
      isActive: true,
      emoji: '🌅',
      rewards: ['50 points', 'Early Bird badge'],
      requirements: ['Start adventure before 10 AM'],
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Share 3 adventures with friends this week',
      type: 'weekly',
      category: 'social',
      difficulty: 'medium',
      points: 200,
      progress: 1,
      maxProgress: 3,
      timeLeft: '2d 14h',
      isCompleted: false,
      isActive: true,
      emoji: '🦋',
      rewards: ['200 points', 'Social Star badge'],
      requirements: ['Share 3 adventures', 'Tag friends'],
    },
    {
      id: '3',
      title: 'Photo Master',
      description: 'Take photos at 5 different adventure locations',
      type: 'weekly',
      category: 'creative',
      difficulty: 'medium',
      points: 150,
      progress: 3,
      maxProgress: 5,
      timeLeft: '4d 8h',
      isCompleted: false,
      isActive: true,
      emoji: '📸',
      rewards: ['150 points', 'Photographer badge'],
      requirements: ['Visit 5 locations', 'Take photos'],
    },
    {
      id: '4',
      title: 'Weekend Warrior',
      description: 'Complete 5 adventures this weekend',
      type: 'weekly',
      category: 'exploration',
      difficulty: 'hard',
      points: 500,
      progress: 2,
      maxProgress: 5,
      timeLeft: '1d 12h',
      isCompleted: false,
      isActive: true,
      emoji: '⚔️',
      rewards: ['500 points', 'Weekend Warrior badge', 'Special title'],
      requirements: ['Complete 5 adventures', 'Saturday & Sunday only'],
    },
  ]);

  const [badges] = useState<Badge[]>([
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first adventure',
      emoji: '👶',
      rarity: 'common',
      isEarned: true,
      earnedDate: '2024-01-15',
      category: 'milestone',
    },
    {
      id: '2',
      name: 'Explorer',
      description: 'Complete 10 adventures',
      emoji: '🗺️',
      rarity: 'common',
      isEarned: true,
      earnedDate: '2024-01-20',
      category: 'milestone',
    },
    {
      id: '3',
      name: 'Social Star',
      description: 'Share 25 adventures with friends',
      emoji: '⭐',
      rarity: 'rare',
      isEarned: false,
      category: 'social',
    },
    {
      id: '4',
      name: 'Night Owl',
      description: 'Complete 5 adventures after 10 PM',
      emoji: '🦉',
      rarity: 'epic',
      isEarned: false,
      category: 'special',
    },
    {
      id: '5',
      name: 'Legendary Adventurer',
      description: 'Complete 100 adventures',
      emoji: '👑',
      rarity: 'legendary',
      isEarned: false,
      category: 'milestone',
    },
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      points: 2847,
      level: 12,
      rank: 1,
      isCurrentUser: false,
      weeklyProgress: 15,
    },
    {
      id: '2',
      name: user?.username || 'You',
      points: user?.points || 2156,
      level: user?.level || 9,
      rank: 2,
      isCurrentUser: true,
      weeklyProgress: 12,
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      points: 1987,
      level: 8,
      rank: 3,
      isCurrentUser: false,
      weeklyProgress: 8,
    },
    {
      id: '4',
      name: 'Emma Thompson',
      points: 1756,
      level: 7,
      rank: 4,
      isCurrentUser: false,
      weeklyProgress: 6,
    },
    {
      id: '5',
      name: 'Alex Johnson',
      points: 1623,
      level: 7,
      rank: 5,
      isCurrentUser: false,
      weeklyProgress: 4,
    },
    {
      id: '6',
      name: 'Jessica Park',
      points: 1521,
      level: 6,
      rank: 6,
      isCurrentUser: false,
      weeklyProgress: 3,
    },
    {
      id: '7',
      name: 'David Kim',
      points: 1432,
      level: 6,
      rank: 7,
      isCurrentUser: false,
      weeklyProgress: 2,
    },
    {
      id: '8',
      name: 'Luna Nightowl',
      points: 1287,
      level: 5,
      rank: 8,
      isCurrentUser: false,
      weeklyProgress: 1,
    },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Adventure Streak',
      description: 'Complete adventures for 7 days in a row',
      emoji: '🔥',
      isUnlocked: false,
      progress: 4,
      maxProgress: 7,
      points: 300,
      category: 'consistency',
    },
    {
      id: '2',
      title: 'Local Explorer',
      description: 'Complete 20 adventures within 10 miles',
      emoji: '🏠',
      isUnlocked: false,
      progress: 12,
      maxProgress: 20,
      points: 250,
      category: 'exploration',
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Make 10 new friends through the app',
      emoji: '🦋',
      isUnlocked: false,
      progress: 6,
      maxProgress: 10,
      points: 200,
      category: 'social',
    },
    {
      id: '4',
      title: 'Photo Collector',
      description: 'Take 100 photos during adventures',
      emoji: '📷',
      isUnlocked: false,
      progress: 67,
      maxProgress: 100,
      points: 150,
      category: 'creative',
    },
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleChallengePress = (challenge: Challenge) => {
    if (challenge.isCompleted) {
      Alert.alert('Challenge Completed!', 'You\'ve already completed this challenge.');
    } else {
      Alert.alert(
        challenge.title,
        `${challenge.description}\n\nRewards: ${challenge.rewards.join(', ')}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start Challenge', onPress: () => {
            Alert.alert('Challenge Started!', 'Good luck with your challenge!');
          }}
        ]
      );
    }
  };

  const handleViewBadges = () => {
    setActiveTab('badges');
  };

  const handleViewLeaderboard = () => {
    setActiveTab('leaderboard');
  };

  const handleShareProgress = () => {
    Alert.alert('Share Progress', 'Share your progress feature coming soon!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#6C757D';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6C757D';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return '#6C757D';
    }
  };

  const renderChallengeCard = ({ item }: { item: Challenge }) => (
    <TouchableOpacity 
      style={[styles.challengeCard, item.isCompleted && styles.completedCard]}
      onPress={() => handleChallengePress(item)}
    >
      <LinearGradient
        colors={item.isCompleted ? ['#4CAF50', '#45A049'] : ['#FFFFFF', '#F8F9FA']}
        style={styles.challengeGradient}
      >
        <View style={styles.challengeHeader}>
          <View style={styles.challengeTitleRow}>
            <Text style={styles.challengeEmoji}>{item.emoji}</Text>
            <View style={styles.challengeTitleContainer}>
              <Text style={[styles.challengeTitle, item.isCompleted && styles.completedText]}>
                {item.title}
              </Text>
              <View style={styles.challengeMeta}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                  <Text style={styles.difficultyText}>{item.difficulty.toUpperCase()}</Text>
                </View>
                <Text style={styles.challengeType}>{item.type}</Text>
                <Text style={styles.challengePoints}>{item.points} pts</Text>
              </View>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLeft}>{item.timeLeft}</Text>
          </View>
        </View>
        
        <Text style={[styles.challengeDescription, item.isCompleted && styles.completedText]}>
          {item.description}
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Progress: {item.progress}/{item.maxProgress}
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round((item.progress / item.maxProgress) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${(item.progress / item.maxProgress) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        
        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>Rewards:</Text>
          <View style={styles.rewardsList}>
            {item.rewards.map((reward, index) => (
              <View key={index} style={styles.rewardItem}>
                <Ionicons name="gift" size={14} color="#FF6B9D" />
                <Text style={styles.rewardText}>{reward}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {item.isCompleted && (
          <View style={styles.completedOverlay}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
            <Text style={styles.completedText}>Completed!</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderBadgeCard = ({ item }: { item: Badge }) => (
    <View style={[styles.badgeCard, item.isEarned && styles.earnedBadge]}>
      <View style={[styles.badgeIcon, { backgroundColor: getRarityColor(item.rarity) }]}>
        <Text style={styles.badgeEmoji}>{item.emoji}</Text>
        {item.isEarned && (
          <View style={styles.earnedIndicator}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      <View style={styles.badgeInfo}>
        <Text style={[styles.badgeName, item.isEarned && styles.earnedText]}>
          {item.name}
        </Text>
        <Text style={[styles.badgeDescription, item.isEarned && styles.earnedText]}>
          {item.description}
        </Text>
        <View style={styles.badgeMeta}>
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
            <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
          </View>
          {item.isEarned && item.earnedDate && (
            <Text style={styles.earnedDate}>Earned {item.earnedDate}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderLeaderboardEntry = ({ item }: { item: LeaderboardEntry }) => (
    <View style={[styles.leaderboardEntry, item.isCurrentUser && styles.currentUserEntry]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rank, item.rank <= 3 && styles.topRank]}>
          #{item.rank}
        </Text>
        {item.rank <= 3 && (
          <Ionicons 
            name={item.rank === 1 ? "trophy" : item.rank === 2 ? "medal" : "ribbon"} 
            size={20} 
            color={item.rank === 1 ? "#FFD700" : item.rank === 2 ? "#C0C0C0" : "#CD7F32"} 
          />
        )}
      </View>
      
      <View style={styles.userAvatar}>
        <Text style={styles.avatarText}>
          {item.isCurrentUser ? 'ME' : item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[styles.userName, item.isCurrentUser && styles.currentUserName]}>
          {item.name}
        </Text>
        <Text style={styles.userLevel}>Level {item.level}</Text>
        <View style={styles.weeklyProgress}>
          <Text style={styles.weeklyProgressText}>
            {item.weeklyProgress} adventures this week
          </Text>
        </View>
      </View>
      
      <View style={styles.pointsContainer}>
        <Text style={[styles.points, item.isCurrentUser && styles.currentUserPoints]}>
          {item.points.toLocaleString()}
        </Text>
        <Text style={styles.pointsLabel}>points</Text>
      </View>
    </View>
  );

  const renderAchievementCard = ({ item }: { item: Achievement }) => (
    <View style={[styles.achievementCard, item.isUnlocked && styles.unlockedAchievement]}>
      <View style={styles.achievementIcon}>
        <Text style={styles.achievementEmoji}>{item.emoji}</Text>
        {item.isUnlocked && (
          <View style={styles.unlockedIndicator}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          </View>
        )}
      </View>
      
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, item.isUnlocked && styles.unlockedText]}>
          {item.title}
        </Text>
        <Text style={[styles.achievementDescription, item.isUnlocked && styles.unlockedText]}>
          {item.description}
        </Text>
        
        <View style={styles.achievementProgress}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {item.progress}/{item.maxProgress}
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round((item.progress / item.maxProgress) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${(item.progress / item.maxProgress) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        
        <View style={styles.achievementReward}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rewardText}>{item.points} points</Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'challenges':
        return (
          <View style={styles.tabContent}>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {challenges.filter(c => c.isCompleted).length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {challenges.filter(c => c.isActive && !c.isCompleted).length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {challenges.reduce((sum, c) => sum + c.points, 0)}
                </Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </View>
            </View>
            
            <FlatList
              data={challenges}
              renderItem={renderChallengeCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
            />
          </View>
        );
      case 'leaderboard':
        return (
          <View style={styles.tabContent}>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.leaderboardTitle}>Weekly Leaderboard</Text>
              <Text style={styles.leaderboardSubtitle}>Top adventurers this week</Text>
            </View>
            
            <FlatList
              data={leaderboard}
              renderItem={renderLeaderboardEntry}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case 'badges':
        return (
          <View style={styles.tabContent}>
            <View style={styles.badgesHeader}>
              <Text style={styles.badgesTitle}>Badge Collection</Text>
              <Text style={styles.badgesSubtitle}>
                {badges.filter(b => b.isEarned).length} of {badges.length} earned
              </Text>
            </View>
            
            <FlatList
              data={badges}
              renderItem={renderBadgeCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case 'achievements':
        return (
          <View style={styles.tabContent}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Achievements</Text>
              <Text style={styles.achievementsSubtitle}>
                {achievements.filter(a => a.isUnlocked).length} of {achievements.length} unlocked
              </Text>
            </View>
            
            <FlatList
              data={achievements}
              renderItem={renderAchievementCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#E17055', '#D63031', '#FDCB6E']}
        style={styles.header}
      >
        <Text style={styles.title}>Challenges</Text>
        <Text style={styles.subtitle}>Level up your adventure game</Text>
      </LinearGradient>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}
        >
          <Ionicons 
            name="trophy" 
            size={20} 
            color={activeTab === 'challenges' ? '#E17055' : '#6C757D'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'challenges' && styles.activeTabText
          ]}>
            Challenges
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Ionicons 
            name="podium" 
            size={20} 
            color={activeTab === 'leaderboard' ? '#E17055' : '#6C757D'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'leaderboard' && styles.activeTabText
          ]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
          onPress={() => setActiveTab('badges')}
        >
          <Ionicons 
            name="medal" 
            size={20} 
            color={activeTab === 'badges' ? '#E17055' : '#6C757D'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'badges' && styles.activeTabText
          ]}>
            Badges
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Ionicons 
            name="star" 
            size={20} 
            color={activeTab === 'achievements' ? '#E17055' : '#6C757D'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'achievements' && styles.activeTabText
          ]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}
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
    alignItems: 'center',
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFF5F5',
  },
  tabText: {
    fontSize: 11,
    color: '#6C757D',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#E17055',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E17055',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  challengeCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  completedCard: {
    opacity: 0.8,
  },
  challengeGradient: {
    padding: 20,
    position: 'relative',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeTitleRow: {
    flexDirection: 'row',
    flex: 1,
  },
  challengeEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  challengeTitleContainer: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  completedText: {
    color: '#FFFFFF',
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  difficultyText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  challengeType: {
    fontSize: 12,
    color: '#6C757D',
    marginRight: 8,
    textTransform: 'capitalize',
  },
  challengePoints: {
    fontSize: 12,
    color: '#E17055',
    fontWeight: 'bold',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeLeft: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#E17055',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 3,
  },
  rewardsContainer: {
    marginBottom: 8,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  rewardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 12,
    color: '#FF6B9D',
    marginLeft: 4,
    fontWeight: '500',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  badgeCard: {
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
  earnedBadge: {
    backgroundColor: '#F0F8F0',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  earnedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  earnedText: {
    color: '#4CAF50',
  },
  badgeDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  badgeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  rarityText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  earnedDate: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  leaderboardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  leaderboardEntry: {
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
  currentUserEntry: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#E17055',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C757D',
    marginRight: 4,
  },
  topRank: {
    color: '#E17055',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E17055',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 2,
  },
  currentUserName: {
    color: '#E17055',
  },
  userLevel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  weeklyProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyProgressText: {
    fontSize: 12,
    color: '#6C757D',
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E17055',
  },
  currentUserPoints: {
    color: '#D63031',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6C757D',
  },
  badgesHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  badgesSubtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  achievementsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  achievementsSubtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  achievementCard: {
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
  unlockedAchievement: {
    backgroundColor: '#F0F8F0',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#74B9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  achievementEmoji: {
    fontSize: 20,
  },
  unlockedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  unlockedText: {
    color: '#4CAF50',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 12,
  },
  achievementProgress: {
    marginBottom: 8,
  },
  achievementReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

