import type { TimeSlot } from '../types';
import { isPastSlot } from '../utils/scheduling';

interface TimeSlotGridProps {
  date: string;
  slots: TimeSlot[];
  selectedSlot?: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

export const TimeSlotGrid = ({ date, slots, selectedSlot, onSelect }: TimeSlotGridProps) => (
  <div className="timeslot-grid">
    {slots.length === 0 && <p className="empty-state">Δεν υπάρχουν διαθέσιμα slots για αυτή την ημέρα.</p>}
    {slots.map((slot) => {
      const disabled = isPastSlot(date, slot.startTime);
      const isActive = selectedSlot?.startTime === slot.startTime;
      return (
        <button
          key={slot.startTime}
          type="button"
          className={`timeslot ${isActive ? 'timeslot--active' : ''}`}
          onClick={() => onSelect(slot)}
          disabled={disabled}
        >
          {slot.label}
        </button>
      );
    })}
  </div>
);

export default TimeSlotGrid;
