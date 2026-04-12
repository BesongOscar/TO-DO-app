import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "src/context/AuthContext";
import { settingsStyles } from "../styles/app/settings";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function Settings() {
  const router = useRouter();
  const { user, userProfile, logout, loading: authLoading, updateUserProfile, uploadProfilePhoto } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile?.name || "");
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/login");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to logout");
            }
          },
        },
      ]
    );
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
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
        const photoURL = await uploadProfilePhoto(result.assets[0].uri);
        await updateUserProfile(userProfile?.name || "", photoURL);
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
      await updateUserProfile(editedName.trim());
      setIsEditingName(false);
      Alert.alert("Success", "Name updated!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update name");
    }
  };

  if (authLoading) {
    return (
      <SafeAreaView style={settingsStyles.container}>
        <View style={settingsStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#0078d4" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={settingsStyles.container}>
      <View style={settingsStyles.header}>
        <Text style={settingsStyles.headerTitle}>Settings</Text>
      </View>

      <View style={settingsStyles.profileSection}>
        <TouchableOpacity 
          style={settingsStyles.avatarContainer} 
          onPress={handlePickImage}
          disabled={uploading}
        >
          {userProfile?.photoURL ? (
            <Image source={{ uri: userProfile.photoURL }} style={settingsStyles.avatar} />
          ) : (
            <View style={settingsStyles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
          )}
          <View style={settingsStyles.editAvatarBadge}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        {uploading && <Text style={settingsStyles.uploadingText}>Uploading...</Text>}
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
            <TouchableOpacity onPress={handleSaveName} style={settingsStyles.saveButton}>
              <Ionicons name="checkmark" size={24} color="#0078d4" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditingName(false)} style={settingsStyles.cancelButton}>
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
              {user?.email || "Not logged in"}
            </Text>
          </View>
        </View>
      </View>

      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={settingsStyles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#d32f2f" />
          <Text style={settingsStyles.menuText}>Logout</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={settingsStyles.footer}>
        <Text style={settingsStyles.footerText}>Todo App v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}