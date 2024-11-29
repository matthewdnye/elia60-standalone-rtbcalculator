import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalculatorIcon } from '@heroicons/react/24/outline';

// Get the deployed URL from environment or fallback to localhost for development
const DEPLOYED_URL = import.meta.env.VITE_DEPLOYED_URL || 'https://elite-advisor-tools.netlify.app';

const calculators = [
  {
    id: 'retirement-tax-calculator',
    name: 'Retirement Tax Calculator',
    description: 'Compare tax implications of qualified accounts vs Roth conversion strategies.',
    path: '/calculator/retirement-tax',
    icon: CalculatorIcon,
    embedCode: `<iframe 
  src="${DEPLOYED_URL}/embed/calculator/retirement-tax" 
  width="100%" 
  height="800" 
  style="border: none; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);"
  title="Retirement Tax Calculator"
></iframe>`
  },
];

export function Dashboard() {
  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>(() => {
    const savedWebhooks = localStorage.getItem('calculator_webhooks');
    return savedWebhooks ? JSON.parse(savedWebhooks) : {};
  });
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showWebhookSuccess, setShowWebhookSuccess] = useState<string | null>(null);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);

  const saveWebhookUrl = (calculatorId: string, url: string) => {
    try {
      setWebhookError(null);
      
      if (!url) {
        setWebhookError('Please enter a webhook URL');
        return;
      }

      new URL(url);
      
      const newWebhookUrls = { ...webhookUrls, [calculatorId]: url };
      setWebhookUrls(newWebhookUrls);
      
      localStorage.setItem('calculator_webhooks', JSON.stringify(newWebhookUrls));
      
      setShowWebhookSuccess(calculatorId);
      setTimeout(() => setShowWebhookSuccess(null), 3000);
    } catch (error) {
      console.error('Invalid webhook URL:', error);
      setWebhookError('Please enter a valid URL');
    }
  };

  const copyEmbedCode = (id: string, embedCode: string) => {
    navigator.clipboard.writeText(embedCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calculator) => (
          <div
            key={calculator.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center mb-4">
                <calculator.icon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">{calculator.name}</h2>
              </div>
              <p className="text-gray-600">{calculator.description}</p>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HighLevel Webhook URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={webhookUrls[calculator.id] || ''}
                    onChange={(e) => {
                      const newWebhookUrls = { ...webhookUrls };
                      newWebhookUrls[calculator.id] = e.target.value;
                      setWebhookUrls(newWebhookUrls);
                    }}
                    placeholder="https://services.leadconnectorhq.com/hooks/..."
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 text-sm"
                  />
                  <button
                    onClick={() => saveWebhookUrl(calculator.id, webhookUrls[calculator.id] || '')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Save
                  </button>
                </div>
                {webhookError && (
                  <p className="mt-2 text-sm text-red-600">{webhookError}</p>
                )}
                {showWebhookSuccess === calculator.id && (
                  <p className="mt-2 text-sm text-green-600">Webhook URL saved successfully!</p>
                )}
              </div>
              
              <div className="space-y-4 pt-4">
                <Link
                  to={calculator.path}
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Open Calculator
                </Link>
                
                <button
                  onClick={() => copyEmbedCode(calculator.id, calculator.embedCode)}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {copiedId === calculator.id ? 'Copied!' : 'Copy Embed Code'}
                </button>

                <button
                  onClick={() => setSelectedCalculator(calculator.id)}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Preview Embed
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Embed Preview Section */}
      {selectedCalculator && (
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Embed Preview</h2>
              <button
                onClick={() => setSelectedCalculator(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close Preview
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <iframe
                src={`/embed/calculator/retirement-tax`}
                width="100%"
                height="800"
                style={{ border: 'none', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                title="Calculator Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}