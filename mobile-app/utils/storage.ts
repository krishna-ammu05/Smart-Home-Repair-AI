import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER: "@smart_home_repair_user",
  AUTH_TOKEN: "@smart_home_repair_auth_token",
  REPAIR_HISTORY: "@smart_home_repair_history",
  BOOKINGS: "@smart_home_repair_bookings",
  FAULT_REPORTS: "@smart_home_repair_fault_reports",
};

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface FaultReport {
  id: string;
  userId: string;
  imageUri: string;
  faultType: string;
  confidence: number;
  description: string;
  detectedAt: string;
  status: "detected" | "repairing" | "verified" | "failed";
  repairSteps?: RepairStep[];
}

export interface RepairStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  imageUri?: string;
  isCompleted: boolean;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  distance: string;
  availability: string;
  hourlyRate: number;
  phone: string;
  imageUri?: string;
}

export interface Booking {
  id: string;
  userId: string;
  technicianId: string;
  technicianName: string;
  faultReportId?: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  serviceDescription: string;
  estimatedCost: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface RepairHistory {
  id: string;
  faultReportId: string;
  faultType: string;
  imageUri: string;
  repairedAt: string;
  status: "successful" | "partial" | "failed";
  technicianName?: string;
  verificationResult?: string;
  beforeImageUri?: string;
  afterImageUri?: string;
}

export const storage = {
  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error("Error saving auth token:", error);
      throw error;
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  },

  async saveFaultReport(report: FaultReport): Promise<void> {
    try {
      const reports = await this.getFaultReports();
      const existingIndex = reports.findIndex((r) => r.id === report.id);
      if (existingIndex >= 0) {
        reports[existingIndex] = report;
      } else {
        reports.unshift(report);
      }
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAULT_REPORTS,
        JSON.stringify(reports)
      );
    } catch (error) {
      console.error("Error saving fault report:", error);
      throw error;
    }
  },

  async getFaultReports(): Promise<FaultReport[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAULT_REPORTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting fault reports:", error);
      return [];
    }
  },

  async saveBooking(booking: Booking): Promise<void> {
    try {
      const bookings = await this.getBookings();
      const existingIndex = bookings.findIndex((b) => b.id === booking.id);
      if (existingIndex >= 0) {
        bookings[existingIndex] = booking;
      } else {
        bookings.unshift(booking);
      }
      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKINGS,
        JSON.stringify(bookings)
      );
    } catch (error) {
      console.error("Error saving booking:", error);
      throw error;
    }
  },

  async getBookings(): Promise<Booking[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting bookings:", error);
      return [];
    }
  },

  async saveRepairHistory(history: RepairHistory): Promise<void> {
    try {
      const records = await this.getRepairHistory();
      const existingIndex = records.findIndex((r) => r.id === history.id);
      if (existingIndex >= 0) {
        records[existingIndex] = history;
      } else {
        records.unshift(history);
      }
      await AsyncStorage.setItem(
        STORAGE_KEYS.REPAIR_HISTORY,
        JSON.stringify(records)
      );
    } catch (error) {
      console.error("Error saving repair history:", error);
      throw error;
    }
  },

  async getRepairHistory(): Promise<RepairHistory[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REPAIR_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting repair history:", error);
      return [];
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  },

  async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.AUTH_TOKEN,
      ]);
    } catch (error) {
      console.error("Error clearing user data:", error);
      throw error;
    }
  },
};
