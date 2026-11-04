import { type Booking, type Room, type Currency } from "./hotel";

export interface BookingTableProps {
  bookings: Booking[];
  currency: Currency;
  onOpenDetails: (booking: Booking) => void;
  onOpenCreate: () => void;
}

export interface BookingDetailModalProps {
  booking: Booking | null;
  currency: Currency;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, status: Booking["status"]) => void;
  onCancelBooking: (bookingId: string) => void;
}

export interface CreateBookingModalProps {
  isOpen: boolean;
  availableRooms: Room[];
  currency: Currency;
  onClose: () => void;
  onCreateBooking: (newBooking: Booking) => void;
}

