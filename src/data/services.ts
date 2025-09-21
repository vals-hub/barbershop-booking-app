import type { Service } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'classic-cut',
    name: 'Κλασικό Κούρεμα',
    duration: 30,
    price: 15,
    description: 'Κλασικό καθάρισμα και styling με προσαρμογή στο σχήμα του προσώπου.',
    category: 'hair',
  },
  {
    id: 'skin-fade',
    name: 'Skin Fade',
    duration: 45,
    price: 20,
    description: 'Σύγχρονο fade με καθαρές γραμμές και τελείωμα με προϊόν styling.',
    category: 'hair',
  },
  {
    id: 'beard-detail',
    name: 'Περιποίηση Γενειάδας',
    duration: 25,
    price: 12,
    description: 'Ξύρισμα ή σχήμα με ζεστή πετσέτα, έλαια και περιποίηση δέρματος.',
    category: 'beard',
  },
  {
    id: 'combo-cut-beard',
    name: 'Combo Κούρεμα + Γένια',
    duration: 60,
    price: 28,
    description: 'Πλήρες πακέτο για κούρεμα και περιποίηση γενειάδας με προϊόντα grooming.',
    category: 'combo',
  },
  {
    id: 'kids-cut',
    name: 'Παιδικό Κούρεμα',
    duration: 30,
    price: 12,
    description: 'Ειδικά για μικρούς φίλους, με υπομονή και παιχνίδι για άνετη εμπειρία.',
    category: 'kids',
  },
  {
    id: 'grooming-boost',
    name: 'Grooming Boost',
    duration: 35,
    price: 18,
    description: 'Καθαρισμός προσώπου, ενυδάτωση και styling για εμφανίσεις που ξεχωρίζουν.',
    category: 'grooming',
  },
];
