import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  PanResponder,
  Keyboard,
} from "react-native";
import { bottomSheetStyles } from "../../styles/components/Index/BottomSheet";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = Math.min(400, SCREEN_HEIGHT * 0.6);

const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children }) => {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  if (!visible) return null;

  return (
    <View style={bottomSheetStyles.container}>
      <TouchableWithoutFeedback onPress={closeSheet}>
        <Animated.View style={[bottomSheetStyles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          bottomSheetStyles.sheet,
          { transform: [{ translateY }] },
        ]}
      >
        <View {...panResponder.panHandlers} style={bottomSheetStyles.handleContainer}>
          <View style={bottomSheetStyles.handle} />
        </View>
        <View style={bottomSheetStyles.content}>{children}</View>
      </Animated.View>
    </View>
  );
};

export default BottomSheet;
