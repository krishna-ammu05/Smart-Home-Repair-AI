import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { storage } from "@/utils/storage";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

interface SettingsItem {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const { user, logout, updateUser, isLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Error", "Failed to log out");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Deletion",
              "All your data will be permanently deleted. This cannot be undone.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Forever",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await storage.clearAll();
                      await logout();
                    } catch (error) {
                      Alert.alert("Error", "Failed to delete account");
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear App Data",
      "This will clear all your repair history, bookings, and fault reports. Your account will remain.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            try {
              const currentUser = user;
              await storage.clearAll();
              if (currentUser) {
                await storage.setUser(currentUser);
              }
              Alert.alert("Success", "App data has been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: "Account",
      items: [
        {
          id: "email",
          icon: "mail",
          title: "Email",
          subtitle: user?.email,
        },
        {
          id: "edit",
          icon: "edit-2",
          title: "Edit Profile",
          onPress: () => setIsEditing(true),
          showArrow: true,
        },
      ],
    },
    {
      title: "App Settings",
      items: [
        {
          id: "notifications",
          icon: "bell",
          title: "Notifications",
          subtitle: "Manage notification preferences",
          showArrow: true,
        },
        {
          id: "privacy",
          icon: "shield",
          title: "Privacy",
          subtitle: "Data and privacy settings",
          showArrow: true,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          id: "help",
          icon: "help-circle",
          title: "Help Center",
          showArrow: true,
        },
        {
          id: "about",
          icon: "info",
          title: "About",
          subtitle: "Version 1.0.0",
          showArrow: true,
        },
      ],
    },
    {
      title: "Danger Zone",
      items: [
        {
          id: "clear",
          icon: "trash-2",
          title: "Clear App Data",
          onPress: handleClearData,
          danger: true,
        },
        {
          id: "delete",
          icon: "user-x",
          title: "Delete Account",
          onPress: handleDeleteAccount,
          danger: true,
        },
      ],
    },
  ];

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.backgroundDefault,
      color: theme.text,
    },
  ];

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.profileHeader}>
        <View
          style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
        >
          <ThemedText type="h1" style={{ color: theme.primary }}>
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </ThemedText>
        </View>
        <ThemedText type="h2" style={styles.userName}>
          {user?.name || "User"}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {user?.email}
        </ThemedText>
      </View>

      {isEditing ? (
        <View style={styles.editSection}>
          <ThemedText type="h4" style={styles.editTitle}>
            Edit Profile
          </ThemedText>

          <View style={styles.fieldContainer}>
            <ThemedText
              type="small"
              style={[styles.label, { color: theme.textSecondary }]}
            >
              Name
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <ThemedText
              type="small"
              style={[styles.label, { color: theme.textSecondary }]}
            >
              Phone
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={phone}
              onChangeText={setPhone}
              placeholder="Your phone number"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <ThemedText
              type="small"
              style={[styles.label, { color: theme.textSecondary }]}
            >
              Default Address
            </ThemedText>
            <TextInput
              style={[inputStyle, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Your default service address"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.editButtons}>
            <Pressable
              style={[
                styles.cancelButton,
                { backgroundColor: theme.backgroundDefault },
              ]}
              onPress={() => {
                setName(user?.name || "");
                setPhone(user?.phone || "");
                setAddress(user?.address || "");
                setIsEditing(false);
              }}
            >
              <ThemedText type="body">Cancel</ThemedText>
            </Pressable>
            <Button
              onPress={handleSaveProfile}
              disabled={isSaving}
              style={styles.saveButton}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.settingsContainer}>
          {settingsSections.map((section) => (
            <View key={section.title} style={styles.settingsSection}>
              <ThemedText
                type="small"
                style={[styles.sectionTitle, { color: theme.textSecondary }]}
              >
                {section.title}
              </ThemedText>
              <View
                style={[
                  styles.settingsGroup,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                {section.items.map((item, index) => (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.settingsItem,
                      index < section.items.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: theme.border,
                      },
                      { opacity: pressed && item.onPress ? 0.7 : 1 },
                    ]}
                    onPress={item.onPress}
                    disabled={!item.onPress}
                  >
                    <View
                      style={[
                        styles.settingsIcon,
                        {
                          backgroundColor: item.danger
                            ? theme.error + "15"
                            : theme.primary + "15",
                        },
                      ]}
                    >
                      <Feather
                        name={item.icon}
                        size={18}
                        color={item.danger ? theme.error : theme.primary}
                      />
                    </View>
                    <View style={styles.settingsContent}>
                      <ThemedText
                        type="body"
                        style={item.danger ? { color: theme.error } : undefined}
                      >
                        {item.title}
                      </ThemedText>
                      {item.subtitle ? (
                        <ThemedText
                          type="small"
                          style={{ color: theme.textSecondary }}
                        >
                          {item.subtitle}
                        </ThemedText>
                      ) : null}
                    </View>
                    {item.showArrow ? (
                      <Feather
                        name="chevron-right"
                        size={20}
                        color={theme.textSecondary}
                      />
                    ) : null}
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      <Button
        onPress={handleLogout}
        style={[styles.logoutButton, { backgroundColor: theme.error }]}
      >
        Log Out
      </Button>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  userName: {
    marginBottom: Spacing.xs,
  },
  editSection: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  editTitle: {
    marginBottom: Spacing.sm,
  },
  fieldContainer: {
    width: "100%",
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  textArea: {
    height: 80,
    paddingTop: Spacing.md,
    textAlignVertical: "top",
  },
  editButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    flex: 1,
  },
  settingsContainer: {
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  settingsSection: {},
  sectionTitle: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingsGroup: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsContent: {
    flex: 1,
  },
  logoutButton: {
    marginBottom: Spacing.xl,
  },
});
