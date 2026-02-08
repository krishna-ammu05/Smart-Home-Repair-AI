import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScanScreen from "@/screens/ScanScreen";
import FaultDetectionScreen from "@/screens/FaultDetectionScreen";
import RepairGuidanceScreen from "@/screens/RepairGuidanceScreen";
import TechnicianListScreen from "@/screens/TechnicianListScreen";
import BookingConfirmationScreen from "@/screens/BookingConfirmationScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ScanStackParamList = {
  Scan: undefined;
  FaultDetection: { reportId: string };
  RepairGuidance: { reportId: string };
  TechnicianList: { faultReportId?: string };
  BookingConfirmation: { technicianId: string; faultReportId?: string };
};

const Stack = createNativeStackNavigator<ScanStackParamList>();

export default function ScanStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          headerTitle: "Scan Appliance",
          headerTransparent: false,
          headerStyle: {
            backgroundColor: theme.backgroundRoot,
          },
        }}
      />
      <Stack.Screen
        name="FaultDetection"
        component={FaultDetectionScreen}
        options={{ headerTitle: "Analysis Result" }}
      />
      <Stack.Screen
        name="RepairGuidance"
        component={RepairGuidanceScreen}
        options={{ headerTitle: "Repair Guide" }}
      />
      <Stack.Screen
        name="TechnicianList"
        component={TechnicianListScreen}
        options={{ headerTitle: "Find Technician" }}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{ headerTitle: "Confirm Booking" }}
      />
    </Stack.Navigator>
  );
}
