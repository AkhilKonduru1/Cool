import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Memory {
  id: string;
  adventure: string | {
    title: string;
    description: string;
    emoji: string;
    estimatedTime: string;
    cost: string;
    location: string;
    tips: string[];
    category: string;
  };
  date: string;
  notes?: string;
  photos?: string[];
}

export default function MemoriesScreen() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const storedMemories = await AsyncStorage.getItem('adventureMemories');
      if (storedMemories) {
        setMemories(JSON.parse(storedMemories));
      }
    } catch (error) {
      console.error('Error loading memories:', error);
    }
  };

  const deleteMemory = async (id: string) => {
    const updatedMemories = memories.filter(memory => memory.id !== id);
    setMemories(updatedMemories);
    try {
      await AsyncStorage.setItem('adventureMemories', JSON.stringify(updatedMemories));
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#74B9FF', '#0984E3', '#6C5CE7']}
        style={styles.header}
      >
        <Text style={styles.title}>💾 Memory Capsule</Text>
        <Text style={styles.subtitle}>Your adventure scrapbook</Text>
      </LinearGradient>

      <View style={styles.content}>
        {memories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📸</Text>
            <Text style={styles.emptyTitle}>No memories yet!</Text>
            <Text style={styles.emptyText}>
              Complete some adventures to start building your memory capsule. 
              Each adventure you save will appear here as a special memory!
            </Text>
            <TouchableOpacity style={styles.startAdventureButton}>
              <Text style={styles.startAdventureText}>🎯 Start Your First Adventure</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.memoriesGrid}>
            {memories.map((memory) => (
              <TouchableOpacity
                key={memory.id}
                style={styles.memoryCard}
                onPress={() => setSelectedMemory(memory)}
              >
                <LinearGradient
                  colors={['#FF6B9D', '#C44569']}
                  style={styles.memoryGradient}
                >
                  <View style={styles.memoryHeader}>
                    <Text style={styles.memoryDate}>{memory.date}</Text>
                    <TouchableOpacity onPress={() => deleteMemory(memory.id)}>
                      <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.memoryAdventure} numberOfLines={3}>
                    {typeof memory.adventure === 'string' 
                      ? memory.adventure 
                      : `${memory.adventure.emoji} ${memory.adventure.title}`
                    }
                  </Text>
                  {memory.notes && (
                    <View style={styles.notesPreview}>
                      <Ionicons name="create-outline" size={12} color="#FFFFFF" />
                      <Text style={styles.notesPreviewText} numberOfLines={1}>
                        {memory.notes}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {memories.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{memories.length}</Text>
              <Text style={styles.statLabel}>Adventures</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {memories.filter(m => m.notes).length}
              </Text>
              <Text style={styles.statLabel}>With Notes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {new Set(memories.map(m => m.date)).size}
              </Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    padding: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  startAdventureButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  startAdventureText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  memoryCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  memoryGradient: {
    padding: 16,
    minHeight: 120,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memoryDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
  memoryAdventure: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 8,
  },
  notesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  notesPreviewText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
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
    color: '#FF6B9D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
});