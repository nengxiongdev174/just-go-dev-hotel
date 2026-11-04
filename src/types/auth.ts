import { type HotelUser } from "./hotel";

export interface LoginViewProps {
  onLogin: (user: HotelUser) => void;
}

