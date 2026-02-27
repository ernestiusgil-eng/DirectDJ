
import { DJProfile, BookingRequest, AppState } from '../types';

const STORAGE_KEY = 'directdj_state';

const initialState: AppState = {
  currentUser: null,
  adminSettings: {
    email: 'admin@directdj.ao',
    password: 'admin' // Senha inicial padrão
  },
  djs: [
    {
      id: '1',
      fullName: 'António Mwila',
      artisticName: 'DJ Mwila',
      idNumber: '001234567LA045',
      phoneNumber: '923000111',
      password: '123', // Demo password
      province: 'Luanda',
      municipality: 'Talatona',
      iban: 'AO06000000000000000001',
      hasSoundGear: true,
      priceDjOnly: 150000,
      priceWithGear: 400000,
      status: 'approved',
      rating: 4.8,
      reviewCount: 124,
      currentLocation: {
        lat: -8.83833,
        lng: 13.23444,
        lastUpdate: new Date().toISOString(),
        status: 'active'
      }
    },
    {
      id: '2',
      fullName: 'Ana Fonseca',
      artisticName: 'DJ Anny',
      idNumber: '009876543LA021',
      phoneNumber: '934555666',
      password: '123', // Demo password
      province: 'Luanda',
      municipality: 'Belas',
      iban: 'AO06000000000000000002',
      hasSoundGear: false,
      priceDjOnly: 250000,
      priceWithGear: 0, 
      status: 'approved',
      rating: 5.0,
      reviewCount: 15,
      currentLocation: {
        lat: -8.93833,
        lng: 13.13444,
        lastUpdate: new Date().toISOString(),
        status: 'on-route'
      }
    },
    {
      id: '3',
      fullName: 'Carlos Dundo',
      artisticName: 'DJ Kapiro',
      idNumber: '005555555LA099',
      phoneNumber: '944111222',
      password: '123', // Demo password
      province: 'Benguela',
      municipality: 'Lobito',
      iban: 'AO06000000000000000003',
      hasSoundGear: true,
      priceDjOnly: 500000,
      priceWithGear: 1200000,
      status: 'approved',
      rating: 4.9,
      reviewCount: 89,
      currentLocation: {
        lat: -12.34833,
        lng: 13.53444,
        lastUpdate: new Date().toISOString(),
        status: 'at-event'
      }
    }
  ],
  bookings: []
};

export const getAppState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialState;
};

export const saveAppState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const updateDJRating = (djId: string, newRating: number) => {
  const state = getAppState();
  const djIndex = state.djs.findIndex(d => d.id === djId);
  
  if (djIndex !== -1) {
    const dj = state.djs[djIndex];
    // Calculate new weighted average
    const totalScore = (dj.rating * dj.reviewCount) + newRating;
    const newCount = dj.reviewCount + 1;
    const newAverage = totalScore / newCount;
    
    state.djs[djIndex] = {
      ...dj,
      rating: parseFloat(newAverage.toFixed(1)),
      reviewCount: newCount
    };
    
    saveAppState(state);
    return true;
  }
  return false;
};

export const updateAdminSettings = (email: string, password: string) => {
  const state = getAppState();
  state.adminSettings = { email, password };
  saveAppState(state);
};
