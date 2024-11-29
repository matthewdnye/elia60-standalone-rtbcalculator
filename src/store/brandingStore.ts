import { create } from 'zustand';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import type { BrandingSettings } from '../types/branding';

interface BrandingState {
  settings: BrandingSettings | null;
  loading: boolean;
  error: string | null;
  loadBranding: () => Promise<void>;
  saveBranding: (settings: BrandingSettings) => Promise<void>;
}

// Default branding settings for development
const defaultBranding: BrandingSettings = {
  companyName: 'Elite Advisor Services',
  website: 'www.eliteadvisorservices.com',
  logoUrl: 'https://placehold.co/400x100?text=Elite+Advisor+Services',
  primaryColor: '#2563eb',
  secondaryColor: '#16a34a',
  accentColor: '#f59e0b',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@eliteadvisorservices.com',
  phone: '(555) 123-4567',
  streetAddress: '123 Financial Plaza',
  city: 'New York',
  state: 'NY',
  postalCode: '10001'
};

export const useBrandingStore = create<BrandingState>((set) => ({
  settings: defaultBranding, // Use default branding for development
  loading: false,
  error: null,

  loadBranding: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      set({ settings: defaultBranding }); // Use default if not logged in
      return;
    }

    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'branding', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        set({ settings: docSnap.data() as BrandingSettings });
      } else {
        set({ settings: defaultBranding }); // Use default if no saved settings
      }
    } catch (error) {
      console.error('Error loading branding:', error);
      set({ settings: defaultBranding }); // Use default on error
    } finally {
      set({ loading: false });
    }
  },

  saveBranding: async (settings: BrandingSettings) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      set({ error: 'You must be logged in to save branding settings' });
      return;
    }

    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'branding', userId);
      await setDoc(docRef, settings);
      set({ settings });
    } catch (error) {
      set({ error: 'Failed to save branding settings. Please try again.' });
      console.error('Error saving branding:', error);
    } finally {
      set({ loading: false });
    }
  },
}));