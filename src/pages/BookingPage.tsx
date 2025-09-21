import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { addDays, format } from 'date-fns';
import { useBooking } from '../context/BookingContext';
import type { Service, Barber, TimeSlot } from '../types';
import StepIndicator from '../components/StepIndicator';
import ServiceCard from '../components/ServiceCard';
import BarberCard from '../components/BarberCard';
import TimeSlotGrid from '../components/TimeSlotGrid';
import AppointmentSummary from '../components/AppointmentSummary';
import { isBarberOpenOnDate } from '../utils/scheduling';

const steps = ['Υπηρεσία', 'Κουρέας', 'Ημέρα & ώρα', 'Στοιχεία'];

const initialCustomer = { name: '', phone: '', email: '', notes: '' };

export const BookingPage = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 21), 'yyyy-MM-dd');

  const { services, barbers, createAppointment, getAvailableSlots } = useBooking();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [customer, setCustomer] = useState(initialCustomer);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const slots = useMemo(() => {
    if (!selectedBarber || !selectedService) {
      return [];
    }
    return getAvailableSlots(selectedBarber.id, selectedDate, selectedService.id);
  }, [getAvailableSlots, selectedBarber, selectedService, selectedDate]);

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedService || !selectedBarber || !selectedSlot) {
      setFeedback('Συμπλήρωσε όλα τα βήματα πριν την επιβεβαίωση.');
      return;
    }
    if (!customer.name || !customer.phone) {
      setFeedback('Συμπλήρωσε όνομα και τηλέφωνο.');
      return;
    }

    const result = createAppointment({
      barberId: selectedBarber.id,
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      customer,
    });

    if (!result.success) {
      setFeedback(result.message ?? 'Αδυναμία αποθήκευσης.');
      return;
    }

    setFeedback('Το ραντεβού επιβεβαιώθηκε! Θα λάβεις υπενθύμιση πριν την επίσκεψη.');
    setSuccess(true);
  };

  const resetBooking = () => {
    setCurrentStep(0);
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedSlot(null);
    setCustomer(initialCustomer);
    setFeedback(null);
    setSuccess(false);
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return Boolean(selectedService);
    }
    if (currentStep === 1) {
      return Boolean(selectedBarber);
    }
    if (currentStep === 2) {
      return Boolean(selectedSlot) && (!selectedBarber || isBarberOpenOnDate(selectedBarber, selectedDate));
    }
    return true;
  };

  const showNext = currentStep < steps.length - 1;

  return (
    <div className="page">
      <h1>Κράτηση ραντεβού</h1>
      <StepIndicator steps={steps} currentStep={currentStep} />

      {currentStep === 0 && (
        <section className="section">
          <h2>Επίλεξε υπηρεσία</h2>
          <div className="grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedService?.id === service.id}
                onSelect={(value) => {
                  setSelectedService(value);
                  setCurrentStep(1);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {currentStep === 1 && (
        <section className="section">
          <h2>Διάλεξε κουρέα</h2>
          <div className="grid">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                isSelected={selectedBarber?.id === barber.id}
                onSelect={(value) => {
                  setSelectedBarber(value);
                  setCurrentStep(2);
                }}
                selectedDate={selectedDate}
              />
            ))}
          </div>
        </section>
      )}

      {currentStep === 2 && selectedService && selectedBarber && (
        <section className="section">
          <h2>Ημερομηνία & ώρα</h2>
          <div className="form-grid">
            <label className="form-field">
              <span>Ημερομηνία</span>
              <input
                type="date"
                value={selectedDate}
                min={today}
                max={maxDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedSlot(null);
                }}
              />
            </label>
          </div>
          {!isBarberOpenOnDate(selectedBarber, selectedDate) ? (
            <p className="feedback warning">Ο κουρέας δεν εργάζεται αυτή την ημέρα.</p>
          ) : (
            <TimeSlotGrid
              date={selectedDate}
              slots={slots}
              selectedSlot={selectedSlot}
              onSelect={(value) => setSelectedSlot(value)}
            />
          )}
        </section>
      )}

      {currentStep === 3 && selectedService && selectedBarber && selectedSlot && (
        <section className="section">
          <h2>Στοιχεία επικοινωνίας</h2>
          <form className="form" onSubmit={handleConfirm}>
            <div className="form-grid">
              <label className="form-field">
                <span>Ονοματεπώνυμο</span>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </label>
              <label className="form-field">
                <span>Τηλέφωνο</span>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value }))}
                  required
                />
              </label>
              <label className="form-field">
                <span>Email (προαιρετικό)</span>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) => setCustomer((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>
              <label className="form-field">
                <span>Σημειώσεις</span>
                <textarea
                  value={customer.notes}
                  onChange={(event) => setCustomer((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={3}
                />
              </label>
            </div>
            <AppointmentSummary
              service={selectedService}
              barber={selectedBarber}
              date={selectedDate}
              slot={selectedSlot}
              customer={customer}
            />
            <button type="submit" className="btn btn-primary">
              Επιβεβαίωση ραντεβού
            </button>
            {feedback && <p className="feedback">{feedback}</p>}
            {success && (
              <button type="button" className="btn btn-secondary" onClick={resetBooking}>
                Κλείσε νέο ραντεβού
              </button>
            )}
          </form>
        </section>
      )}

      <div className="booking-controls">
        {currentStep > 0 && !success && (
          <button type="button" className="btn btn-outline" onClick={goBack}>
            Πίσω
          </button>
        )}
        {showNext && !success && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={goNext}
            disabled={!canProceed()}
          >
            Επόμενο
          </button>
        )}
      </div>
      {feedback && currentStep !== 3 && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default BookingPage;
