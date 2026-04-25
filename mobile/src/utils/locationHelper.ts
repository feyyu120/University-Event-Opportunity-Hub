import { Linking, Platform } from 'react-native';

export function openInExternalMaps(buildingName: string) {
  const query = encodeURIComponent(buildingName);
  const url = Platform.select({
    ios: `maps:0,0?q=${query}`,
    android: `geo:0,0?q=${query}`,
    default: `https://www.google.com/maps/search/?api=1&query=${query}`,
  });

  Linking.openURL(url).catch(err => console.error('Error opening maps', err));
}

export interface BuildingLocation {
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

const CAMPUS_LOCATIONS: Record<string, BuildingLocation> = {
  'Google Building 43': { name: 'Building 43', x: 45, y: 30 },
  'Student Union': { name: 'Student Union', x: 20, y: 60 },
  'Physics Dept': { name: 'Physics Building', x: 70, y: 40 },
  'Career Center': { name: 'Career Center', x: 55, y: 75 },
};

export function getBuildingLocation(name: string): BuildingLocation | null {
  // Check partial match
  const key = Object.keys(CAMPUS_LOCATIONS).find(k => name.includes(k));
  return key ? CAMPUS_LOCATIONS[key] : null;
}
