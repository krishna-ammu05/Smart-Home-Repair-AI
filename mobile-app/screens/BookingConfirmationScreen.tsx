import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { storage, Booking, Technician } from "@/utils/storage";
import { MOCK_TECHNICIANS } from "@/utils/mockData";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { TechnicianStackParamList } from "@/navigation/TechnicianStackNavigator";

type BookingConfirmationRouteProp = RouteProp<
  TechnicianStackParamList,
  "BookingConfirmation"
>;
type BookingConfirmationNavigationProp = NativeStackNavigationProp<
  TechnicianStackParamList,
  "BookingConfirmation"
>;

export default function BookingConfirmationScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<BookingConfirmationNavigationProp>();
  const route = useRoute<BookingConfirmationRouteProp>();
  const { technicianId, faultReportId } = route.params;

  const [technician, setTechnician] = useState<Technician | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [address, setAddress] = useState(user?.address || "");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TIME_SLOTS = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  useEffect(() => {
    const tech = MOCK_TECHNICIANS.find((t) => t.id === technicianId);
    if (tech) {
      setTechnician(tech);
    }
  }, [technicianId]);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const calculateEstimatedCost = () => {
    if (!technician) return 0;
    return technician.hourlyRate * 2;
  };

  const handleConfirmBooking = async () => {
    if (!address.trim()) {
      Alert.alert("Error", "Please enter your address");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please describe the issue");
      return;
    }

    if (!technician) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const booking: Booking = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        userId: user?.id || "anonymous",
        technicianId: technician.id,
        technicianName: technician.name,
        faultReportId,
        scheduledDate: selectedDate.toISOString(),
        scheduledTime: selectedTime,
        address: address.trim(),
        serviceDescription: description.trim(),
        estimatedCost: calculateEstimatedCost(),
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      await storage.saveBooking(booking);

      Alert.alert(
        "Booking Confirmed",
        `Your appointment with ${technician.name} has been scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
        [
          {
            text: "View Bookings",
            onPress: () => navigation.popToTop(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!technician) {
    return (
      <ScreenKeyboardAwareScrollView>
        <View style={styles.loadingContainer}>
          <ThemedText type="body">Loading...</ThemedText>
        </View>
      </ScreenKeyboardAwareScrollView>
    );
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.backgroundDefault,
      color: theme.text,
    },
  ];

  return (
    <ScreenKeyboardAwareScrollView>
      <View
        style={[
          styles.technicianCard,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
        ]}
      >
        <View style={styles.technicianHeader}>
          <View
            style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}
          >
            <ThemedText type="h3" style={{ color: theme.primary }}>
              {technician.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </ThemedText>
          </View>
          <View style={styles.technicianInfo}>
            <ThemedText type="h4">{technician.name}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {technician.specialty}
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.success, marginTop: Spacing.xs }}
            >
              ${technician.hourlyRate}/hr
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Select Date
        </ThemedText>
        <Pressable
          style={[
            styles.dateButton,
            { backgroundColor: theme.backgroundDefault },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Feather name="calendar" size={20} color={theme.textSecondary} />
          <ThemedText type="body" style={{ marginLeft: Spacing.md }}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </ThemedText>
        </Pressable>

        {showDatePicker ? (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        ) : null}
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Select Time
        </ThemedText>
        <View style={styles.timeSlots}>
          {TIME_SLOTS.map((time) => (
            <Pressable
              key={time}
              style={[
                styles.timeSlot,
                {
                  backgroundColor:
                    selectedTime === time
                      ? theme.primary
                      : theme.backgroundDefault,
                  borderColor:
                    selectedTime === time ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <ThemedText
                type="small"
                style={{
                  color: selectedTime === time ? "#FFFFFF" : theme.text,
                  fontWeight: selectedTime === time ? "600" : "400",
                }}
              >
                {time}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Service Address
        </ThemedText>
        <TextInput
          style={[inputStyle, styles.textArea]}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your full address"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Describe the Issue
        </ThemedText>
        <TextInput
          style={[inputStyle, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the problem you're experiencing..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
        />
      </View>

      <View
        style={[
          styles.costCard,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        ]}
      >
        <ThemedText type="h4">Estimated Cost</ThemedText>
        <View style={styles.costDetails}>
          <View style={styles.costRow}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Service Fee (2 hrs min)
            </ThemedText>
            <ThemedText type="body">${calculateEstimatedCost()}</ThemedText>
          </View>
          <View style={[styles.costRow, styles.totalRow]}>
            <ThemedText type="h4">Total</ThemedText>
            <ThemedText type="h3" style={{ color: theme.primary }}>
              ${calculateEstimatedCost()}
            </ThemedText>
          </View>
        </View>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, marginTop: Spacing.sm }}
        >
          Final cost may vary based on actual repair time and parts needed
        </ThemedText>
      </View>

      <Button
        onPress={handleConfirmBooking}
        disabled={isSubmitting}
        style={styles.confirmButton}
      >
        {isSubmitting ? "Confirming..." : "Confirm Booking"}
      </Button>

      <View style={styles.disclaimer}>
        <Feather name="shield" size={16} color={theme.textSecondary} />
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, marginLeft: Spacing.sm, flex: 1 }}
        >
          All technicians are verified and background checked for your safety
        </ThemedText>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
  },
  technicianCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  technicianHeader: {
    flexDirection: "row",
    gap: Spacing.md,
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  input: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.fontSize,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  costCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  costDetails: {
    marginTop: Spacing.md,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.2)",
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  confirmButton: {
    marginBottom: Spacing.lg,
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Spacing.xl,
  },
});
