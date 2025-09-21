export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Service {
  id: string;
  name: string;
  duration: number; // σε λεπτά
  price: number;
  description: string;
  category: 'hair' | 'beard' | 'combo' | 'kids' | 'grooming';
}

export interface DailySchedule {
  day: Weekday;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface BreakPeriod {
  day: Weekday;
  startTime: string;
  endTime: string;
  label?: string;
}

export interface Barber {
  id: string;
  name: string;
  bio: string;
  experience: number; // χρόνια εμπειρίας
  specialties: string[];
  phone: string;
  location: string;
  slotInterval: number; // minutes
  schedule: DailySchedule[];
  breaks?: BreakPeriod[];
  photo?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  customer: CustomerInfo;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AvailabilityBlock {
  id: string;
  barberId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  label: string;
}

export interface AppointmentMetrics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  uniqueCustomers: number;
  estimatedRevenue: number;
}
