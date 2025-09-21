# Barberhood Booking App

Μια progressive web εφαρμογή για διαχείριση ραντεβού κουρείου. Οι πελάτες μπορούν να κλείσουν online ραντεβού, ενώ ο κουρέας διαχειρίζεται live τη διαθεσιμότητα, τα ραντεβού και τα στατιστικά του.

## Βασικές λειτουργίες

- **Ροή κράτησης σε 4 βήματα** – Επιλογή υπηρεσίας, κουρέα, διαθέσιμου slot και συμπλήρωση στοιχείων επικοινωνίας.
- **Πραγματική διαθεσιμότητα** – Εμφανίζονται μόνο slots που δεν συγκρούονται με υπάρχοντα ραντεβού ή κλειστές ώρες.
- **Dashboard κουρέα** – Ημερολόγιο ημέρας, ακυρώσεις και reschedule, μπλοκάρισμα ωρών, στατιστικά.
- **Persisted data** – Τα ραντεβού και τα blocks αποθηκεύονται τοπικά (localStorage) για γρήγορη δοκιμή.
- **Mobile-first σχεδιασμός** – Λειτουργεί ιδανικά σε κινητά και tablets.

## Τεχνολογίες

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) με TypeScript
- [React Router](https://reactrouter.com/) για πλοήγηση
- [date-fns](https://date-fns.org/) για χειρισμό ημερομηνιών
- `localStorage` για αποθήκευση mock δεδομένων

## Εκτέλεση τοπικά

```bash
npm install
npm run dev
```

Άνοιξε τον browser στη διεύθυνση που θα εμφανιστεί (συνήθως `http://localhost:5173`).

## Δομή

- `src/pages` – Αρχικές σελίδες (Home, Booking, Dashboard)
- `src/components` – Επαναχρησιμοποιήσιμα UI components
- `src/context/BookingContext.tsx` – Κεντρική διαχείριση δεδομένων / state
- `src/utils/scheduling.ts` – Business rules για slots και στατιστικά

## Επόμενα βήματα

- Διασύνδεση με πραγματικό backend (REST/GraphQL)
- Push ειδοποιήσεις ή SMS reminders
- Υποστήριξη πολλών καταστημάτων και πολλαπλών καρεκλών ανά κουρείο
- Εξαγωγή αναφορών & σύνδεση με συστήματα πληρωμών
