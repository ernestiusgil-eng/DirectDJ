
export type UserRole = 'client' | 'dj' | 'admin';

export interface DJProfile {
  id: string;
  fullName: string;
  artisticName: string;
  idNumber: string;
  phoneNumber: string;
  password?: string; // New field for authentication
  province: string;
  municipality: string;
  iban: string;
  hasSoundGear: boolean;
  priceDjOnly: number;
  priceWithGear: number;
  professionalCardUrl?: string;
  gearImageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  reviewCount: number;
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdate: string;
    status: 'active' | 'offline' | 'on-route' | 'at-event';
  };
}

export interface BookingRequest {
  id: string;
  clientId: string;
  djId?: string;
  djName?: string;
  eventType: string;
  needsGear: boolean;
  province: string;
  municipality: string;
  price: number;
  transportPrice?: number;
  date: string;
  status: 'pending' | 'paid' | 'completed';
  commission: number;
  netAmount: number;
}

export interface AppState {
  currentUser: { email: string; role: UserRole } | null;
  adminSettings: { email: string; password: string; };
  djs: DJProfile[];
  bookings: BookingRequest[];
}

export enum EventType {
  Aniversario = 'Aniversário',
  Noivado = 'Pedido de Noivado',
  Casamento = 'Casamento',
  Festival = 'Festival',
  Bar = 'Bar de Rua',
  Discoteca = 'Discoteca',
  Corporativo = 'Evento Corporativo',
  Outro = 'Outro'
}
