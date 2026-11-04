import { type Currency, type Room, type Booking, type UserRole } from "./hotel";

export interface DashboardMetrics {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  cleaningRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  estimatedRevenue: number;
  inHouseGuests: number;
}

export interface DayOccupancyStat {
  day: string;
  occupancyRate: number;
  revenue: number;
  isToday?: boolean;
}

export interface HotelKpisProps {
  metrics: DashboardMetrics;
  currency: Currency;
  role?: UserRole;
}

export interface OccupancyTrendsProps {
  trendData: DayOccupancyStat[];
  currency: Currency;
}

export interface RoomStatusBreakdownProps {
  metrics: DashboardMetrics;
}

export interface TodayArrivalsProps {
  todayBookings: Booking[];
  currency: Currency;
  onUpdateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
}

