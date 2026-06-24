import { useState } from "react";
import { Search, Users, Building2, MapPin, Briefcase, GraduationCap, TrendingUp, Globe, X, ChevronDown } from "lucide-react";

export interface SearchFilters {
  // Lead Filters
  keywords?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  seniority?: string[];
  function?: string[];
  yearsExperience?: { min?: number; max?: number };
  currentCompany?: string;
  pastCompany?: string;
  school?: string;
  fieldOfStudy?: string;
  languages?: string[];
  
  // Company Filters
  companyName?: string;
  industry?: string[];
  companySize?: string[];
  companyType?: string[];
  revenue?: { min?: number; max?: number };
  fundingStage?: string[];
  technologies?: string[];
  employeeGrowth?: string;
  foundedYear?: { min?: number; max?: number };
  
  // Location Filters
  country?: string[];
  city?: string;
  region?: string;
  
  // Advanced Filters
  searchType: 'leads' | 'companies' | 'both';
  excludeKeywords?: string;
  emailStatus?: 'verified' | 'catchall' | 'any';
  phoneStatus?: 'verified' | 'any';
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export const AdvancedSearchFilters = ({ filters, onFiltersChange, onSearch, isLoading }: AdvancedSearchFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    lead: true,
    company: true,
    location: true,
    advanced: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const seniorities = [
    'C-Level (CXO, VP)',
    'Director',
    'Manager',
    'Senior',
    'Entry Level',
    'Intern'
  ];

  const functions = [
    'Sales',
    'Marketing',
    'Engineering',
    'Product',
    'Operations',
    'Finance',
    'Human Resources',
    'Customer Success',
    'Legal',
    'Design'
  ];

  const industries = [
    'Real Estate',
    'Technology',
    'Financial Services',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Education',
    'Consulting',
    'Construction',
    'Hospitality'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1001-5000 employees',
    '5001+ employees'
  ];

  const fundingStages = [
    'Bootstrapped',
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C+',
    'Public'
  ];

  const countries = [
    'Portugal',
    'Spain',
    'United Kingdom',
    'France',
    'Germany',
    'United States',
    'Brazil',
    'Netherlands',
    'Italy'
  ];

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-6 space-y-6">
      {/* Search Type Tabs */}
      <div className="flex gap-2 p-1 bg-black/50 rounded-lg">
        {(['leads', 'companies', 'both'] as const).map((type) => (
          <button
            key={type}
            onClick={() => updateFilter('searchType', type)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              filters.searchType === type
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {type === 'leads' && <Users className="w-4 h-4 inline mr-2" />}
            {type === 'companies' && <Building2 className="w-4 h-4 inline mr-2" />}
            {type === 'both' && <Globe className="w-4 h-4 inline mr-2" />}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Keywords Search */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Keywords
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={filters.keywords || ''}
            onChange={(e) => updateFilter('keywords', e.target.value)}
            placeholder="e.g., Real Estate Agent, Property Manager..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Lead Filters */}
      {(filters.searchType === 'leads' || filters.searchType === 'both') && (
        <div className="border border-white/5 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('lead')}
            className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-white">Lead Filters</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${expandedSections.lead ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.lead && (
            <div className="p-4 space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Job Title</label>
                <input
                  type="text"
                  value={filters.title || ''}
                  onChange={(e) => updateFilter('title', e.target.value)}
                  placeholder="e.g., CEO, Sales Manager, Real Estate Agent"
                  className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Seniority Level */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Seniority Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {seniorities.map((level) => (
                    <button
                      key={level}
                      onClick={() => toggleArrayFilter('seniority', level)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.seniority?.includes(level)
                          ? 'bg-indigo-600 text-white border border-indigo-500'
                          : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Function/Department */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Function/Department</label>
                <div className="grid grid-cols-2 gap-2">
                  {functions.map((func) => (
                    <button
                      key={func}
                      onClick={() => toggleArrayFilter('function', func)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.function?.includes(func)
                          ? 'bg-indigo-600 text-white border border-indigo-500'
                          : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {func}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Company */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Current Company</label>
                <input
                  type="text"
                  value={filters.currentCompany || ''}
                  onChange={(e) => updateFilter('currentCompany', e.target.value)}
                  placeholder="e.g., RE/MAX, Keller Williams"
                  className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Years of Experience</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={filters.yearsExperience?.min || ''}
                    onChange={(e) => updateFilter('yearsExperience', { ...filters.yearsExperience, min: Number(e.target.value) || undefined })}
                    placeholder="Min"
                    className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={filters.yearsExperience?.max || ''}
                    onChange={(e) => updateFilter('yearsExperience', { ...filters.yearsExperience, max: Number(e.target.value) || undefined })}
                    placeholder="Max"
                    className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Company Filters */}
      {(filters.searchType === 'companies' || filters.searchType === 'both') && (
        <div className="border border-white/5 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('company')}
            className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-white">Company Filters</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${expandedSections.company ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.company && (
            <div className="p-4 space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Company Name</label>
                <input
                  type="text"
                  value={filters.companyName || ''}
                  onChange={(e) => updateFilter('companyName', e.target.value)}
                  placeholder="e.g., Coldwell Banker, Century 21"
                  className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
                <div className="grid grid-cols-2 gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => toggleArrayFilter('industry', ind)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.industry?.includes(ind)
                          ? 'bg-indigo-600 text-white border border-indigo-500'
                          : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Company Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {companySizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleArrayFilter('companySize', size)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.companySize?.includes(size)
                          ? 'bg-indigo-600 text-white border border-indigo-500'
                          : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding Stage */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Funding Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {fundingStages.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => toggleArrayFilter('fundingStage', stage)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.fundingStage?.includes(stage)
                          ? 'bg-indigo-600 text-white border border-indigo-500'
                          : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Technologies Used</label>
                <input
                  type="text"
                  value={filters.technologies?.join(', ') || ''}
                  onChange={(e) => updateFilter('technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="e.g., Salesforce, HubSpot, Mailchimp"
                  className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Location Filters */}
      <div className="border border-white/5 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">Location Filters</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${expandedSections.location ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.location && (
          <div className="p-4 space-y-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Country</label>
              <div className="grid grid-cols-2 gap-2">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => toggleArrayFilter('country', country)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.country?.includes(country)
                        ? 'bg-indigo-600 text-white border border-indigo-500'
                        : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">City</label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => updateFilter('city', e.target.value)}
                placeholder="e.g., Lisbon, Porto, Madrid"
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="border border-white/5 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('advanced')}
          className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">Advanced Filters</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${expandedSections.advanced ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.advanced && (
          <div className="p-4 space-y-4">
            {/* Email Status */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email Status</label>
              <div className="flex gap-2">
                {['any', 'verified', 'catchall'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateFilter('emailStatus', status)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filters.emailStatus === status
                        ? 'bg-indigo-600 text-white border border-indigo-500'
                        : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Exclude Keywords */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Exclude Keywords</label>
              <input
                type="text"
                value={filters.excludeKeywords || ''}
                onChange={(e) => updateFilter('excludeKeywords', e.target.value)}
                placeholder="e.g., intern, assistant"
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={onSearch}
        disabled={isLoading}
        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" />
        {isLoading ? 'Searching...' : 'Search Now'}
      </button>
    </div>
  );
};
