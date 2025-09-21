import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useBooking } from '../../context/BookingContext';

interface BlockFormProps {
  defaultDate: string;
}

export const BlockForm = ({ defaultDate }: BlockFormProps) => {
  const { barbers, blockTime } = useBooking();
  const [message, setMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    barberId: barbers[0]?.id ?? '',
    date: defaultDate,
    startTime: '13:00',
    endTime: '14:00',
    reason: 'Διάλειμμα',
  });

  useEffect(() => {
    setFormState((prev) => ({ ...prev, date: defaultDate }));
  }, [defaultDate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.barberId) {
      setMessage('Επιλέξτε κουρέα.');
      return;
    }
    const result = blockTime(formState);
    setMessage(result.success ? 'Το block αποθηκεύτηκε.' : result.message ?? 'Σφάλμα.');
  };

  return (
    <form className="card block-form" onSubmit={handleSubmit}>
      <h3>Κλείσε ώρες</h3>
      <div className="form-grid">
        <label className="form-field">
          <span>Κουρέας</span>
          <select
            value={formState.barberId}
            onChange={(event) => setFormState((prev) => ({ ...prev, barberId: event.target.value }))}
          >
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Ημερομηνία</span>
          <input
            type="date"
            value={formState.date}
            onChange={(event) => setFormState((prev) => ({ ...prev, date: event.target.value }))}
          />
        </label>
        <label className="form-field">
          <span>Από</span>
          <input
            type="time"
            value={formState.startTime}
            onChange={(event) => setFormState((prev) => ({ ...prev, startTime: event.target.value }))}
          />
        </label>
        <label className="form-field">
          <span>Έως</span>
          <input
            type="time"
            value={formState.endTime}
            onChange={(event) => setFormState((prev) => ({ ...prev, endTime: event.target.value }))}
          />
        </label>
        <label className="form-field">
          <span>Αιτία</span>
          <input
            type="text"
            value={formState.reason}
            onChange={(event) => setFormState((prev) => ({ ...prev, reason: event.target.value }))}
          />
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Αποθήκευση block
      </button>
      {message && <p className="feedback">{message}</p>}
    </form>
  );
};

export default BlockForm;
