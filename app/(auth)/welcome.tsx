/**
 * OnboardingScreen - First-launch walkthrough (3 slides + CTA)
 *
 * Shown once per install via AsyncStorage key "onboarding_complete".
 * After "Get Started" or "Skip", the key is written and the screen
 * never shows again.

 * On completion -> navigates to /signup
 */

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { welcomeStyles as styles } from "../../styles/app/(auth)/welcome";


const { width: SCREEN_WIDTH } = Dimensions.get("window");
/**
 * AsyncStorage key written when onboarding is completed or skipped.
 * app/index.tsx reads this to decide whether to show onboarding.
 */
export const ONBOARDING_KEY = "onboarding_complete";

//Slide Data
interface Slide {
  id: string;
  emoji: string;
  title: string;
  body: string;
  accent: string; // per-slide accent color for the emoji backdrop
}

const SLIDES: Slide[] = [
  {
    id: "1",
    emoji: "⚡",
    title: "Get things done",
    body: "A todo app built for people who actually want to finish what they start.",
    accent: "#1a3a6e",
  },
  {
    id: "2",
    emoji: "🗂️",
    title: "Organize without overthinking",
    body: "Smart lists that adapt to how you work, not the other way around.",
    accent: "#1a3a6e",
  },
  {
    id: "3",
    emoji: "🚀",
    title: "Stay ahead of your day",
    body: "Planned tasks, morning reminders, and daily focus — all in one tap.",
    accent: "#1a3a6e",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  /** Mark onboarding done in AsyncStorage then navigate to signup. */
  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/signup");
  };

  /** Advance to the next slide, or finish if on the last one. */
  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    } else {
      finish();
    }
  };

  /** Skip straight to signup without advancing through all slides. */
  const handleSkip = () => finish();

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      {/* Emoji illustration with circular backdrop */}
      <View style={[styles.emojiContainer, { backgroundColor: item.accent }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Skip button — top right */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // controlled programmatically via Next button
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* Dot indicators */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, i) => {
          // Interpolate width so the active dot is wider (pill shape)
          const dotWidth = scrollX.interpolate({
            inputRange: [
              (i - 1) * SCREEN_WIDTH,
              i * SCREEN_WIDTH,
              (i + 1) * SCREEN_WIDTH,
            ],
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange: [
              (i - 1) * SCREEN_WIDTH,
              i * SCREEN_WIDTH,
              (i + 1) * SCREEN_WIDTH,
            ],
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      {/* Get Started button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}