import type { Barber, Service, TimeSlot } from '../types';

interface AppointmentSummaryProps {
  service: Service;
  barber: Barber;
  date: string;
  slot: TimeSlot;
  customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  };
}

export const AppointmentSummary = ({ service, barber, date, slot, customer }: AppointmentSummaryProps) => (
  <div className="summary-card">
    <h3>Σύνοψη ραντεβού</h3>
    <ul className="summary-list">
      <li>
        <span>Υπηρεσία</span>
        <strong>{service.name}</strong>
      </li>
      <li>
        <span>Κουρέας</span>
        <strong>{barber.name}</strong>
      </li>
      <li>
        <span>Ημερομηνία</span>
        <strong>{date}</strong>
      </li>
      <li>
        <span>Ώρα</span>
        <strong>{slot.label}</strong>
      </li>
      <li>
        <span>Πελάτης</span>
        <strong>{customer.name}</strong>
      </li>
      <li>
        <span>Επικοινωνία</span>
        <strong>{customer.phone}</strong>
      </li>
      {customer.email && (
        <li>
          <span>Email</span>
          <strong>{customer.email}</strong>
        </li>
      )}
      {customer.notes && (
        <li>
          <span>Σημειώσεις</span>
          <strong>{customer.notes}</strong>
        </li>
      )}
    </ul>
  </div>
);

export default AppointmentSummary;
