import { format, isBefore, parseISO } from 'date-fns';
import { el as elLocale } from 'date-fns/locale';
import type {
  Appointment,
  AppointmentMetrics,
  AvailabilityBlock,
  Barber,
  Service,
  TimeSlot,
  Weekday,
} from '../types';

export const timeToMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const rangesOverlap = (
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean => startA < endB && startB < endA;

export const weekdayFromDate = (date: string): Weekday => {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.getDay() as Weekday;
};

export const getScheduleForDay = (barber: Barber, day: Weekday) =>
  barber.schedule.find((item) => item.day === day);

export const getBreaksForDay = (barber: Barber, day: Weekday) =>
  barber.breaks?.filter((item) => item.day === day) ?? [];

interface GenerateSlotsOptions {
  barber: Barber;
  service: Service;
  date: string;
  appointments: Appointment[];
  blocks: AvailabilityBlock[];
  ignoreAppointmentId?: string;
}

export const generateAvailableSlots = ({
  barber,
  service,
  date,
  appointments,
  blocks,
  ignoreAppointmentId,
}: GenerateSlotsOptions): TimeSlot[] => {
  const weekday = weekdayFromDate(date);
  const schedule = getScheduleForDay(barber, weekday);

  if (!schedule) {
    return [];
  }

  const breaks = getBreaksForDay(barber, weekday);
  const dayAppointments = appointments.filter(
    (appointment) =>
      appointment.barberId === barber.id &&
      appointment.date === date &&
      appointment.status === 'confirmed' &&
      appointment.id !== ignoreAppointmentId,
  );

  const dayBlocks = blocks.filter((block) => block.barberId === barber.id && block.date === date);

  const startMinutes = timeToMinutes(schedule.startTime);
  const endMinutes = timeToMinutes(schedule.endTime);
  const serviceDuration = service.duration;
  const interval = barber.slotInterval;

  const slots: TimeSlot[] = [];

  for (
    let currentStart = startMinutes;
    currentStart + serviceDuration <= endMinutes;
    currentStart += interval
  ) {
    const currentEnd = currentStart + serviceDuration;

    const overlapsBreak = breaks.some((period) =>
      rangesOverlap(currentStart, currentEnd, timeToMinutes(period.startTime), timeToMinutes(period.endTime)),
    );

    if (overlapsBreak) {
      continue;
    }

    const overlapsBlock = dayBlocks.some((block) =>
      rangesOverlap(currentStart, currentEnd, timeToMinutes(block.startTime), timeToMinutes(block.endTime)),
    );

    if (overlapsBlock) {
      continue;
    }

    const overlapsAppointment = dayAppointments.some((appointment) =>
      rangesOverlap(
        currentStart,
        currentEnd,
        timeToMinutes(appointment.startTime),
        timeToMinutes(appointment.endTime),
      ),
    );

    if (overlapsAppointment) {
      continue;
    }

    slots.push({
      startTime: minutesToTime(currentStart),
      endTime: minutesToTime(currentEnd),
      label: `${minutesToTime(currentStart)} - ${minutesToTime(currentEnd)}`,
    });
  }

  return slots;
};

export const isBarberOpenOnDate = (barber: Barber, date: string) => {
  const weekday = weekdayFromDate(date);
  return Boolean(getScheduleForDay(barber, weekday));
};

export const isBarberOpenNow = (barber: Barber): boolean => {
  const now = new Date();
  const weekday = now.getDay() as Weekday;
  const schedule = getScheduleForDay(barber, weekday);

  if (!schedule) {
    return false;
  }

  const start = timeToMinutes(schedule.startTime);
  const end = timeToMinutes(schedule.endTime);
  const current = now.getHours() * 60 + now.getMinutes();

  return current >= start && current < end;
};

export const slotToDateTime = (date: string, time: string): string => `${date}T${time}:00`;

export const isPastSlot = (date: string, time: string): boolean => {
  const slot = parseISO(slotToDateTime(date, time));
  return isBefore(slot, new Date());
};

export const calculateMetrics = (
  appointments: Appointment[],
  services: Service[],
  targetDate?: string,
): AppointmentMetrics => {
  const relevantAppointments = targetDate
    ? appointments.filter((item) => item.date === targetDate)
    : appointments;

  const totalAppointments = relevantAppointments.length;
  const cancelledAppointments = relevantAppointments.filter((item) => item.status === 'cancelled').length;
  const completedAppointments = totalAppointments - cancelledAppointments;
  const uniqueCustomers = new Set(
    relevantAppointments.filter((item) => item.status === 'confirmed').map((item) => item.customer.phone),
  ).size;

  const estimatedRevenue = relevantAppointments.reduce((acc, appointment) => {
    if (appointment.status === 'cancelled') {
      return acc;
    }
    const service = services.find((item) => item.id === appointment.serviceId);
    return service ? acc + service.price : acc;
  }, 0);

  return {
    totalAppointments,
    cancelledAppointments,
    completedAppointments,
    uniqueCustomers,
    estimatedRevenue,
  };
};

export const formatDisplayDate = (date: string) =>
  format(new Date(`${date}T00:00:00`), 'EEEE dd/MM', { locale: elLocale });

export const isSlotAvailable = (
  barber: Barber,
  service: Service,
  date: string,
  startTime: string,
  appointments: Appointment[],
  blocks: AvailabilityBlock[],
  ignoreAppointmentId?: string,
) => {
  const slots = generateAvailableSlots({
    barber,
    service,
    date,
    appointments,
    blocks,
    ignoreAppointmentId,
  });

  return slots.some((slot) => slot.startTime === startTime);
};
