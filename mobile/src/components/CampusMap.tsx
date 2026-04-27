import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from './Themed';
import { Spacing } from '@/constants/theme';
import { BuildingLocation, openInExternalMaps } from '@/utils/locationHelper';

const { width } = Dimensions.get('window');

interface CampusMapProps {
  locations: BuildingLocation[];
  fullLocationName: string;
}

export function CampusMap({ locations, fullLocationName }: CampusMapProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>Campus Location</ThemedText>
      
      <View style={styles.mapWrapper}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1590483736622-39da8caf3501?auto=format&fit=crop&q=80&w=1000' }} 
          style={styles.mapImage}
          resizeMode="cover"
        />
        {locations.map((loc, i) => (
          <View 
            key={i} 
            style={[styles.pinContainer, { left: `${loc.x}%`, top: `${loc.y}%` }]}
          >
            <View style={styles.pin}>
              <Ionicons name="location" size={20} color="#EF4444" />
            </View>
            <View style={styles.label}>
              <ThemedText style={styles.labelText}>{loc.name}</ThemedText>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.externalBtn} 
        onPress={() => openInExternalMaps(fullLocationName)}
      >
        <ThemedText style={styles.externalBtnText}>Open in Google Maps</ThemedText>
        <Ionicons name="open-outline" size={16} color="rgba(0,0,0,0.6)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.four,
    marginBottom: Spacing.six,
  },
  title: {
    marginBottom: Spacing.three,
  },
  mapWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -10, // center pin
    marginTop: -30, // adjust for pin bottom
  },
  pin: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },
  externalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.three,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  externalBtnText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
});
