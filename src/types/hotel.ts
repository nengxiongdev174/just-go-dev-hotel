export type Currency = "LAK" | "THB" | "USD";

export type RoomType = "standard" | "deluxe" | "suite" | "penthouse";

export type RoomStatus = "available" | "occupied" | "cleaning" | "maintenance";

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  priceLAK: number;
  priceTHB: number;
  priceUSD: number;
  capacity: number;
  bedType: string;
  amenities: string[];
  currentGuestName?: string;
  checkOutDate?: string;
}

export type BookingStatus = "confirmed" | "checked_in" | "checked_out" | "cancelled";

export interface Booking {
  id: string;
  bookingRef: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  currency: Currency;
  status: BookingStatus;
  paymentStatus: "paid" | "deposit" | "unpaid";
  specialRequests?: string;
  createdAt: string;
}

export type VipTier = "Standard" | "Silver" | "Gold" | "Platinum";

export interface Guest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  nationality: string;
  passportId: string;
  vipTier: VipTier;
  totalStays: number;
  totalSpentLAK: number;
  notes?: string;
}

export type UserRole = "manager" | "receptionist" | "housekeeping";

export interface HotelUser {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface HotelInfo {
  name: string;
  starRating: number;
  tel: string;
  email: string;
  address: string;
  totalRooms: number;
  checkInTime: string;
  checkOutTime: string;
}

