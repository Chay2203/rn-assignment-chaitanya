import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import CounterDisplay from '../components/CounterDisplay';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Home = () => {
  const [count, setCount] = useState(0);

  const incrementScale = useRef(new Animated.Value(1)).current;
  const decrementScale = useRef(new Animated.Value(1)).current;
  const incrementRotate = useRef(new Animated.Value(0)).current;
  const decrementRotate = useRef(new Animated.Value(0)).current;
  const resetScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scaleAnim, rotateAnim, direction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.85,
          friction: 3,
          tension: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: direction,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(rotateAnim, {
          toValue: 0,
          friction: 3,
          tension: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const increment = () => {
    animateButton(incrementScale, incrementRotate, 1);
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    animateButton(decrementScale, decrementRotate, -1);
    setCount((prev) => prev - 1);
  };

  const reset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(resetScale, {
        toValue: 0.9,
        friction: 3,
        tension: 400,
        useNativeDriver: true,
      }),
      Animated.spring(resetScale, {
        toValue: 1,
        friction: 3,
        tension: 400,
        useNativeDriver: true,
      }),
    ]).start();
    setCount(0);
  };

  const incrementRotation = incrementRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const decrementRotation = decrementRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Counter</Text>
        <Text style={styles.subtitle}>TAP TO COUNT</Text>

        <View style={styles.counterContainer}>
          <View style={styles.counterCard}>
            <CounterDisplay count={count} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedTouchable
            style={[
              styles.button,
              styles.decrementButton,
              {
                transform: [
                  { scale: decrementScale },
                  { rotate: decrementRotation },
                ],
              },
            ]}
            onPress={decrement}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>−</Text>
          </AnimatedTouchable>

          <AnimatedTouchable
            style={[
              styles.resetButton,
              { transform: [{ scale: resetScale }] },
            ]}
            onPress={reset}
            activeOpacity={0.8}
          >
            <Text style={styles.resetText}>Reset</Text>
          </AnimatedTouchable>

          <AnimatedTouchable
            style={[
              styles.button,
              styles.incrementButton,
              {
                transform: [
                  { scale: incrementScale },
                  { rotate: incrementRotation },
                ],
              },
            ]}
            onPress={increment}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>+</Text>
          </AnimatedTouchable>
        </View>

        <View style={styles.indicatorContainer}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                Math.abs(count) > i && (count > 0 ? styles.indicatorPositive : styles.indicatorNegative),
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 52,
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 12,
    letterSpacing: 6,
  },
  counterContainer: {
    marginVertical: 60,
  },
  counterCard: {
    paddingHorizontal: 70,
    paddingVertical: 50,
    borderRadius: 40,
    backgroundColor: '#13131a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  incrementButton: {
    backgroundColor: '#6c5ce7',
    shadowColor: '#6c5ce7',
  },
  decrementButton: {
    backgroundColor: '#ff6b6b',
    shadowColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
  resetButton: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resetText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 60,
    gap: 10,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  indicatorPositive: {
    backgroundColor: '#6c5ce7',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  indicatorNegative: {
    backgroundColor: '#ff6b6b',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});

export default Home;
