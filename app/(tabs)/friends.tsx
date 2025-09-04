import { apiService, Friend, FriendRequest } from '@/services/apiService';
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
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  adventuresCompleted: number;
  level: number;
  mutualFriends: number;
  isOnline: boolean;
}

interface FriendRequest {
  id: string;
  from: Friend;
  message?: string;
  timestamp: string;
}

interface Activity {
  id: string;
  friend: Friend;
  action: 'completed_adventure' | 'shared_memory' | 'earned_badge' | 'leveled_up';
  details: string;
  timestamp: string;
  adventure?: string;
  badge?: string;
}

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<'friends' | 'discover' | 'requests' | 'activity'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const authenticated = await apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        await loadData();
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([
        apiService.getFriends(),
        apiService.getFriendRequests()
      ]);
      
      // Add fake friends data for demo purposes
      const fakeFriends: Friend[] = [
        {
          id: 1,
          username: 'sarah_adventures',
          level: 8,
          adventures_completed: 47,
          points: 2847
        },
        {
          id: 2,
          username: 'mike_explorer',
          level: 5,
          adventures_completed: 23,
          points: 1987
        },
        {
          id: 3,
          username: 'emma_wanderer',
          level: 12,
          adventures_completed: 89,
          points: 3756
        },
        {
          id: 4,
          username: 'alex_adventurer',
          level: 7,
          adventures_completed: 34,
          points: 1623
        },
        {
          id: 5,
          username: 'jess_foodie',
          level: 15,
          adventures_completed: 156,
          points: 4521
        }
      ];
      
      // Add fake friend requests for demo
      const fakeRequests: FriendRequest[] = [
        {
          id: 1,
          sender: {
            id: 6,
            username: 'david_photographer',
            level: 10,
            adventures_completed: 78
          },
          message: 'Hey! I saw you love photography adventures too!',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          id: 2,
          sender: {
            id: 7,
            username: 'luna_nightowl',
            level: 6,
            adventures_completed: 31
          },
          message: 'Let\'s explore the city together!',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
        }
      ];
      
      setFriends([...friendsData, ...fakeFriends]);
      setFriendRequests([...requestsData, ...fakeRequests]);
    } catch (error) {
      console.error('Failed to load friends data:', error);
      // Set fake data even if API fails
      const fakeFriends: Friend[] = [
        {
          id: 1,
          username: 'sarah_adventures',
          level: 8,
          adventures_completed: 47,
          points: 2847
        },
        {
          id: 2,
          username: 'mike_explorer',
          level: 5,
          adventures_completed: 23,
          points: 1987
        },
        {
          id: 3,
          username: 'emma_wanderer',
          level: 12,
          adventures_completed: 89,
          points: 3756
        }
      ];
      
      const fakeRequests: FriendRequest[] = [
        {
          id: 1,
          sender: {
            id: 6,
            username: 'david_photographer',
            level: 10,
            adventures_completed: 78
          },
          message: 'Hey! I saw you love photography adventures too!',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setFriends(fakeFriends);
      setFriendRequests(fakeRequests);
    }
  };

  const [activity] = useState<Activity[]>([
    {
      id: '1',
      friend: {
        id: '1',
        name: 'Sarah Chen',
        username: '@sarah_adventures',
        status: 'online',
        lastActive: '2 minutes ago',
        adventuresCompleted: 47,
        level: 8,
        mutualFriends: 12,
        isOnline: true,
      },
      action: 'completed_adventure',
      details: 'completed "Hidden Coffee Shop Hunt"',
      timestamp: '10 minutes ago',
      adventure: 'Hidden Coffee Shop Hunt',
    },
    {
      id: '2',
      friend: {
        id: '2',
        name: 'Mike Rodriguez',
        username: '@mike_explorer',
        status: 'away',
        lastActive: '1 hour ago',
        adventuresCompleted: 23,
        level: 5,
        mutualFriends: 8,
        isOnline: false,
      },
      action: 'earned_badge',
      details: 'earned the "Night Owl Explorer" badge',
      timestamp: '1 hour ago',
      badge: 'Night Owl Explorer',
    },
    {
      id: '3',
      friend: {
        id: '3',
        name: 'Emma Thompson',
        username: '@emma_wanderer',
        status: 'offline',
        lastActive: '3 hours ago',
        adventuresCompleted: 89,
        level: 12,
        mutualFriends: 15,
        isOnline: false,
      },
      action: 'leveled_up',
      details: 'reached Level 12!',
      timestamp: '2 hours ago',
    },
    {
      id: '4',
      friend: {
        id: '4',
        name: 'Alex Johnson',
        username: '@alex_adventurer',
        status: 'online',
        lastActive: '5 minutes ago',
        adventuresCompleted: 34,
        level: 7,
        mutualFriends: 5,
        isOnline: true,
      },
      action: 'shared_memory',
      details: 'shared a memory from "Sunset Photography Walk"',
      timestamp: '30 minutes ago',
    },
    {
      id: '5',
      friend: {
        id: '5',
        name: 'Jessica Park',
        username: '@jess_foodie',
        status: 'online',
        lastActive: '1 minute ago',
        adventuresCompleted: 156,
        level: 15,
        mutualFriends: 3,
        isOnline: true,
      },
      action: 'completed_adventure',
      details: 'completed "Food Truck Festival Tour"',
      timestamp: '45 minutes ago',
    },
    {
      id: '6',
      friend: {
        id: '6',
        name: 'David Kim',
        username: '@david_photographer',
        status: 'away',
        lastActive: '30 minutes ago',
        adventuresCompleted: 78,
        level: 10,
        mutualFriends: 7,
        isOnline: false,
      },
      action: 'earned_badge',
      details: 'earned the "Photography Master" badge',
      timestamp: '1 hour ago',
    },
  ]);



  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddFriend = async (userId: number) => {
    try {
      await apiService.sendFriendRequest(userId, 'Hey! Let\'s be friends on Eventure!');
      Alert.alert('Friend Request Sent', 'Your friend request has been sent!');
    } catch (error) {
      console.error('Failed to send friend request:', error);
      Alert.alert('Error', 'Failed to send friend request. Please try again.');
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await apiService.respondToFriendRequest(requestId, 'accept');
      Alert.alert('Request Accepted', 'You are now friends!');
      await loadData(); // Refresh the data
    } catch (error) {
      console.error('Failed to accept friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request. Please try again.');
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      await apiService.respondToFriendRequest(requestId, 'decline');
      Alert.alert('Request Declined', 'Friend request declined.');
      await loadData(); // Refresh the data
    } catch (error) {
      console.error('Failed to decline friend request:', error);
      Alert.alert('Error', 'Failed to decline friend request. Please try again.');
    }
  };



  const handleSearchFriends = async (query: string) => {
    if (query.length < 2) {
      setDiscoverUsers([]);
      return;
    }
    
    try {
      const users = await apiService.searchFriends(query);
      setDiscoverUsers(users);
    } catch (error) {
      console.error('Failed to search friends:', error);
    }
  };

  const renderFriendCard = ({ item }: { item: Friend }) => (
    <TouchableOpacity style={styles.friendCard}>
      <View style={styles.friendAvatar}>
        <Text style={styles.avatarText}>
          {item.username.split('').slice(0, 2).join('').toUpperCase()}
        </Text>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: '#4CAF50' } // Default to online for now
        ]} />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
        <Text style={styles.friendUsername}>@{item.username}</Text>
        <View style={styles.friendStats}>
          <Text style={styles.statText}>Level {item.level}</Text>
          <Text style={styles.statText}>•</Text>
          <Text style={styles.statText}>{item.adventures_completed} adventures</Text>
        </View>
        <Text style={styles.lastActive}>Online</Text>
      </View>

    </TouchableOpacity>
  );

  const renderDiscoverCard = ({ item }: { item: Friend }) => (
    <TouchableOpacity style={styles.discoverCard}>
      <View style={styles.discoverAvatar}>
        <Text style={styles.avatarText}>
          {item.username.split('').slice(0, 2).join('').toUpperCase()}
        </Text>
      </View>
      <View style={styles.discoverInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
        <Text style={styles.friendUsername}>@{item.username}</Text>
        <View style={styles.discoverStats}>
          <Text style={styles.statText}>Level {item.level}</Text>
          <Text style={styles.statText}>•</Text>
          <Text style={styles.statText}>{item.adventures_completed} adventures</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => handleAddFriend(item.id)}
      >
        <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRequestCard = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestAvatar}>
        <Text style={styles.avatarText}>
          {item.sender.username.split('').slice(0, 2).join('').toUpperCase()}
        </Text>
      </View>
      <View style={styles.requestInfo}>
        <Text style={styles.friendName}>{item.sender.username}</Text>
        <Text style={styles.friendUsername}>@{item.sender.username}</Text>
        {item.message && (
          <Text style={styles.requestMessage}>"{item.message}"</Text>
        )}
        <Text style={styles.requestTime}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptRequest(item.id)}
        >
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => handleDeclineRequest(item.id)}
        >
          <Ionicons name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityAvatar}>
        <Text style={styles.avatarText}>
          {item.friend.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          <Text style={styles.friendName}>{item.friend.name}</Text> {item.details}
        </Text>
        <Text style={styles.activityTime}>{item.timestamp}</Text>
      </View>
      <View style={styles.activityIcon}>
        {item.action === 'completed_adventure' && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
        {item.action === 'earned_badge' && (
          <Ionicons name="trophy" size={24} color="#FFD700" />
        )}
        {item.action === 'leveled_up' && (
          <Ionicons name="trending-up" size={24} color="#FF6B9D" />
        )}
        {item.action === 'shared_memory' && (
          <Ionicons name="heart" size={24} color="#E91E63" />
        )}
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'friends':
        return (
          <View style={styles.tabContent}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6C757D" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends..."
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  handleSearchFriends(text);
                }}
                placeholderTextColor="#6C757D"
              />
            </View>
            <FlatList
              data={friends}
              renderItem={renderFriendCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
            />
          </View>
        );
      case 'discover':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Find Friends</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6C757D" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for friends..."
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  handleSearchFriends(text);
                }}
                placeholderTextColor="#6C757D"
              />
            </View>
            <FlatList
              data={discoverUsers}
              renderItem={renderDiscoverCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case 'requests':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
              Friend Requests ({friendRequests.length})
            </Text>
            {friendRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyTitle}>No pending requests</Text>
                <Text style={styles.emptyText}>
                  When someone sends you a friend request, it will appear here.
                </Text>
              </View>
            ) : (
              <FlatList
                data={friendRequests}
                renderItem={renderRequestCard}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        );
      case 'activity':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Friend Activity</Text>
            <FlatList
              data={activity}
              renderItem={renderActivityItem}
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
        colors={['#00B894', '#00A085', '#00CEC9']}
        style={styles.header}
      >
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.subtitle}>Connect with fellow adventurers</Text>
      </LinearGradient>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'friends' ? '#00B894' : '#6C757D'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'friends' && styles.activeTabText
          ]}>
            Friends
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => setActiveTab('discover')}
        >
          <Ionicons 
            name="compass" 
            size={20} 
            color={activeTab === 'discover' ? '#00B894' : '#6C757D'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'discover' && styles.activeTabText
          ]}>
            Discover
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Ionicons 
            name="person-add" 
            size={20} 
            color={activeTab === 'requests' ? '#00B894' : '#6C757D'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'requests' && styles.activeTabText
          ]}>
            Requests
          </Text>
          {friendRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{friendRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
          onPress={() => setActiveTab('activity')}
        >
          <Ionicons 
            name="pulse" 
            size={20} 
            color={activeTab === 'activity' ? '#00B894' : '#6C757D'} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'activity' && styles.activeTabText
          ]}>
            Activity
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
    paddingHorizontal: 16,
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
    paddingHorizontal: 8,
    borderRadius: 8,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#E8F5E8',
  },
  tabText: {
    fontSize: 12,
    color: '#6C757D',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#00B894',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: '#FF6B9D',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
  },
  friendCard: {
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
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00B894',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  friendStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statText: {
    fontSize: 12,
    color: '#6C757D',
    marginRight: 4,
  },
  lastActive: {
    fontSize: 12,
    color: '#6C757D',
  },

  discoverCard: {
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
  discoverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#74B9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  discoverInfo: {
    flex: 1,
  },
  discoverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#00B894',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestCard: {
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
  requestAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestMessage: {
    fontSize: 14,
    color: '#6C757D',
    fontStyle: 'italic',
    marginVertical: 4,
  },
  requestTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  requestActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  activityCard: {
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
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#74B9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  activityIcon: {
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
  },
});

