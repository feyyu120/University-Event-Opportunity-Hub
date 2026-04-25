import React, { useState, useRef } from 'react';
import { View, FlatList, Dimensions, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText, ThemedView } from './Themed';
import { Spacing, Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

export function Carousel({ items }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <View style={styles.cardContainer}>
      <ThemedView variant="element" style={styles.card}>
        <ThemedText style={styles.icon}>{item.icon}</ThemedText>
        <ThemedText type="subtitle" style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={styles.description}>{item.description}</ThemedText>
      </ThemedView>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setActiveIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.pagination}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? Colors[theme].primary : Colors[theme].backgroundSelected },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.four,
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: Spacing.four,
  },
  card: {
    padding: Spacing.four,
    borderRadius: 24,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  icon: {
    fontSize: 40,
    marginBottom: Spacing.two,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  description: {
    textAlign: 'center',
    opacity: 0.8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
