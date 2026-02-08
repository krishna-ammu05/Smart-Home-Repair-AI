import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { storage, FaultReport } from "@/utils/storage";
import { FAULT_TYPES } from "@/utils/mockData"; // ✅ UI metadata only
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { ScanStackParamList } from "@/navigation/ScanStackNavigator";

type FaultDetectionRouteProp = RouteProp<ScanStackParamList, "FaultDetection">;
type FaultDetectionNavigationProp = NativeStackNavigationProp<
  ScanStackParamList,
  "FaultDetection"
>;

export default function FaultDetectionScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<FaultDetectionNavigationProp>();
  const route = useRoute<FaultDetectionRouteProp>();
  const { reportId } = route.params;

  const [report, setReport] = useState<FaultReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      const reports = await storage.getFaultReports();
      const found = reports.find((r) => r.id === reportId);
      if (found) {
        setReport(found);
      }
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFaultInfo = (faultType: string) => {
    return FAULT_TYPES.find((f) => f.id === faultType) || FAULT_TYPES[0];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return theme.success;
    if (confidence >= 0.6) return theme.secondary;
    return theme.error;
  };

  // ✅ UPDATED: No mock AI, only navigation
  const handleGetRepairGuide = () => {
    if (!report) return;
    navigation.navigate("RepairGuidance", { reportId: report.id });
  };

  const handleBookTechnician = () => {
    navigation.navigate("TechnicianList", { faultReportId: report?.id });
  };

  if (isLoading || !report) {
    return (
      <ScreenScrollView>
        <View style={styles.loadingContainer}>
          <ThemedText type="body">Loading analysis...</ThemedText>
        </View>
      </ScreenScrollView>
    );
  }

  const faultInfo = getFaultInfo(report.faultType);

  return (
    <ScreenScrollView>
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <Image
          source={{ uri: report.imageUri }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.imageOverlay}>
          <View
            style={[
              styles.detectedBadge,
              { backgroundColor: theme.success + "E6" },
            ]}
          >
            <Feather name="check-circle" size={16} color="#FFFFFF" />
            <ThemedText style={styles.detectedText}>
              Fault Detected
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.resultSection}>
        <View style={styles.faultHeader}>
          <View
            style={[
              styles.faultIcon,
              { backgroundColor: theme.primary + "15" },
            ]}
          >
            <Feather
              name={faultInfo.icon as keyof typeof Feather.glyphMap}
              size={28}
              color={theme.primary}
            />
          </View>
          <View style={styles.faultTitleContainer}>
            <ThemedText type="h2">{faultInfo.name}</ThemedText>
            <View style={styles.confidenceRow}>
              <View
                style={[
                  styles.confidenceDot,
                  { backgroundColor: getConfidenceColor(report.confidence) },
                ]}
              />
              <ThemedText
                type="small"
                style={{ color: getConfidenceColor(report.confidence) }}
              >
                {Math.round(report.confidence * 100)}% Confidence
              </ThemedText>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.descriptionCard,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText type="h4" style={styles.descriptionTitle}>
            Analysis Result
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.description, { color: theme.textSecondary }]}
          >
            {report.description}
          </ThemedText>
        </View>

        <View style={styles.confidenceSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Detection Confidence
          </ThemedText>
          <View
            style={[
              styles.confidenceBar,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <View
              style={[
                styles.confidenceFill,
                {
                  width: `${report.confidence * 100}%`,
                  backgroundColor: getConfidenceColor(report.confidence),
                },
              ]}
            />
          </View>
          <View style={styles.confidenceLabels}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Low
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Medium
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              High
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Next Steps
          </ThemedText>

          <Button onPress={handleGetRepairGuide} style={styles.primaryButton}>
            <View style={styles.buttonContent}>
              <Feather name="tool" size={20} color="#FFFFFF" />
              <ThemedText style={styles.buttonText}>
                Get Repair Guide
              </ThemedText>
            </View>
          </Button>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleBookTechnician}
          >
            <View style={styles.buttonContent}>
              <Feather name="users" size={20} color={theme.primary} />
              <ThemedText
                type="body"
                style={[
                  styles.secondaryButtonText,
                  { color: theme.primary },
                ]}
              >
                Book a Technician
              </ThemedText>
            </View>
          </Pressable>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.primary + "10",
              borderColor: theme.primary + "30",
            },
          ]}
        >
          <Feather name="info" size={20} color={theme.primary} />
          <View style={styles.infoContent}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              DIY or Professional Help?
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
            >
              Our repair guide provides step-by-step instructions for common
              fixes. For complex issues or if you're unsure, we recommend
              booking a certified technician.
            </ThemedText>
          </View>
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
  },
  imageContainer: {
    height: 250,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
  },
  detectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  detectedText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  resultSection: {
    gap: Spacing.xl,
  },
  faultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  faultIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  faultTitleContainer: {
    flex: 1,
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  descriptionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  descriptionTitle: {
    marginBottom: Spacing.sm,
  },
  description: {},
  confidenceSection: {},
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  confidenceBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    borderRadius: 4,
  },
  confidenceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  actionsSection: {
    gap: Spacing.md,
  },
  primaryButton: {
    marginTop: Spacing.sm,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
});
