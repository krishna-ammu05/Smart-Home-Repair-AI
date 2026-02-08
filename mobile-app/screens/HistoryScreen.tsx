import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Pressable, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { storage, RepairHistory, Booking } from "@/utils/storage";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { HistoryStackParamList } from "@/navigation/HistoryStackNavigator";

type HistoryScreenNavigationProp = NativeStackNavigationProp<
  HistoryStackParamList,
  "History"
>;

type TabType = "repairs" | "bookings";

export default function HistoryScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<HistoryScreenNavigationProp>();

  const [activeTab, setActiveTab] = useState<TabType>("repairs");
  const [repairHistory, setRepairHistory] = useState<RepairHistory[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const history = await storage.getRepairHistory();
      const allBookings = await storage.getBookings();
      setRepairHistory(history);
      setBookings(allBookings);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
      case "completed":
      case "confirmed":
        return theme.success;
      case "pending":
      case "partial":
        return theme.secondary;
      default:
        return theme.error;
    }
  };

  const getStatusIcon = (status: string): keyof typeof Feather.glyphMap => {
    switch (status) {
      case "successful":
      case "completed":
        return "check-circle";
      case "confirmed":
        return "calendar";
      case "pending":
        return "clock";
      case "partial":
        return "alert-circle";
      default:
        return "x-circle";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather
        name={activeTab === "repairs" ? "tool" : "calendar"}
        size={48}
        color={theme.textSecondary}
      />
      <ThemedText
        type="h4"
        style={[styles.emptyTitle, { marginTop: Spacing.lg }]}
      >
        No {activeTab === "repairs" ? "Repairs" : "Bookings"} Yet
      </ThemedText>
      <ThemedText
        type="body"
        style={[styles.emptyText, { color: theme.textSecondary }]}
      >
        {activeTab === "repairs"
          ? "Complete your first repair to see it here"
          : "Book a technician to see your appointments here"}
      </ThemedText>
    </View>
  );

  return (
    <ScreenScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={[styles.tabContainer, { backgroundColor: theme.backgroundDefault }]}
      >
        <Pressable
          style={[
            styles.tab,
            activeTab === "repairs" && {
              backgroundColor: theme.primary,
            },
          ]}
          onPress={() => setActiveTab("repairs")}
        >
          <ThemedText
            type="body"
            style={{
              color: activeTab === "repairs" ? "#FFFFFF" : theme.text,
              fontWeight: activeTab === "repairs" ? "600" : "400",
            }}
          >
            Repairs
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === "bookings" && {
              backgroundColor: theme.primary,
            },
          ]}
          onPress={() => setActiveTab("bookings")}
        >
          <ThemedText
            type="body"
            style={{
              color: activeTab === "bookings" ? "#FFFFFF" : theme.text,
              fontWeight: activeTab === "bookings" ? "600" : "400",
            }}
          >
            Bookings
          </ThemedText>
        </Pressable>
      </View>

      {activeTab === "repairs" ? (
        <View style={styles.listContainer}>
          {repairHistory.length === 0 ? (
            renderEmptyState()
          ) : (
            repairHistory.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.historyCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.historyHeader}>
                  {item.imageUri ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.thumbnail}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.thumbnailPlaceholder,
                        { backgroundColor: theme.backgroundDefault },
                      ]}
                    >
                      <Feather
                        name="image"
                        size={24}
                        color={theme.textSecondary}
                      />
                    </View>
                  )}
                  <View style={styles.historyInfo}>
                    <ThemedText type="h4">
                      {item.faultType.charAt(0).toUpperCase() +
                        item.faultType.slice(1)}{" "}
                      Fault
                    </ThemedText>
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary }}
                    >
                      {formatDate(item.repairedAt)}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) + "20" },
                    ]}
                  >
                    <Feather
                      name={getStatusIcon(item.status)}
                      size={14}
                      color={getStatusColor(item.status)}
                    />
                    <ThemedText
                      type="small"
                      style={{
                        color: getStatusColor(item.status),
                        fontWeight: "600",
                        marginLeft: Spacing.xs,
                      }}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </ThemedText>
                  </View>
                </View>
                {item.verificationResult ? (
                  <View
                    style={[
                      styles.verificationResult,
                      { backgroundColor: theme.backgroundDefault },
                    ]}
                  >
                    <Feather
                      name="check"
                      size={14}
                      color={theme.success}
                    />
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}
                    >
                      {item.verificationResult}
                    </ThemedText>
                  </View>
                ) : null}
              </View>
            ))
          )}
        </View>
      ) : (
        <View style={styles.listContainer}>
          {bookings.length === 0 ? (
            renderEmptyState()
          ) : (
            bookings.map((booking) => (
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
                  <View>
                    <ThemedText type="h4">{booking.technicianName}</ThemedText>
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary }}
                    >
                      {booking.serviceDescription}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(booking.status) + "20" },
                    ]}
                  >
                    <Feather
                      name={getStatusIcon(booking.status)}
                      size={14}
                      color={getStatusColor(booking.status)}
                    />
                    <ThemedText
                      type="small"
                      style={{
                        color: getStatusColor(booking.status),
                        fontWeight: "600",
                        marginLeft: Spacing.xs,
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
                      style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}
                    >
                      {formatDate(booking.scheduledDate)}
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
                      style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}
                    >
                      {booking.scheduledTime}
                    </ThemedText>
                  </View>
                  <View style={styles.bookingDetail}>
                    <Feather
                      name="dollar-sign"
                      size={14}
                      color={theme.text}
                    />
                    <ThemedText
                      type="small"
                      style={{ fontWeight: "600", marginLeft: Spacing.sm }}
                    >
                      ${booking.estimatedCost}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.bookingAddress}>
                  <Feather
                    name="map-pin"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <ThemedText
                    type="small"
                    style={{
                      color: theme.textSecondary,
                      marginLeft: Spacing.sm,
                      flex: 1,
                    }}
                  >
                    {booking.address}
                  </ThemedText>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    padding: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: BorderRadius.sm,
  },
  listContainer: {
    gap: Spacing.md,
  },
  historyCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.sm,
  },
  thumbnailPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  historyInfo: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  verificationResult: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
  },
  bookingCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  bookingDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.1)",
  },
  bookingDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingAddress: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.1)",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
