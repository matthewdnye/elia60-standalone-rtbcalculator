import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
  netlifyEmail?: string;
  netlifyApiKey?: string;
  customDomain?: string;
  githubRepo?: string;
  githubToken?: string;
  highlevelWebhook?: string;
  openRouterKey?: string;
  mindpalKey?: string;
  apifyKey?: string;
  clayApiKey?: string;
  setConfig: (config: Partial<ConfigState>) => void;
  isSetupComplete: boolean;
  completeSetup: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      netlifyEmail: 'dev@example.com',
      netlifyApiKey: 'dummy-key',
      customDomain: 'example.com',
      githubRepo: 'https://github.com/example/repo',
      githubToken: 'dummy-token',
      highlevelWebhook: 'https://api.example.com/webhook',
      openRouterKey: 'dummy-openrouter-key',
      mindpalKey: 'dummy-mindpal-key',
      apifyKey: 'dummy-apify-key',
      clayApiKey: 'dummy-clay-key',
      isSetupComplete: true, // Set to true to skip wizard
      setConfig: (config) => set((state) => ({ ...state, ...config })),
      completeSetup: () => set({ isSetupComplete: true }),
    }),
    {
      name: 'config-storage',
    }
  )
);