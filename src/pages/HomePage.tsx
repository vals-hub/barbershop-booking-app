import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { isBarberOpenNow } from '../utils/scheduling';

export const HomePage = () => {
  const { services, barbers } = useBooking();
  const openBarbers = barbers.filter((barber) => isBarberOpenNow(barber));

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>Κλείσε ραντεβού στο αγαπημένο σου κουρείο μέσα σε δευτερόλεπτα.</h1>
          <p>
            Δες διαθέσιμες ώρες, επίλεξε υπηρεσία και πάρε επιβεβαίωση χωρίς τηλέφωνα και αναμονές.
            Η πλατφόρμα Barberhood κρατάει οργανωμένο το πρόγραμμα για πελάτη και κουρέα.
          </p>
          <Link to="/book" className="btn btn-primary">
            Κλείσε ραντεβού τώρα
          </Link>
        </div>
        <div className="hero__aside">
          <h2>Τι κερδίζεις</h2>
          <ul className="checklist">
            <li>Διαθέσιμα slots σε πραγματικό χρόνο</li>
            <li>Άμεση επιβεβαίωση και υπενθύμιση πριν το ραντεβού</li>
            <li>Διαχείριση προγράμματος για όλη την ομάδα</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <h2>Ανοιχτά τώρα</h2>
        {openBarbers.length === 0 ? (
          <p className="muted">Κανένα κουρείο δεν είναι ανοιχτό αυτή τη στιγμή. Κλείσε για την επόμενη διαθέσιμη ώρα!</p>
        ) : (
          <div className="grid">
            {openBarbers.map((barber) => (
              <div className="card" key={barber.id}>
                <h3>{barber.name}</h3>
                <p>{barber.location}</p>
                <p className="muted">{barber.specialties.join(' · ')}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Υπηρεσίες</h2>
        <div className="grid">
          {services.map((service) => (
            <div className="card" key={service.id}>
              <div className="card__header">
                <h3>{service.name}</h3>
                <span className="tag">{service.duration}ʼ</span>
              </div>
              <p>{service.description}</p>
              <div className="card__footer">
                <span className="card__price">€{service.price.toFixed(2)}</span>
                <span className="card__category">{service.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Πώς λειτουργεί</h2>
        <div className="flow">
          <div>
            <span className="step-number">1</span>
            <h3>Διαλέγεις υπηρεσία</h3>
            <p>Κούρεμα, ξύρισμα, combo, παιδικό ή grooming με ξεκάθαρη διάρκεια και τιμή.</p>
          </div>
          <div>
            <span className="step-number">2</span>
            <h3>Κλείνεις slot</h3>
            <p>Επιλέγεις ημέρα και ώρα από τα διαθέσιμα slots και δίνεις στοιχεία επικοινωνίας.</p>
          </div>
          <div>
            <span className="step-number">3</span>
            <h3>Λαμβάνεις επιβεβαίωση</h3>
            <p>Ο κουρέας βλέπει το ραντεβού άμεσα και λαμβάνεις υπενθύμιση πριν την επίσκεψη.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
