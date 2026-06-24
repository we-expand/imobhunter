// 🎯 GERADOR INTELIGENTE DE LEADS DEMO

interface DemoLeadParams {
  currentTitle?: string;
  currentCompany?: string;
  city?: string;
  country?: string[];
  industry?: string[];
  seniority?: string[];
  limit?: number;
}

const portugueseCities = ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Aveiro'];
const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Ricardo', 'Sofia', 'Carlos', 'Beatriz'];
const lastNames = ['Silva', 'Santos', 'Ferreira', 'Rodrigues', 'Pereira', 'Martins', 'Costa'];

const jobTitlesByLevel = {
  'C-Level': ['CEO & Founder', 'Chief Executive Officer', 'Managing Director'],
  'VP': ['VP of Marketing', 'VP of Sales', 'VP of Product'],
  'Director': ['Director of Sales', 'Director of Marketing', 'Investment Director'],
  'Manager': ['Head of Product', 'Head of Sales', 'Product Manager'],
  'Senior': ['Senior Account Executive', 'Senior Product Manager']
};

const companiesByIndustry = {
  'Technology': ['Tech Innovations PT', 'Digital Solutions SA', 'CloudSphere Tech'],
  'Real Estate': ['Global Ventures Ltd', 'Iberian Properties', 'PropTech Solutions'],
  'Financial Services': ['Atlantic Capital Partners', 'FinTech Innovations']
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateDemoLeads(params: DemoLeadParams): any[] {
  const {
    currentTitle,
    currentCompany,
    city,
    country,
    industry,
    seniority,
    limit = 25
  } = params;

  const leads = [];
  const targetCity = city || getRandomElement(portugueseCities);
  const targetCountry = country?.[0] || 'Portugal';
  const targetIndustry = industry?.[0] || 'Technology';
  const targetSeniority = seniority?.[0] || 'Manager';

  for (let i = 0; i < limit; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const fullName = `${firstName} ${lastName}`;
    
    const jobTitle = currentTitle || getRandomElement(jobTitlesByLevel[targetSeniority as keyof typeof jobTitlesByLevel] || jobTitlesByLevel['Manager']);
    const companyName = currentCompany || getRandomElement(companiesByIndustry[targetIndustry as keyof typeof companiesByIndustry] || companiesByIndustry['Technology']);
    
    const leadCity = i % 3 === 0 ? targetCity : getRandomElement(portugueseCities);
    const location = `${leadCity}, ${targetCountry}`;
    
    const companyDomain = companyName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').substring(0, 20);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyDomain}.pt`;
    const phoneNumber = `+351 9${Math.floor(10 + Math.random() * 90)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
    
    let matchScore = 70 + Math.floor(Math.random() * 20);
    if (currentTitle) matchScore += 5;
    if (currentCompany) matchScore += 5;
    matchScore = Math.min(98, matchScore);
    
    leads.push({
      id: `demo-${String(i + 1).padStart(3, '0')}`,
      name: fullName,
      firstName,
      lastName,
      title: jobTitle,
      company: companyName,
      location,
      country: targetCountry,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}-demo`,
      email,
      phone: phoneNumber,
      industry: targetIndustry,
      companySize: getRandomElement(['10-50', '50-100', '100-250', '250-500', '500+']),
      seniority: targetSeniority,
      yearsExperience: 5 + Math.floor(Math.random() * 10),
      skills: ['Leadership', 'Strategy', 'Business Development'],
      matchScore,
      source: 'demo',
      confidence: 100,
      enrichmentData: { 
        demo: true,
        generatedWith: {
          title: currentTitle || 'auto',
          company: currentCompany || 'auto',
          city: city || 'auto',
          industry: targetIndustry,
          seniority: targetSeniority
        }
      }
    });
  }
  
  leads.sort((a, b) => b.matchScore - a.matchScore);
  return leads;
}
