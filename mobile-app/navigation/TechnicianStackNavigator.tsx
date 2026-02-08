import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TechnicianListScreen from "@/screens/TechnicianListScreen";
import BookingConfirmationScreen from "@/screens/BookingConfirmationScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type TechnicianStackParamList = {
  TechnicianList: { faultReportId?: string };
  BookingConfirmation: { technicianId: string; faultReportId?: string };
};

const Stack = createNativeStackNavigator<TechnicianStackParamList>();

export default function TechnicianStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="TechnicianList"
        component={TechnicianListScreen}
        options={{ headerTitle: "Technicians" }}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{ headerTitle: "Confirm Booking" }}
      />
    </Stack.Navigator>
  );
}
