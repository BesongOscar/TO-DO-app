import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router as expoRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useThemeStyles } from "../../hooks/useThemeStyles";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { createProfileStyles } from "../../styles/app/(protected)/profile";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { user, userProfile, logout, updateUserProfile, uploadProfilePhoto } =
    useAuth();
  const { theme, themeMode, setThemeMode } = useTheme();
  const styles = useThemeStyles(createProfileStyles);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile?.name || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEditingName) {
      setEditedName(userProfile?.name || "");
    }
  }, [userProfile?.name, isEditingName]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            expoRouter.dismissTo("/login");
          } catch (error: unknown) {
            Alert.alert("Error", error instanceof Error ? error.message : "Failed to logout");
          }
        },
      },
    ]);
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        setUploading(true);
        await uploadProfilePhoto(result.assets[0].uri);
        Alert.alert("Success", "Profile photo updated!");
      } catch (error: unknown) {
        Alert.alert("Error", error instanceof Error ? error.message : "Failed to upload photo");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    try {
      await updateUserProfile({ name: editedName.trim() });
      setIsEditingName(false);
      Alert.alert("Success", "Name updated!");
    } catch (error: unknown) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update name");
      console.error("Failed to update name:", error);
    }
  };

  if (!user) {
    return null;
  }

  const themeOptions: { mode: 'light' | 'dark' | 'system'; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { mode: 'light', icon: 'sunny', label: 'Light' },
    { mode: 'dark', icon: 'moon', label: 'Dark' },
    { mode: 'system', icon: 'settings-outline', label: 'System' },
  ] as const;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickImage}
            disabled={uploading}
          >
            {userProfile?.photoURL ? (
              <Image
                source={{ uri: userProfile.photoURL }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
            <View style={styles.editAvatarBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          {uploading && (
            <Text style={styles.uploadingText}>Uploading...</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeRow}>
          {themeOptions.map(({ mode, icon, label }) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.themeOption,
                themeMode === mode && styles.themeOptionActive,
              ]}
              onPress={() => setThemeMode(mode)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={icon}
                size={20}
                color={themeMode === mode ? theme.primary : theme.textSecondary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === mode && styles.themeOptionTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {isEditingName ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.editNameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor={theme.placeholderTextColor}
              autoFocus
            />
            <TouchableOpacity
              onPress={handleSaveName}
              style={styles.saveButton}
            >
              <Ionicons name="checkmark" size={24} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEditingName(false)}
              style={styles.cancelButton}
            >
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => {
              setEditedName(userProfile?.name || "");
              setIsEditingName(true);
            }}
          >
            <Ionicons name="person" size={24} color={theme.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>
                {userProfile?.name || "Add name"}
              </Text>
            </View>
            <Ionicons name="pencil" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="mail" size={24} color={theme.primary} />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {user.email || "Not logged in"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color={theme.error} />
          <Text style={styles.menuText}>Logout</Text>
          <Ionicons name="chevron-forward" size={24} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Todo App v1.0.0</Text>
      </View>
    </View>
  );
}
