import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Dimensions, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from './Themed';
import { Spacing, Colors, Typography } from '@/constants/theme';
import { nf, ms, vs } from '@/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - (Spacing.four * 2);

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

export function Carousel({ items }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const theme  = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[theme];

  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * CARD_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, items.length]);

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <View style={styles.cardContainer}>
      <ThemedView variant="element" style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: (item.iconColor || colors.primary) + '15' }]}>
          <Ionicons name={item.icon} size={nf(44)} color={item.iconColor || colors.primary} />
        </View>
        <ThemedText type="title" style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={styles.description} numberOfLines={3}>{item.description}</ThemedText>
      </ThemedView>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          if (index !== activeIndex) setActiveIndex(index);
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
    marginTop: Spacing.four,
    marginBottom: Spacing.one,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  card: {
    padding: Spacing.six,
    borderRadius: ms(32),
    minHeight: vs(320),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.two,
    fontSize: Typography.h3,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: Typography.body,
    lineHeight: Typography.body * 1.5,
    paddingHorizontal: Spacing.two,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
});
