import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { storage, FaultReport, Booking } from "@/utils/storage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import type { MainTabParamList } from "@/navigation/MainTabNavigator";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, "Home">,
  BottomTabNavigationProp<MainTabParamList>
>;

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  onPress: () => void;
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [recentReports, setRecentReports] = useState<FaultReport[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadRecentData();
  }, []);

  const loadRecentData = async () => {
    const reports = await storage.getFaultReports();
    const bookings = await storage.getBookings();
    setRecentReports(reports.slice(0, 3));
    setRecentBookings(bookings.slice(0, 2));
  };

  const quickActions: QuickAction[] = [
    {
      id: "scan",
      title: "Start Scan",
      description: "Detect faults with AI",
      icon: "camera",
      color: theme.primary,
      onPress: () => navigation.navigate("ScanTab"),
    },
    {
      id: "history",
      title: "View History",
      description: "Past repairs",
      icon: "clock",
      color: theme.success,
      onPress: () => navigation.navigate("HistoryTab"),
    },
    {
      id: "technician",
      title: "Find Technician",
      description: "Book a pro",
      icon: "users",
      color: theme.secondary,
      onPress: () => navigation.navigate("TechniciansTab"),
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFaultIcon = (faultType: string): keyof typeof Feather.glyphMap => {
    const icons: Record<string, keyof typeof Feather.glyphMap> = {
      electrical: "zap",
      mechanical: "settings",
      leak: "droplet",
      heating: "thermometer",
      structural: "home",
    };
    return icons[faultType] || "alert-circle";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "completed":
      case "confirmed":
        return theme.success;
      case "detected":
      case "pending":
        return theme.secondary;
      case "repairing":
        return theme.primary;
      default:
        return theme.error;
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.greetingSection}>
        <ThemedText type="h2">
          {getGreeting()}, {user?.name?.split(" ")[0] || "User"}
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.greetingSubtitle, { color: theme.textSecondary }]}
        >
          What would you like to repair today?
        </ThemedText>
      </View>

      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [
              styles.quickActionCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={action.onPress}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: action.color + "15" },
              ]}
            >
              <Feather name={action.icon} size={24} color={action.color} />
            </View>
            <ThemedText type="h4" style={styles.quickActionTitle}>
              {action.title}
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary }}
            >
              {action.description}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {recentReports.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h3">Recent Scans</ThemedText>
            <Pressable onPress={() => navigation.navigate("HistoryTab")}>
              <ThemedText type="link">See All</ThemedText>
            </Pressable>
          </View>
          {recentReports.map((report) => (
            <Pressable
              key={report.id}
              style={({ pressed }) => [
                styles.recentCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() =>
                navigation.navigate("FaultDetection", { reportId: report.id })
              }
            >
              <View
                style={[
                  styles.recentIcon,
                  { backgroundColor: theme.primary + "15" },
                ]}
              >
                <Feather
                  name={getFaultIcon(report.faultType)}
                  size={20}
                  color={theme.primary}
                />
              </View>
              <View style={styles.recentContent}>
                <ThemedText type="body" style={styles.recentTitle}>
                  {report.faultType.charAt(0).toUpperCase() +
                    report.faultType.slice(1)}{" "}
                  Fault
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary }}
                >
                  {new Date(report.detectedAt).toLocaleDateString()}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(report.status) + "20" },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: getStatusColor(report.status),
                    fontWeight: "600",
                  }}
                >
                  {report.status.charAt(0).toUpperCase() +
                    report.status.slice(1)}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}

      {recentBookings.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h3">Upcoming Bookings</ThemedText>
            <Pressable onPress={() => navigation.navigate("TechniciansTab")}>
              <ThemedText type="link">See All</ThemedText>
            </Pressable>
          </View>
          {recentBookings.map((booking) => (
            <View
              key={booking.id}
              style={[
                styles.bookingCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.bookingHeader}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  {booking.technicianName}
                </ThemedText>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(booking.status) + "20" },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{
                      color: getStatusColor(booking.status),
                      fontWeight: "600",
                    }}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.bookingDetails}>
                <View style={styles.bookingDetail}>
                  <Feather
                    name="calendar"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}
                  >
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </ThemedText>
                </View>
                <View style={styles.bookingDetail}>
                  <Feather
                    name="clock"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}
                  >
                    {booking.scheduledTime}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {recentReports.length === 0 && recentBookings.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="camera" size={48} color={theme.textSecondary} />
          <ThemedText
            type="h4"
            style={[styles.emptyTitle, { marginTop: Spacing.lg }]}
          >
            Ready to detect faults?
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.emptyText, { color: theme.textSecondary }]}
          >
            Take a photo of your faulty appliance to get AI-powered diagnosis
            and repair guidance.
          </ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.emptyButton,
              {
                backgroundColor: theme.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => navigation.navigate("ScanTab")}
          >
            <Feather name="camera" size={20} color="#FFFFFF" />
            <ThemedText
              type="body"
              style={{ color: "#FFFFFF", marginLeft: Spacing.sm, fontWeight: "600" }}
            >
              Start Scanning
            </ThemedText>
          </Pressable>
        </View>
      ) : null}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  greetingSection: {
    marginBottom: Spacing["2xl"],
  },
  greetingSubtitle: {
    marginTop: Spacing.xs,
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  quickActionCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.small,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  quickActionTitle: {
    marginBottom: Spacing.xs,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  recentContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  recentTitle: {
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  bookingCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  bookingDetails: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  bookingDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
});
