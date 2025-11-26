import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';

const CounterDisplay = ({ count }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [prevCount, setPrevCount] = useState(count);
  const [displayCount, setDisplayCount] = useState(count);

  useEffect(() => {
    if (count === prevCount) return;

    const isIncrement = count > prevCount;
    const direction = isIncrement ? -1 : 1;

    // Animate out
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: direction * 30,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDisplayCount(count);
      translateY.setValue(-direction * 30);

      // Animate in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    setPrevCount(count);
  }, [count]);

  const getColor = () => {
    if (displayCount > 0) return '#6c5ce7';
    if (displayCount < 0) return '#ff6b6b';
    return '#ffffff';
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.counterText,
          {
            color: getColor(),
            transform: [{ translateY }, { scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {displayCount}
      </Animated.Text>
      <Text style={styles.label}>
        {displayCount === 0 ? 'zero' : displayCount === 1 || displayCount === -1 ? 'one' : 'count'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  counterText: {
    fontSize: 88,
    fontWeight: '200',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
    marginTop: 8,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});

export default CounterDisplay;
