import { AIService } from '@/services/aiService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const { width } = Dimensions.get('window'); // Unused for now

// Adventure Spinner Component
interface AdventureSpinnerProps {
  onAdventureGenerated: (adventure: any) => void;
  userLocation?: { latitude: number; longitude: number; address: string };
  resetTrigger?: number;
}

const MOODS = [
  { id: 'chill', emoji: '😌', label: 'Chill' },
  { id: 'funny', emoji: '😂', label: 'Funny' },
  { id: 'active', emoji: '🏃‍♀️', label: 'Active' },
  { id: 'creative', emoji: '🎨', label: 'Creative' },
];

const TIME_OPTIONS = [
  { id: '15', label: '15 min' },
  { id: '30', label: '30 min' },
  { id: '60', label: '1 hour' },
  { id: '120', label: '2+ hours' },
];

const BUDGET_OPTIONS = [
  { id: 'free', label: 'Free' },
  { id: '5', label: '$5' },
  { id: '10', label: '$10' },
  { id: '20', label: '$20+' },
];

export function AdventureSpinner({ onAdventureGenerated, userLocation, resetTrigger }: AdventureSpinnerProps) {
  const [selectedMood, setSelectedMood] = useState<'chill' | 'funny' | 'active' | 'creative' | ''>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    if (resetTrigger !== undefined) {
      setSelectedMood('');
      setSelectedTime('');
      setSelectedBudget('');
      setIsSpinning(false);
      spinValue.setValue(0);
    }
  }, [resetTrigger]);

  const handleSpin = async () => {
    if (!selectedMood || !selectedTime || !selectedBudget) {
      Alert.alert('Missing Info', 'Please select your mood, time, and budget preferences!');
      return;
    }

    setIsSpinning(true);

    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      { iterations: 3 }
    );

    spinAnimation.start();

    try {
      const location = userLocation?.address || 'your current location';
      const adventure = await AIService.generateAdventures({
        location,
        mood: selectedMood,
        time: selectedTime,
        budget: selectedBudget,
      });

      setTimeout(() => {
        spinAnimation.stop();
        setIsSpinning(false);
        onAdventureGenerated(adventure);
      }, 3000);
    } catch (error) {
      console.error('Adventure generation failed:', error);
      spinAnimation.stop();
      setIsSpinning(false);
      Alert.alert('Oops!', 'Failed to generate adventure. Please try again.');
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.spinnerContainer}>
      <LinearGradient
        colors={['#FF6B9D', '#C44569', '#8E44AD']}
        style={styles.header}
      >
        <Text style={styles.title}>Adventure Spinner</Text>
        <Text style={styles.subtitle}>Let AI craft your perfect adventure</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.optionsGrid}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.optionButton,
                  selectedMood === mood.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedMood(mood.id as any)}
              >
                <Text style={styles.optionEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.optionLabel,
                  selectedMood === mood.id && styles.selectedOptionText,
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How much time do you have?</Text>
          <View style={styles.optionsRow}>
            {TIME_OPTIONS.map((time) => (
              <TouchableOpacity
                key={time.id}
                style={[
                  styles.timeButton,
                  selectedTime === time.id && styles.selectedTimeButton,
                ]}
                onPress={() => setSelectedTime(time.id)}
              >
                <Text style={[
                  styles.timeButtonText,
                  selectedTime === time.id && styles.selectedTimeButtonText,
                ]}>
                  {time.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's your budget?</Text>
          <View style={styles.optionsRow}>
            {BUDGET_OPTIONS.map((budget) => (
              <TouchableOpacity
                key={budget.id}
                style={[
                  styles.budgetButton,
                  selectedBudget === budget.id && styles.selectedBudgetButton,
                ]}
                onPress={() => setSelectedBudget(budget.id)}
              >
                <Text style={[
                  styles.budgetButtonText,
                  selectedBudget === budget.id && styles.selectedBudgetButtonText,
                ]}>
                  {budget.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.spinButton, isSpinning && styles.spinningButton]}
          onPress={handleSpin}
          disabled={isSpinning}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.spinButtonText}>
            {isSpinning ? 'AI is crafting your adventure...' : 'Spin for Adventure!'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Adventure Result Component
interface AdventureResultProps {
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
  onSaveToMemory: (adventure: any) => void;
  onGetDirections: () => void;
  onShare?: () => void;
  onNewAdventure?: () => void;
}

export function AdventureResult({ adventure, onSaveToMemory, onGetDirections, onShare, onNewAdventure }: AdventureResultProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSave = () => {
    onSaveToMemory(adventure);
    setIsSaved(true);
    Alert.alert('Saved! 💾', 'Your adventure has been added to your memory capsule!');
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      Alert.alert('Share Adventure', 'Sharing feature coming soon!');
    }
  };

  const handleNewAdventure = () => {
    if (onNewAdventure) {
      onNewAdventure();
    }
  };

  if (typeof adventure === 'string') {
    return (
      <Animated.View style={[styles.resultContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <LinearGradient
          colors={['#00B894', '#00A085', '#00CEC9']}
          style={styles.resultHeader}
        >
          <Text style={styles.resultTitle}>Your Adventure</Text>
        </LinearGradient>
        <View style={styles.resultContent}>
          <Text style={styles.adventureText}>{adventure}</Text>
          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons name="bookmark-outline" size={20} color="#00B894" />
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#00B894" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleNewAdventure}>
              <Ionicons name="refresh-outline" size={20} color="#00B894" />
              <Text style={styles.actionButtonText}>New</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.resultContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <LinearGradient
        colors={['#00B894', '#00A085', '#00CEC9']}
        style={styles.resultHeader}
      >
        <Text style={styles.resultEmoji}>{adventure.emoji}</Text>
        <Text style={styles.resultTitle}>{adventure.title}</Text>
        <Text style={styles.resultCategory}>{adventure.category}</Text>
      </LinearGradient>

      <View style={styles.resultContent}>
        <Text style={styles.resultDescription}>{adventure.description}</Text>

        <View style={styles.resultDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#00B894" />
            <Text style={styles.detailText}>{adventure.estimatedTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={20} color="#00B894" />
            <Text style={styles.detailText}>{adventure.cost}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#00B894" />
            <Text style={styles.detailText}>{adventure.location}</Text>
          </View>
        </View>

        {adventure.tips && adventure.tips.length > 0 && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Pro Tips</Text>
            {adventure.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.resultActions}>
          <TouchableOpacity 
            style={[styles.primaryButton, isSaved && styles.savedButton]} 
            onPress={handleSave}
            disabled={isSaved}
          >
            <Ionicons name={isSaved ? "checkmark" : "bookmark-outline"} size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>
              {isSaved ? 'Saved!' : 'Save to Memory'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onGetDirections}>
              <Ionicons name="navigate-outline" size={20} color="#00B894" />
              <Text style={styles.secondaryButtonText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#00B894" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleNewAdventure}>
              <Ionicons name="refresh-outline" size={20} color="#00B894" />
              <Text style={styles.secondaryButtonText}>New</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Adventure Spinner Styles
  spinnerContainer: {
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
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: '#FF6B9D',
    transform: [{ scale: 1.05 }],
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTimeButton: {
    backgroundColor: '#FF6B9D',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  selectedTimeButtonText: {
    color: '#FFFFFF',
  },
  budgetButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedBudgetButton: {
    backgroundColor: '#FF6B9D',
  },
  budgetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  selectedBudgetButtonText: {
    color: '#FFFFFF',
  },
  spinButton: {
    backgroundColor: '#FF6B9D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  spinningButton: {
    backgroundColor: '#C44569',
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },

  // Adventure Result Styles
  resultContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  resultHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultCategory: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  resultContent: {
    flex: 1,
    padding: 20,
  },
  resultDescription: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  resultDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#2D3436',
    marginLeft: 12,
    flex: 1,
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#00B894',
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: '#2D3436',
    flex: 1,
    lineHeight: 20,
  },
  resultActions: {
    marginTop: 'auto',
  },
  primaryButton: {
    backgroundColor: '#00B894',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  savedButton: {
    backgroundColor: '#4CAF50',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#00B894',
  },
  secondaryButtonText: {
    color: '#00B894',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#00B894',
  },
  actionButtonText: {
    color: '#00B894',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  adventureText: {
    fontSize: 18,
    color: '#2D3436',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 24,
  },
});

