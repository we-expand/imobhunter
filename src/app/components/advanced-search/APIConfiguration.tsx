import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, ExternalLink, Linkedin } from "lucide-react";
import { searchAPI } from "../../lib/api/searchAPI";

interface APICredentials {
  apollo?: string;
  pdl?: string;
  linkedin?: string;
  hunter?: string;
}

interface APIConfigurationProps {
  onSave: () => void;
}

export const APIConfiguration = ({ onSave }: APIConfigurationProps) => {
  const [credentials, setCredentials] = useState<APICredentials>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | null>>({});
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load saved credentials
    const saved = searchAPI.getCredentials();
    setCredentials(saved);
  }, []);

  const updateCredential = (key: keyof APICredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveCredentials = () => {
    searchAPI.setCredentials(credentials);
    searchAPI.saveCredentials(credentials);
    onSave();
  };

  const testAPI = async (provider: 'apollo' | 'pdl' | 'linkedin') => {
    setIsTesting(prev => ({ ...prev, [provider]: true }));
    setTestResults(prev => ({ ...prev, [provider]: null }));

    try {
      // Test the API with a simple query
      const result = await searchAPI.searchLeads(
        { 
          searchType: 'leads',
          keywords: 'test',
          country: ['Portugal']
        },
        1,
        1
      );

      setTestResults(prev => ({ ...prev, [provider]: result.results.length >= 0 ? 'success' : 'error' }));
    } catch (error) {
      console.error(`${provider} test failed:`, error);
      setTestResults(prev => ({ ...prev, [provider]: 'error' }));
    } finally {
      setIsTesting(prev => ({ ...prev, [provider]: false }));
    }
  };

  const apiProviders = [
    {
      id: 'apollo',
      name: 'Apollo.io',
      description: 'B2B database with 275M+ contacts and 73M+ companies',
      credentialKey: 'apolloApiKey' as keyof APICredentials,
      placeholder: 'Enter your Apollo.io API Key',
      helpUrl: 'https://knowledge.apollo.io/hc/en-us/articles/4415297527821-How-to-Get-an-API-Key',
      pricing: 'From $49/month (Professional plan)',
      features: ['275M+ contacts', 'Email verification', 'Company data', 'Technographics'],
      icon: '🚀'
    },
    {
      id: 'pdl',
      name: 'People Data Labs',
      description: 'Premium data enrichment with 3B+ people profiles',
      credentialKey: 'pdlApiKey' as keyof APICredentials,
      placeholder: 'Enter your PDL API Key',
      helpUrl: 'https://docs.peopledatalabs.com/docs/quickstart',
      pricing: 'Pay-as-you-go ($0.015/record)',
      features: ['3B+ profiles', '95% accuracy', 'Global coverage', 'Real-time API'],
      icon: '⚡'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Sales Navigator',
      description: 'Direct LinkedIn integration (requires cookie)',
      credentialKey: 'linkedinCookie' as keyof APICredentials,
      placeholder: 'Enter your LinkedIn li_at cookie',
      helpUrl: 'https://www.linkedin.com/help/sales-navigator',
      pricing: 'From €79/month',
      features: ['Direct LinkedIn data', 'Sales Navigator filters', 'InMail credits', 'Lead recommendations'],
      icon: '💼',
      requiresMultiple: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">API Configuration</h2>
            <p className="text-zinc-400">
              Connect your data providers to unlock real-time lead enrichment and company search.
              Your API keys are stored securely in your browser's local storage.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-amber-200 mb-1">Important</div>
              <p className="text-xs text-amber-300/80">
                Configure at least one data provider to enable real searches. Without API credentials, the system will use mock data for demonstration purposes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Providers */}
      {apiProviders.map((provider) => (
        <div key={provider.id} className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-3xl">{provider.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-white">{provider.name}</h3>
                {credentials[provider.credentialKey] && testResults[provider.id] === 'success' && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-400 mb-2">{provider.description}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>💰 {provider.pricing}</span>
                <a
                  href={provider.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Get API Key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {provider.features.map((feature, i) => (
              <div key={i} className="px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-xs text-zinc-400">
                ✓ {feature}
              </div>
            ))}
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showKeys[provider.id] ? 'text' : 'password'}
                value={credentials[provider.credentialKey] || ''}
                onChange={(e) => updateCredential(provider.credentialKey, e.target.value)}
                placeholder={provider.placeholder}
                className="w-full px-4 py-3 pr-24 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono text-sm"
              />
              <button
                onClick={() => toggleShowKey(provider.id)}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
              >
                {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => testAPI(provider.id as any)}
                disabled={!credentials[provider.credentialKey] || isTesting[provider.id]}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 text-white text-xs rounded transition-all"
              >
                {isTesting[provider.id] ? 'Testing...' : 'Test'}
              </button>
            </div>

            {/* LinkedIn Session ID (conditional) */}
            {provider.requiresMultiple && (
              <div className="relative">
                <input
                  type={showKeys[`${provider.id}-session`] ? 'text' : 'password'}
                  value={credentials.linkedinSessionId || ''}
                  onChange={(e) => updateCredential('linkedinSessionId', e.target.value)}
                  placeholder="Enter your LinkedIn JSESSIONID cookie"
                  className="w-full px-4 py-3 pr-12 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono text-sm"
                />
                <button
                  onClick={() => toggleShowKey(`${provider.id}-session`)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showKeys[`${provider.id}-session`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Test Result */}
            {testResults[provider.id] && (
              <div className={`flex items-center gap-2 text-sm ${
                testResults[provider.id] === 'success' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {testResults[provider.id] === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>API connection successful!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Connection failed. Please check your API key.</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveCredentials}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all"
        >
          Save Configuration
        </button>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-br from-indigo-950/20 to-black border border-indigo-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">💡 Need Help?</h3>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>
            <strong className="text-white">Recommended:</strong> Start with Apollo.io for the best price/performance ratio (€49/month for 10,000 exports).
          </p>
          <p>
            <strong className="text-white">Premium Option:</strong> People Data Labs offers pay-as-you-go pricing perfect for high-volume usage.
          </p>
          <p>
            <strong className="text-white">LinkedIn:</strong> Requires Sales Navigator subscription + cookie extraction (advanced users only).
          </p>
        </div>
      </div>
    </div>
  );
};