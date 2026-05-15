/**
 * AnimatedSplash - Animated logo screen shown after the native splash dismisses
 *
 * Sequence:
 *   1. App blue background fills the screen instantly
 *   2. Logo fades in + scales up (spring)
 *   3. Short hold (800ms)
 *   4. Whole screen fades out
 *   5. onFinish() is called → app hands off to index.tsx routing
 *
 * Usage:
 *   <AnimatedSplash onFinish={() => setShowSplash(false)} />
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LOGO_SIZE = SCREEN_WIDTH * 0.4; // 40% of screen width

interface AnimatedSplashProps {
  onFinish: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Logo fades in + springs up to full size
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),

      // 2. Hold for 800ms so user can see the logo
      Animated.delay(800),

      // 3. Whole screen fades out
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 4. Hand off to the app
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.Image
        source={require("../assets/icon.png")}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // covers the entire screen
    backgroundColor: "#0078d4",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // sits above everything else
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2, // circular crop, remove if you prefer square
  },
});

export default AnimatedSplash;