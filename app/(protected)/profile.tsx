import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router as expoRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useThemeStyles } from "../../src/hooks/useThemeStyles";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { createProfileStyles } from "../../styles/app/(protected)/profile";
import { useTranslation } from "react-i18next";
import { changeLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/src/i18n";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { user, userProfile, logout, updateUserProfile, uploadProfilePhoto } =
    useAuth();
  const { t, i18n } = useTranslation();
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
    Alert.alert(t("profile.logout"), t("profile.logout_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.logout"),
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            expoRouter.dismissTo("/login");
          } catch (error: unknown) {
            Alert.alert(
              t("errors.something_wrong"),
              error instanceof Error ? error.message : t("errors.try_again"),
            );
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
        Alert.alert(t("profile.photo_updated"));
      } catch (error: unknown) {
        Alert.alert(
          t("errors.something_wrong"),
          error instanceof Error ? error.message : "Failed to upload photo",
        );
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      Alert.alert(t("errors.something_wrong"), t("profile.name_empty"));
      return;
    }

    try {
      await updateUserProfile({ name: editedName.trim() });
      setIsEditingName(false);
      Alert.alert(t("profile.name_updated"));
    } catch (error: unknown) {
      Alert.alert(
        t("errors.something_wrong"),
        error instanceof Error ? error.message : "Failed to update name",
      );
      console.error("Failed to update name:", error);
    }
  };

  const handleLanguageChange = async (code: LanguageCode) => {
    await changeLanguage(code);
    // i18next triggers a re-render automatically via react-i18next
  };

  if (!user) {
    return null;
  }

  const themeOptions: {
    mode: "light" | "dark" | "system";
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
  }[] = [
    { mode: "light", icon: "sunny", label: t("profile.theme_light") },
    { mode: "dark", icon: "moon", label: t("profile.theme_dark") },
    { mode: "system", icon: "settings-outline", label: t("profile.theme_system") },
  ] as const;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("profile.title")}</Text>
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
          {uploading && <Text style={styles.uploadingText}>{t("profile.uploading")}</Text>}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
      

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.account")}</Text>

        {isEditingName ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.editNameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder={t("profile.add_name")}
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
              <Text style={styles.infoLabel}>{t("profile.name")}</Text>
              <Text style={styles.infoValue}>
                {userProfile?.name || t("profile.add_name")}
              </Text>
            </View>
            <Ionicons name="pencil" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="mail" size={24} color={theme.primary} />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>{t("profile.email")}</Text>
            <Text style={styles.infoValue}>
              {user.email || "Not logged in"}
            </Text>
          </View>
        </View>
      </View>

      {/* Theme */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.appearance")}</Text>
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

        {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.language")}</Text>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.menuItem}
            onPress={() => handleLanguageChange(lang.code)}
          >
            <Text style={{ flex: 1, fontSize: 16, color: theme.text }}>
              {lang.label}
            </Text>
            {i18n.language === lang.code && (
              <Ionicons name="checkmark" size={20} color={theme.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.actions")}</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color={theme.error} />
          <Text style={styles.menuText}>{t("profile.logout")}</Text>
          <Ionicons name="chevron-forward" size={24} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("profile.version")}</Text>
      </View>
      </ScrollView>
    </View>
  );
}
