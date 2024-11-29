import React from 'react';
import { useConfigStore } from '../store/configStore';

export function Integrations() {
  const config = useConfigStore();

  const integrations = [
    {
      name: 'HighLevel CRM',
      status: config.highlevelWebhook ? 'Connected' : 'Not Connected',
      description: 'Automatically sync leads with your CRM',
    },
    {
      name: 'OpenRouter AI',
      status: config.openRouterKey ? 'Connected' : 'Not Connected',
      description: 'AI-powered insights and analytics',
    },
    {
      name: 'MindPal.Space',
      status: config.mindpalKey ? 'Connected' : 'Not Connected',
      description: 'Interactive analytics and reporting',
    },
    {
      name: 'Apify',
      status: config.apifyKey ? 'Connected' : 'Not Connected',
      description: 'Automated data updates and web scraping',
    },
    {
      name: 'Clay.com',
      status: config.clayApiKey ? 'Connected' : 'Not Connected',
      description: 'Lead enrichment and data enhancement',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Integrations</h1>
      <div className="space-y-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{integration.name}</h2>
              <p className="text-gray-600">{integration.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  integration.status === 'Connected'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {integration.status}
              </span>
              <button className="text-blue-600 hover:text-blue-700">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}