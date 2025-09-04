import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

interface LocationInputProps {
  onLocationSet: (location: { latitude: number; longitude: number; address: string }) => void;
}

export default function LocationInput({ onLocationSet }: LocationInputProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          'Location Permission',
          'Location access is needed to suggest nearby adventures. You can still enter your location manually.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(location);
      
      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (addresses.length > 0) {
        const addr = addresses[0];
        const formattedAddress = `${addr.city || ''}${addr.city && addr.region ? ', ' : ''}${addr.region || ''}`;
        setAddress(formattedAddress);
        onLocationSet({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: formattedAddress,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location. Please enter it manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLocation = () => {
    if (address.trim()) {
      // For demo purposes, we'll use a default location
      // In a real app, you'd use a geocoding service
      const defaultLocation = {
        latitude: 37.7749,
        longitude: -122.4194,
        address: address.trim(),
      };
      onLocationSet(defaultLocation);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Set Your Location</Text>
      <Text style={styles.subtitle}>We'll suggest adventures near you!</Text>
      
      <View style={styles.locationCard}>
        {permissionGranted && location ? (
          <View style={styles.currentLocation}>
            <Ionicons name="location" size={24} color="#74B9FF" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Current Location</Text>
              <Text style={styles.locationAddress}>{address || 'Getting address...'}</Text>
            </View>
            <TouchableOpacity onPress={getCurrentLocation} disabled={isLoading}>
              <Ionicons 
                name="refresh" 
                size={20} 
                color={isLoading ? "#CCC" : "#74B9FF"} 
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.manualLocation}>
            <Ionicons name="search" size={24} color="#74B9FF" />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your city or address..."
              value={address}
              onChangeText={setAddress}
              onSubmitEditing={handleManualLocation}
            />
            <TouchableOpacity 
              style={styles.setButton}
              onPress={handleManualLocation}
              disabled={!address.trim()}
            >
              <Text style={styles.setButtonText}>Set</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!permissionGranted && (
        <TouchableOpacity style={styles.permissionButton} onPress={requestLocationPermission}>
          <Ionicons name="location-outline" size={20} color="#FFFFFF" />
          <Text style={styles.permissionButtonText}>Enable Location Access</Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2D3436',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6C757D',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    color: '#6C757D',
  },
  manualLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#2D3436',
    paddingVertical: 8,
  },
  setButton: {
    backgroundColor: '#74B9FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  setButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  permissionButton: {
    backgroundColor: '#FF6B9D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    color: '#6C757D',
    fontSize: 14,
  },
});


