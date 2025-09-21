/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { addDays, format } from 'date-fns';
import { nanoid } from 'nanoid';
import { BARBERS } from '../data/barbers';
import { SERVICES } from '../data/services';
import { usePersistentState } from '../hooks/usePersistentState';
import type {
  Appointment,
  AvailabilityBlock,
  Barber,
  Service,
  TimeSlot,
} from '../types';
import {
  calculateMetrics,
  generateAvailableSlots,
  isSlotAvailable,
  timeToMinutes,
  minutesToTime,
} from '../utils/scheduling';

interface CreateAppointmentInput {
  barberId: string;
  serviceId: string;
  date: string;
  startTime: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };
}

interface RescheduleInput {
  date: string;
  startTime: string;
}

interface BlockTimeInput {
  barberId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

interface BookingContextValue {
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  blocks: AvailabilityBlock[];
  createAppointment: (input: CreateAppointmentInput) => { success: boolean; message?: string };
  cancelAppointment: (appointmentId: string) => void;
  rescheduleAppointment: (
    appointmentId: string,
    input: RescheduleInput,
  ) => { success: boolean; message?: string };
  blockTime: (input: BlockTimeInput) => { success: boolean; message?: string };
  removeBlock: (blockId: string) => void;
  getAppointmentsForDate: (date: string, barberId?: string) => Appointment[];
  getAvailableSlots: (
    barberId: string,
    date: string,
    serviceId: string,
    ignoreAppointmentId?: string,
  ) => TimeSlot[];
  getServiceById: (serviceId: string) => Service | undefined;
  getBarberById: (barberId: string) => Barber | undefined;
  getDailyMetrics: (date: string) => ReturnType<typeof calculateMetrics>;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

const compareAppointments = (a: Appointment, b: Appointment) => {
  if (a.date === b.date) {
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  }
  return a.date.localeCompare(b.date);
};

const findNextWorkingDate = (barber: Barber): string => {
  for (let offset = 0; offset < 14; offset += 1) {
    const candidate = addDays(new Date(), offset);
    const weekday = candidate.getDay();
    if (barber.schedule.some((entry) => entry.day === weekday)) {
      return format(candidate, 'yyyy-MM-dd');
    }
  }
  return format(new Date(), 'yyyy-MM-dd');
};

const createInitialAppointments = (): Appointment[] => {
  const leo = BARBERS.find((item) => item.id === 'leo');
  const nick = BARBERS.find((item) => item.id === 'nick');
  const leoDate = leo ? findNextWorkingDate(leo) : format(new Date(), 'yyyy-MM-dd');
  const nickDate = nick ? findNextWorkingDate(nick) : format(new Date(), 'yyyy-MM-dd');

  return [
    {
      id: nanoid(),
      barberId: 'leo',
      serviceId: 'classic-cut',
      date: leoDate,
      startTime: '11:00',
      endTime: '11:30',
      customer: {
        name: 'Γιώργος Παπαδόπουλος',
        phone: '6901234567',
        email: 'george@example.com',
      },
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: nanoid(),
      barberId: 'nick',
      serviceId: 'beard-detail',
      date: nickDate,
      startTime: '15:00',
      endTime: '15:25',
      customer: {
        name: 'Πέτρος Αναγνώστου',
        phone: '6970001122',
      },
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    },
  ];
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = usePersistentState<Appointment[]>(
    'bb.appointments',
    createInitialAppointments,
  );
  const [blocks, setBlocks] = usePersistentState<AvailabilityBlock[]>('bb.blocks', []);

  const getServiceById = useCallback((serviceId: string) => SERVICES.find((item) => item.id === serviceId), []);

  const getBarberById = useCallback((barberId: string) => BARBERS.find((item) => item.id === barberId), []);

  const createAppointment: BookingContextValue['createAppointment'] = useCallback(
    (input) => {
      const service = getServiceById(input.serviceId);
      const barber = getBarberById(input.barberId);

      if (!service || !barber) {
        return { success: false, message: 'Δεν βρέθηκε η υπηρεσία ή ο κουρέας.' };
      }

      if (
        !isSlotAvailable(barber, service, input.date, input.startTime, appointments, blocks)
      ) {
        return {
          success: false,
          message: 'Το slot δεν είναι πλέον διαθέσιμο. Παρακαλούμε επιλέξτε άλλη ώρα.',
        };
      }

      const endTime = minutesToTime(timeToMinutes(input.startTime) + service.duration);

      const newAppointment: Appointment = {
        id: nanoid(),
        barberId: input.barberId,
        serviceId: input.serviceId,
        date: input.date,
        startTime: input.startTime,
        endTime,
        customer: input.customer,
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
      };

      setAppointments((prev) => [...prev, newAppointment].sort(compareAppointments));

      return { success: true };
    },
    [appointments, blocks, getBarberById, getServiceById, setAppointments],
  );

  const cancelAppointment = useCallback(
    (appointmentId: string) => {
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'cancelled' as const }
            : appointment,
        ),
      );
    },
    [setAppointments],
  );

  const rescheduleAppointment: BookingContextValue['rescheduleAppointment'] = useCallback(
    (appointmentId, input) => {
      const appointment = appointments.find((item) => item.id === appointmentId);

      if (!appointment) {
        return { success: false, message: 'Το ραντεβού δεν βρέθηκε.' };
      }

      const service = getServiceById(appointment.serviceId);
      const barber = getBarberById(appointment.barberId);

      if (!service || !barber) {
        return { success: false, message: 'Ανεύρετο service ή κουρείο.' };
      }

      if (
        !isSlotAvailable(
          barber,
          service,
          input.date,
          input.startTime,
          appointments,
          blocks,
          appointmentId,
        )
      ) {
        return { success: false, message: 'Το νέο slot δεν είναι διαθέσιμο.' };
      }

      const endTime = minutesToTime(timeToMinutes(input.startTime) + service.duration);

      setAppointments((prev) =>
        prev
          .map((item) =>
            item.id === appointmentId
              ? {
                  ...item,
                  date: input.date,
                  startTime: input.startTime,
                  endTime,
                  status: 'confirmed' as const,
                }
              : item,
          )
          .sort(compareAppointments),
      );

      return { success: true };
    },
    [appointments, blocks, getBarberById, getServiceById, setAppointments],
  );

  const blockTime: BookingContextValue['blockTime'] = useCallback(
    (input) => {
      const barber = getBarberById(input.barberId);

      if (!barber) {
        return { success: false, message: 'Ο κουρέας δεν βρέθηκε.' };
      }

      const start = timeToMinutes(input.startTime);
      const end = timeToMinutes(input.endTime);

      if (end <= start) {
        return { success: false, message: 'Η ώρα λήξης πρέπει να είναι μετά την ώρα έναρξης.' };
      }

      const conflictingAppointment = appointments.find(
        (appointment) =>
          appointment.barberId === input.barberId &&
          appointment.date === input.date &&
          appointment.status === 'confirmed' &&
          timeToMinutes(appointment.startTime) < end &&
          timeToMinutes(appointment.endTime) > start,
      );

      if (conflictingAppointment) {
        return { success: false, message: 'Υπάρχει ήδη επιβεβαιωμένο ραντεβού μέσα στο block.' };
      }

      const conflictingBlock = blocks.find(
        (block) =>
          block.barberId === input.barberId &&
          block.date === input.date &&
          timeToMinutes(block.startTime) < end &&
          timeToMinutes(block.endTime) > start,
      );

      if (conflictingBlock) {
        return { success: false, message: 'Υπάρχει ήδη άλλο block σε αυτές τις ώρες.' };
      }

      setBlocks((prev) =>
        [...prev, { id: nanoid(), ...input }].sort((a, b) => {
          if (a.date === b.date) {
            return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
          }
          return a.date.localeCompare(b.date);
        }),
      );

      return { success: true };
    },
    [appointments, blocks, getBarberById, setBlocks],
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      setBlocks((prev) => prev.filter((block) => block.id !== blockId));
    },
    [setBlocks],
  );

  const getAppointmentsForDate = useCallback(
    (date: string, barberId?: string) =>
      appointments
        .filter((appointment) =>
          appointment.date === date && (!barberId || appointment.barberId === barberId),
        )
        .sort(compareAppointments),
    [appointments],
  );

  const getAvailableSlots: BookingContextValue['getAvailableSlots'] = useCallback(
    (barberId, date, serviceId, ignoreAppointmentId) => {
      const barber = getBarberById(barberId);
      const service = getServiceById(serviceId);

      if (!barber || !service) {
        return [];
      }

      return generateAvailableSlots({
        barber,
        service,
        date,
        appointments,
        blocks,
        ignoreAppointmentId,
      });
    },
    [appointments, blocks, getBarberById, getServiceById],
  );

  const getDailyMetrics = useCallback(
    (date: string) => calculateMetrics(getAppointmentsForDate(date), SERVICES),
    [getAppointmentsForDate],
  );

  const value = useMemo<BookingContextValue>(
    () => ({
      services: SERVICES,
      barbers: BARBERS,
      appointments,
      blocks,
      createAppointment,
      cancelAppointment,
      rescheduleAppointment,
      blockTime,
      removeBlock,
      getAppointmentsForDate,
      getAvailableSlots,
      getServiceById,
      getBarberById,
      getDailyMetrics,
    }),
    [
      appointments,
      blocks,
      createAppointment,
      cancelAppointment,
      rescheduleAppointment,
      blockTime,
      removeBlock,
      getAppointmentsForDate,
      getAvailableSlots,
      getServiceById,
      getBarberById,
      getDailyMetrics,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking πρέπει να χρησιμοποιηθεί μέσα σε BookingProvider');
  }
  return context;
};
