import { create } from 'zustand';
import type { CalculatorEntry } from '../types/calculator';

interface CalculatorState {
  loading: boolean;
  error: string | null;
  lastSubmission: {
    success: boolean;
    timestamp: string;
    data?: any;
  } | null;
  saveEntry: (entry: CalculatorEntry) => Promise<void>;
}

// Fallback webhook URL - only used if no saved URL exists
const FALLBACK_WEBHOOK_URL = import.meta.env.VITE_HIGHLEVEL_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/jozRUqQWa9zk8ExtFbmV/webhook-trigger/7e796d50-37cb-4de3-a71d-5060fb1aceee';

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 ? `+1${cleaned}` : 
         cleaned.length === 11 && cleaned.startsWith('1') ? `+${cleaned}` : 
         phone;
};

const getWebhookUrl = (calculatorId: string): string => {
  try {
    const savedWebhooks = localStorage.getItem('calculator_webhooks');
    if (!savedWebhooks) {
      console.log('No saved webhooks found, using fallback');
      return FALLBACK_WEBHOOK_URL;
    }

    const webhookUrls = JSON.parse(savedWebhooks);
    console.log('Retrieved webhook URLs:', webhookUrls);
    
    // Use exact calculator ID match
    const savedUrl = webhookUrls['retirement-tax-calculator'];

    if (!savedUrl) {
      console.log('No webhook URL found for calculator retirement-tax-calculator, using fallback');
      return FALLBACK_WEBHOOK_URL;
    }

    console.log('Using saved webhook URL:', savedUrl);
    return savedUrl;
  } catch (error) {
    console.error('Error retrieving webhook URL:', error);
    return FALLBACK_WEBHOOK_URL;
  }
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  loading: false,
  error: null,
  lastSubmission: null,

  saveEntry: async (entry) => {
    try {
      set({ loading: true, error: null });

      // Always use consistent calculator ID
      const calculatorId = 'retirement-tax-calculator';
      const webhookUrl = getWebhookUrl(calculatorId);

      console.log('Preparing webhook submission:', {
        calculatorId,
        webhookUrl,
        entry
      });

      const payload = {
        firstName: entry.firstName.trim(),
        lastName: entry.lastName.trim(),
        email: entry.email.trim().toLowerCase(),
        phone: formatPhoneNumber(entry.phone),
        state: entry.state,
        age: Number(entry.age),
        qualifiedAccountValue: Number(entry.qualifiedAccountValue),
        taxBracket: Number(entry.taxBracket),
        growthRate: Number(entry.growthRate),
        calculatorId,
        timestamp: new Date().toISOString(),
        source: 'Retirement Tax Calculator',
        status: 'new',
        metadata: {
          birthYear: entry.birthYear,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        }
      };

      console.log('Sending payload to webhook:', {
        url: webhookUrl,
        payload
      });

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let responseData;
      const responseText = await response.text();

      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        console.log('Response is not JSON:', responseText);
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          `Webhook error (${response.status}): ${
            responseData?.message || responseText || response.statusText
          }`
        );
      }

      console.log('Webhook submission successful:', {
        status: response.status,
        response: responseData
      });

      set({
        lastSubmission: {
          success: true,
          timestamp: new Date().toISOString(),
          data: responseData
        }
      });

    } catch (error) {
      console.error('Webhook submission error:', error);
      
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to save lead data. Please try again.';

      set({ 
        error: errorMessage,
        lastSubmission: {
          success: false,
          timestamp: new Date().toISOString(),
          data: { error: errorMessage }
        }
      });

      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));