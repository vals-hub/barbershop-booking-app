import type { Barber } from '../types';
import { isBarberOpenNow, isBarberOpenOnDate } from '../utils/scheduling';

interface BarberCardProps {
  barber: Barber;
  isSelected: boolean;
  onSelect: (barber: Barber) => void;
  selectedDate?: string;
}

export const BarberCard = ({ barber, isSelected, onSelect, selectedDate }: BarberCardProps) => {
  const openToday = selectedDate ? isBarberOpenOnDate(barber, selectedDate) : true;
  const openNow = isBarberOpenNow(barber);

  return (
    <button
      type="button"
      className={`card barber-card ${isSelected ? 'card--selected' : ''}`}
      onClick={() => onSelect(barber)}
    >
      <div className="card__header">
        <h3>{barber.name}</h3>
        <span className={`status ${openNow ? 'status--success' : 'status--muted'}`}>
          {openNow ? 'Ανοιχτό τώρα' : 'Εκτός ωραρίου'}
        </span>
      </div>
      <p className="card__description">{barber.bio}</p>
      <div className="barber-card__meta">
        <span>{barber.experience} χρόνια εμπειρίας</span>
        <span>{barber.location}</span>
      </div>
      <div className="barber-card__tags">
        {barber.specialties.map((item) => (
          <span className="tag" key={item}>
            {item}
          </span>
        ))}
      </div>
      {selectedDate && (
        <p className={`barber-card__availability ${openToday ? 'text-success' : 'text-warning'}`}>
          {openToday ? 'Διαθέσιμος την επιλεγμένη ημέρα' : 'Δεν εργάζεται την επιλεγμένη ημέρα'}
        </p>
      )}
    </button>
  );
};

export default BarberCard;
