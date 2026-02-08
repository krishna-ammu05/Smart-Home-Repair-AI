import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { storage, FaultReport } from "@/utils/storage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { ScanStackParamList } from "@/navigation/ScanStackNavigator";
import { AI_BASE_URL } from "@/src/config/api";

type ScanScreenNavigationProp = NativeStackNavigationProp<
  ScanStackParamList,
  "Scan"
>;

export default function ScanScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2);

  // 🔥 REAL YOLO AI CALL
  const detectFaultWithAI = async (imageUri: string) => {
    const formData = new FormData();

    formData.append("file", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);

    const response = await fetch(`${AI_BASE_URL}/detect`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return await response.json();
  };

  // 🔥 UPDATED LOGIC (NO UI CHANGE)
  const processImage = async (imageUri: string) => {
    setIsProcessing(true);
    try {
      const aiResponse = await detectFaultWithAI(imageUri);

      if (!aiResponse?.data || aiResponse.data.length === 0) {
        Alert.alert(
          "No Fault Detected",
          "No visible issue was found. Try another image."
        );
        return;
      }

      const detection = aiResponse.data[0];

      const report: FaultReport = {
        id: generateId(),
        userId: user?.id || "anonymous",
        imageUri,
        faultType: detection.label,
        confidence: detection.confidence,
        description: `Detected ${detection.label} with ${Math.round(
          detection.confidence * 100
        )}% confidence`,
        detectedAt: new Date().toISOString(),
        status: "detected",
      };

      await storage.saveFaultReport(report);
      navigation.navigate("FaultDetection", { reportId: report.id });
    } catch (error) {
      Alert.alert("Error", "Failed to analyze image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });
      if (photo?.uri) {
        await processImage(photo.uri);
      }
    } catch {
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  // ⛔ BELOW THIS: UI IS UNCHANGED
  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView
        style={[
          styles.container,
          styles.permissionContainer,
          { paddingTop: insets.top },
        ]}
      >
        <View style={styles.permissionContent}>
          <View
            style={[
              styles.permissionIcon,
              { backgroundColor: theme.primary + "15" },
            ]}
          >
            <Feather name="camera" size={48} color={theme.primary} />
          </View>
          <ThemedText type="h2" style={styles.permissionTitle}>
            Camera Access Required
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.permissionText, { color: theme.textSecondary }]}
          >
            To detect faults in your appliances, we need access to your camera.
          </ThemedText>
          <Button onPress={requestPermission} style={styles.permissionButton}>
            Enable Camera
          </Button>
          <Pressable style={styles.galleryLink} onPress={pickImage}>
            <ThemedText type="link">Or select from gallery</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  if (Platform.OS === "web") {
    return (
      <ThemedView
        style={[
          styles.container,
          styles.permissionContainer,
          { paddingTop: insets.top },
        ]}
      >
        <View style={styles.permissionContent}>
          <Button onPress={pickImage} style={styles.permissionButton}>
            Select from Gallery
          </Button>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <View style={styles.topBar}>
            <ThemedText type="body" style={styles.instruction}>
              Point camera at the faulty appliance
            </ThemedText>
          </View>

          <View style={styles.frameContainer}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <View
            style={[styles.bottomBar, { paddingBottom: insets.bottom + 100 }]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.sideButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={pickImage}
              disabled={isProcessing}
            >
              <View
                style={[
                  styles.sideButtonInner,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <Feather name="image" size={24} color="#FFFFFF" />
              </View>
              <ThemedText style={styles.sideButtonText}>Gallery</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.captureButton,
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              onPress={takePicture}
              disabled={isProcessing || !cameraReady}
            >
              {isProcessing ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </Pressable>

            <View style={styles.sideButton} />
          </View>
        </View>
      </CameraView>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View
            style={[
              styles.processingCard,
              { backgroundColor: theme.backgroundRoot },
            ]}
          >
            <ActivityIndicator size="large" color={theme.primary} />
            <ThemedText type="h4" style={styles.processingText}>
              Analyzing image...
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, textAlign: "center" }}
            >
              Our AI is detecting faults in your appliance
            </ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { flex: 1 },
  topBar: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  instruction: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "500",
  },
  frameContainer: {
    flex: 1,
    margin: Spacing["3xl"],
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: Spacing.xl,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sideButton: { width: 70, alignItems: "center" },
  sideButtonInner: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sideButtonText: { color: "#FFFFFF", fontSize: 12 },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: { alignItems: "center", maxWidth: 320 },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionTitle: { marginBottom: Spacing.md },
  permissionText: { textAlign: "center", marginBottom: Spacing.xl },
  permissionButton: { width: "100%" },
  galleryLink: { marginTop: Spacing.lg },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  processingCard: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    ...Shadows.large,
  },
  processingText: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
