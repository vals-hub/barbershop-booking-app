import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useBooking } from '../context/BookingContext';
import { calculateMetrics } from '../utils/scheduling';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import BlockForm from '../components/dashboard/BlockForm';
import StatsOverview from '../components/dashboard/StatsOverview';

export const DashboardPage = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { barbers, services, blocks, removeBlock, getAppointmentsForDate } = useBooking();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedBarber, setSelectedBarber] = useState<string>('all');

  const appointments = useMemo(
    () =>
      getAppointmentsForDate(
        selectedDate,
        selectedBarber === 'all' ? undefined : selectedBarber,
      ),
    [getAppointmentsForDate, selectedBarber, selectedDate],
  );

  const metrics = useMemo(() => calculateMetrics(appointments, services), [appointments, services]);

  const blocksForDay = useMemo(
    () =>
      blocks.filter(
        (block) =>
          block.date === selectedDate &&
          (selectedBarber === 'all' ? true : block.barberId === selectedBarber),
      ),
    [blocks, selectedBarber, selectedDate],
  );

  return (
    <div className="page">
      <h1>Dashboard κουρέα</h1>
      <section className="filters">
        <label className="form-field">
          <span>Ημερομηνία</span>
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </label>
        <label className="form-field">
          <span>Κουρέας</span>
          <select value={selectedBarber} onChange={(event) => setSelectedBarber(event.target.value)}>
            <option value="all">Όλοι</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <StatsOverview
        metrics={metrics}
        title={`Σύνοψη για ${selectedBarber === 'all' ? 'όλους τους κουρείς' : barbers.find((barber) => barber.id === selectedBarber)?.name ?? ''}`}
      />

      <div className="dashboard-grid">
        <section className="card">
          <h2>Ραντεβού ημέρας</h2>
          {appointments.length === 0 ? (
            <p className="muted">Δεν υπάρχουν ραντεβού για την επιλεγμένη ημέρα.</p>
          ) : (
            <div className="vertical-stack">
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </section>
        <section className="card">
          <h2>Blocks διαθεσιμότητας</h2>
          {blocksForDay.length === 0 ? (
            <p className="muted">Δεν υπάρχουν κλειστές ώρες για αυτή την ημερομηνία.</p>
          ) : (
            <ul className="block-list">
              {blocksForDay.map((block) => {
                const barberName = barbers.find((barber) => barber.id === block.barberId)?.name ?? '';
                return (
                  <li key={block.id}>
                    <div>
                      <strong>{barberName}</strong>
                      <p className="muted">
                        {block.startTime} - {block.endTime} · {block.reason}
                      </p>
                    </div>
                    <button type="button" className="btn btn-outline" onClick={() => removeBlock(block.id)}>
                      Άνοιγμα
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <BlockForm defaultDate={selectedDate} />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
