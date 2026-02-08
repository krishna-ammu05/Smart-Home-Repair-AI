import React, { useState, useMemo } from "react";
import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { MOCK_TECHNICIANS } from "@/utils/mockData";
import { Technician } from "@/utils/storage";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { TechnicianStackParamList } from "@/navigation/TechnicianStackNavigator";

type TechnicianListRouteProp = RouteProp<
  TechnicianStackParamList,
  "TechnicianList"
>;
type TechnicianListNavigationProp = NativeStackNavigationProp<
  TechnicianStackParamList,
  "TechnicianList"
>;

const SPECIALTIES = [
  "All",
  "Electrical Appliances",
  "HVAC Systems",
  "Plumbing",
  "Kitchen Appliances",
  "General Repairs",
];

export default function TechnicianListScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<TechnicianListNavigationProp>();
  const route = useRoute<TechnicianListRouteProp>();
  const faultReportId = route.params?.faultReportId;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filteredTechnicians = useMemo(() => {
    return MOCK_TECHNICIANS.filter((tech) => {
      const matchesSearch =
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "All" || tech.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  const handleSelectTechnician = (technician: Technician) => {
    navigation.navigate("BookingConfirmation", {
      technicianId: technician.id,
      faultReportId,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Feather key={i} name="star" size={14} color={theme.secondary} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Feather key={i} name="star" size={14} color={theme.secondary} />
        );
      } else {
        stars.push(
          <Feather key={i} name="star" size={14} color={theme.textSecondary} />
        );
      }
    }
    return stars;
  };

  return (
    <ScreenScrollView>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <Feather name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search technicians..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 ? (
          <Pressable onPress={() => setSearchQuery("")}>
            <Feather name="x" size={20} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filterContainer}>
        {SPECIALTIES.map((specialty) => (
          <Pressable
            key={specialty}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedSpecialty === specialty
                    ? theme.primary
                    : theme.backgroundDefault,
                borderColor:
                  selectedSpecialty === specialty
                    ? theme.primary
                    : theme.border,
              },
            ]}
            onPress={() => setSelectedSpecialty(specialty)}
          >
            <ThemedText
              type="small"
              style={{
                color:
                  selectedSpecialty === specialty ? "#FFFFFF" : theme.text,
                fontWeight: selectedSpecialty === specialty ? "600" : "400",
              }}
            >
              {specialty}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.resultsHeader}>
        <ThemedText type="h4">
          {filteredTechnicians.length} Technician
          {filteredTechnicians.length !== 1 ? "s" : ""} Found
        </ThemedText>
      </View>

      <View style={styles.technicianList}>
        {filteredTechnicians.map((technician) => (
          <Pressable
            key={technician.id}
            style={({ pressed }) => [
              styles.technicianCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.99 : 1 }],
              },
            ]}
            onPress={() => handleSelectTechnician(technician)}
          >
            <View style={styles.technicianHeader}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <ThemedText
                  type="h3"
                  style={{ color: theme.primary }}
                >
                  {technician.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </ThemedText>
              </View>
              <View style={styles.technicianInfo}>
                <ThemedText type="h4">{technician.name}</ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary }}
                >
                  {technician.specialty}
                </ThemedText>
                <View style={styles.ratingRow}>
                  <View style={styles.stars}>{renderStars(technician.rating)}</View>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}
                  >
                    {technician.rating} ({technician.reviewCount})
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.technicianDetails}>
              <View style={styles.detailItem}>
                <Feather name="map-pin" size={14} color={theme.textSecondary} />
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}
                >
                  {technician.distance}
                </ThemedText>
              </View>
              <View style={styles.detailItem}>
                <Feather name="clock" size={14} color={theme.success} />
                <ThemedText
                  type="small"
                  style={{ color: theme.success, marginLeft: Spacing.xs }}
                >
                  {technician.availability}
                </ThemedText>
              </View>
              <View style={styles.detailItem}>
                <Feather name="dollar-sign" size={14} color={theme.text} />
                <ThemedText
                  type="small"
                  style={{ fontWeight: "600", marginLeft: Spacing.xs }}
                >
                  ${technician.hourlyRate}/hr
                </ThemedText>
              </View>
            </View>

            <View style={styles.bookButton}>
              <ThemedText
                type="body"
                style={{ color: theme.primary, fontWeight: "600" }}
              >
                Book Now
              </ThemedText>
              <Feather
                name="chevron-right"
                size={20}
                color={theme.primary}
              />
            </View>
          </Pressable>
        ))}
      </View>

      {filteredTechnicians.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="users" size={48} color={theme.textSecondary} />
          <ThemedText
            type="h4"
            style={[styles.emptyTitle, { marginTop: Spacing.lg }]}
          >
            No technicians found
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.emptyText, { color: theme.textSecondary }]}
          >
            Try adjusting your search or filter criteria
          </ThemedText>
        </View>
      ) : null}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.body.fontSize,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  resultsHeader: {
    marginBottom: Spacing.lg,
  },
  technicianList: {
    gap: Spacing.md,
  },
  technicianCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  technicianHeader: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  technicianInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  technicianDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.1)",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.1)",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
