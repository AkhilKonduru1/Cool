import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Themed Text Component
interface ThemedTextProps {
  children: React.ReactNode;
  style?: any;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

export function ThemedText({ children, style, type = 'default' }: ThemedTextProps) {
  const textStyle = [styles.text, styles[`text_${type}`], style];
  return <Text style={textStyle}>{children}</Text>;
}

// Themed View Component
interface ThemedViewProps {
  children: React.ReactNode;
  style?: any;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView({ children, style, lightColor, darkColor }: ThemedViewProps) {
  const backgroundColor = lightColor || '#FFFFFF';
  return <View style={[styles.container, { backgroundColor }, style]}>{children}</View>;
}

// Collapsible Component
interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Collapsible({ title, children, isOpen = false, onToggle }: CollapsibleProps) {
  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity style={styles.collapsibleHeader} onPress={onToggle}>
        <Text style={styles.collapsibleTitle}>{title}</Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6C757D" 
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.collapsibleContent}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Themed Text Styles
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  text_default: {
    color: '#2D3436',
  },
  text_title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  text_defaultSemiBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  text_subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3436',
  },
  text_link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },

  // Themed View Styles
  container: {
    flex: 1,
  },

  // Collapsible Styles
  collapsibleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  collapsibleContent: {
    padding: 16,
    paddingTop: 0,
  },
});

