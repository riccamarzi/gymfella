import React, { useState, PropsWithChildren, useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, useAnimatedValue, LayoutChangeEvent, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Assicurati di importare i tuoi componenti tematici
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

export function Collapsible({ children, title, onToggle }: PropsWithChildren & { title: string; onToggle?: (isOpen: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null); // Altezza dinamica
  const theme = useColorScheme() ?? 'dark';

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onToggle) onToggle(newIsOpen);
  };

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <ThemedText type="subtitle">{title}</ThemedText>
      </TouchableOpacity>
      <View style={[styles.content, { height: isOpen ? contentHeight : 0 }]}>
        {React.cloneElement(children as React.ReactElement, {
          onHeightChange: setContentHeight, // Passa il callback a `ExerciseList`
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 16,
  },
  content: {
    overflow: 'hidden',
  },
});