import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export const ServiceCard = ({ service, isSelected, onSelect }: ServiceCardProps) => (
  <button
    type="button"
    className={`card service-card ${isSelected ? 'card--selected' : ''}`}
    onClick={() => onSelect(service)}
  >
    <div className="card__header">
      <h3>{service.name}</h3>
      <span className="tag">{service.duration}ʼ</span>
    </div>
    <p className="card__description">{service.description}</p>
    <div className="card__footer">
      <span className="card__price">€{service.price.toFixed(2)}</span>
      <span className="card__category">{service.category}</span>
    </div>
  </button>
);

export default ServiceCard;
