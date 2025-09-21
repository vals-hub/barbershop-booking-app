import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { Appointment, TimeSlot } from '../../types';
import { useBooking } from '../../context/BookingContext';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const {
    getServiceById,
    getBarberById,
    cancelAppointment,
    rescheduleAppointment,
    getAvailableSlots,
  } = useBooking();

  const service = getServiceById(appointment.serviceId);
  const barber = getBarberById(appointment.barberId);

  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState(appointment.date);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const availableSlots = useMemo(
    () =>
      getAvailableSlots(
        appointment.barberId,
        newDate,
        appointment.serviceId,
        appointment.id,
      ),
    [appointment.barberId, appointment.id, appointment.serviceId, getAvailableSlots, newDate],
  );

  if (!service || !barber) {
    return null;
  }

  const handleCancel = () => {
    cancelAppointment(appointment.id);
    setMessage('Το ραντεβού ακυρώθηκε.');
  };

  const handleReschedule = () => {
    if (!selectedSlot) {
      setMessage('Παρακαλούμε επιλέξτε νέο slot.');
      return;
    }
    const result = rescheduleAppointment(appointment.id, {
      date: newDate,
      startTime: selectedSlot.startTime,
    });

    if (!result.success) {
      setMessage(result.message ?? 'Αδυναμία μεταφοράς ραντεβού.');
      return;
    }

    setMessage('Το ραντεβού ενημερώθηκε επιτυχώς.');
    setShowReschedule(false);
  };

  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd');

  return (
    <article className={`appointment-card ${appointment.status === 'cancelled' ? 'appointment-card--cancelled' : ''}`}>
      <header className="appointment-card__header">
        <div>
          <h3>{service.name}</h3>
          <p className="appointment-card__meta">
            Με {barber.name} · {appointment.date} · {appointment.startTime} - {appointment.endTime}
          </p>
        </div>
        <span className={`status ${appointment.status === 'confirmed' ? 'status--success' : 'status--warning'}`}>
          {appointment.status === 'confirmed' ? 'Επιβεβαιωμένο' : 'Ακυρωμένο'}
        </span>
      </header>
      <div className="appointment-card__body">
        <p>
          <strong>{appointment.customer.name}</strong> · {appointment.customer.phone}
        </p>
        {appointment.customer.email && <p>{appointment.customer.email}</p>}
        {appointment.customer.notes && <p className="muted">Σημείωση: {appointment.customer.notes}</p>}
      </div>
      {message && <p className="feedback">{message}</p>}
      <footer className="appointment-card__actions">
        {appointment.status === 'confirmed' && (
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setShowReschedule((prev) => !prev)}>
              {showReschedule ? 'Ακύρωση' : 'Μεταφορά'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>
              Ακύρωση
            </button>
          </>
        )}
      </footer>
      {showReschedule && (
        <div className="reschedule-panel">
          <div className="reschedule-panel__controls">
            <label className="form-field">
              <span>Ημερομηνία</span>
              <input
                type="date"
                value={newDate}
                min={minDate}
                max={maxDate}
                onChange={(event) => {
                  setNewDate(event.target.value);
                  setSelectedSlot(null);
                }}
              />
            </label>
            <div className="reschedule-panel__slots">
              {availableSlots.length === 0 && <p className="empty-state">Δεν υπάρχουν διαθέσιμα slots.</p>}
              {availableSlots.map((slot) => (
                <button
                  type="button"
                  key={slot.startTime}
                  className={`timeslot ${selectedSlot?.startTime === slot.startTime ? 'timeslot--active' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleReschedule}>
            Αποθήκευση νέας ώρας
          </button>
        </div>
      )}
    </article>
  );
};

export default AppointmentCard;
