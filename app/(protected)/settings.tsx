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
import ArrowBack from "@/components/arrowBack";
import { settingsStyles } from "../../styles/app/settings";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { user, userProfile, logout, updateUserProfile, uploadProfilePhoto } =
    useAuth();
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
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to logout");
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
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to upload photo");
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
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update name");
      console.error("Failed to update name:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={[settingsStyles.container, { paddingBottom: insets.bottom }]}>
      <View style={{ backgroundColor: "#0078d4", paddingTop: insets.top }}>
        <View style={settingsStyles.header}>
          <ArrowBack color="#fff" />
          <Text style={settingsStyles.headerTitle}>Settings</Text>
        </View>

        <View style={settingsStyles.profileSection}>
          <TouchableOpacity
            style={settingsStyles.avatarContainer}
            onPress={handlePickImage}
            disabled={uploading}
          >
            {userProfile?.photoURL ? (
              <Image
                source={{ uri: userProfile.photoURL }}
                style={settingsStyles.avatar}
              />
            ) : (
              <View style={settingsStyles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
            <View style={settingsStyles.editAvatarBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          {uploading && (
            <Text style={settingsStyles.uploadingText}>Uploading...</Text>
          )}
        </View>
      </View>

      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Account</Text>

        {isEditingName ? (
          <View style={settingsStyles.editNameContainer}>
            <TextInput
              style={settingsStyles.editNameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              autoFocus
            />
            <TouchableOpacity
              onPress={handleSaveName}
              style={settingsStyles.saveButton}
            >
              <Ionicons name="checkmark" size={24} color="#0078d4" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEditingName(false)}
              style={settingsStyles.cancelButton}
            >
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={settingsStyles.infoRow}
            onPress={() => {
              setEditedName(userProfile?.name || "");
              setIsEditingName(true);
            }}
          >
            <Ionicons name="person" size={24} color="#0078d4" />
            <View style={settingsStyles.infoText}>
              <Text style={settingsStyles.infoLabel}>Name</Text>
              <Text style={settingsStyles.infoValue}>
                {userProfile?.name || "Add name"}
              </Text>
            </View>
            <Ionicons name="pencil" size={20} color="#999" />
          </TouchableOpacity>
        )}

        <View style={settingsStyles.infoRow}>
          <Ionicons name="mail" size={24} color="#0078d4" />
          <View style={settingsStyles.infoText}>
            <Text style={settingsStyles.infoLabel}>Email</Text>
            <Text style={settingsStyles.infoValue}>
              {user.email || "Not logged in"}
            </Text>
          </View>
        </View>
      </View>

      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Actions</Text>

        <TouchableOpacity
          style={settingsStyles.menuItem}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="#d32f2f" />
          <Text style={settingsStyles.menuText}>Logout</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={settingsStyles.footer}>
        <Text style={settingsStyles.footerText}>Todo App v1.0.0</Text>
      </View>
    </View>
  );
}
