import type { AppointmentMetrics } from '../../types';

interface StatsOverviewProps {
  metrics: AppointmentMetrics;
  title: string;
}

export const StatsOverview = ({ metrics, title }: StatsOverviewProps) => (
  <section className="card stats-card">
    <h3>{title}</h3>
    <div className="stats-grid">
      <div>
        <span className="stats-value">{metrics.totalAppointments}</span>
        <span className="stats-label">Σύνολο ραντεβού</span>
      </div>
      <div>
        <span className="stats-value">{metrics.completedAppointments}</span>
        <span className="stats-label">Ολοκληρωμένα</span>
      </div>
      <div>
        <span className="stats-value">{metrics.cancelledAppointments}</span>
        <span className="stats-label">Ακυρώσεις</span>
      </div>
      <div>
        <span className="stats-value">{metrics.uniqueCustomers}</span>
        <span className="stats-label">Μοναδικοί πελάτες</span>
      </div>
      <div>
        <span className="stats-value">€{metrics.estimatedRevenue.toFixed(2)}</span>
        <span className="stats-label">Εκτ. έσοδα</span>
      </div>
    </div>
  </section>
);

export default StatsOverview;
