import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface SearchHighlightProps {
  text: string;
  query: string;
  style?: any;
}

export function SearchHighlight({ text, query, style }: SearchHighlightProps) {
  if (!query.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <Text style={style}>
      {parts.map((part, i) => (
        <Text
          key={i}
          style={part.toLowerCase() === query.toLowerCase() ? styles.highlight : undefined}
        >
          {part}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: '#fef08a', // Yellow highlight
    color: '#000',
  },
});
