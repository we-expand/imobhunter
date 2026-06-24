// 🎯 GERADOR INTELIGENTE DE LEADS DEMO
// Gera leads realistas baseados nos filtros do usuário

interface DemoLeadParams {
  currentTitle?: string;
  currentCompany?: string;
  city?: string;
  country?: string[];
  industry?: string[];
  seniority?: string[];
  limit?: number;
}

const portugueseCities = [
  'Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Aveiro', 
  'Setúbal', 'Cascais', 'Viseu', 'Leiria', 'Évora', 'Guimarães'
];

const firstNames = [
  'João', 'Maria', 'Pedro', 'Ana', 'Ricardo', 'Sofia', 'Carlos', 'Beatriz',
  'Miguel', 'Inês', 'Tiago', 'Catarina', 'Bruno', 'Mariana', 'Nuno', 'Rita',
  'André', 'Joana', 'Rui', 'Marta', 'Diogo', 'Patrícia', 'Gonçalo', 'Sara',
  'Luís', 'Cláudia', 'Paulo', 'Daniela', 'Filipe', 'Teresa', 'José', 'Carla',
  'Francisco', 'Isabel', 'António', 'Raquel', 'Marco', 'Helena', 'Hugo', 'Sílvia',
  'Vasco', 'Diana', 'Fernando', 'Susana', 'Rafael', 'Vera', 'Manuel', 'Cristina',
  'Sérgio', 'Paula', 'Vítor', 'Liliana', 'Eduardo', 'Andreia', 'Daniel', 'Mónica',
  'Jorge', 'Cátia', 'Fábio', 'Vanessa', 'Renato', 'Alexandra', 'David', 'Marlene',
  'Samuel', 'Sónia', 'Rodrigo', 'Elisa', 'Alberto', 'Carmo', 'Tomás', 'Gabriela',
  'Alexandre', 'Fernanda', 'Rúben', 'Lúcia', 'César', 'Manuela', 'Simão', 'Anabela'
];

const lastNames = [
  'Silva', 'Santos', 'Ferreira', 'Rodrigues', 'Pereira', 'Martins', 'Costa',
  'Fernandes', 'Oliveira', 'Sousa', 'Lopes', 'Alves', 'Carvalho', 'Gomes',
  'Ribeiro', 'Mendes', 'Cardoso', 'Teixeira', 'Morais', 'Almeida', 'Jesus',
  'Nunes', 'Marques', 'Soares', 'Pinto', 'Gonçalves', 'Correia', 'Moreira',
  'Barbosa', 'Araújo', 'Dias', 'Castro', 'Monteiro', 'Vieira', 'Rocha', 'Fonseca'
];

const jobTitlesByLevel = {
  'C-Level': [
    'CEO & Founder', 'Chief Executive Officer', 'Managing Director',
    'Chief Technology Officer', 'Chief Revenue Officer', 'Chief Marketing Officer',
    'Chief Investment Officer', 'Chief Product Officer', 'Chief Operations Officer',
    'Chief Financial Officer', 'Chief Information Officer', 'Chief Strategy Officer'
  ],
  'VP': [
    'VP of Marketing', 'VP of Sales', 'VP of Product', 'VP of Engineering',
    'VP of Operations', 'VP of Business Development', 'VP of Customer Success',
    'VP of Technology', 'VP of Finance', 'VP of Growth'
  ],
  'Director': [
    'Director of Sales', 'Director of Marketing', 'Director of Product',
    'Director of Engineering', 'Director of Business Development', 'Investment Director',
    'Director of Operations', 'Director of Customer Success', 'Technical Director',
    'Creative Director', 'Finance Director', 'Strategy Director'
  ],
  'Manager': [
    'Head of Product', 'Head of Sales', 'Head of Marketing', 'Head of Engineering',
    'Head of Customer Success', 'Head of Operations', 'Product Manager',
    'Sales Manager', 'Marketing Manager', 'Engineering Manager', 'Project Manager'
  ],
  'Senior': [
    'Senior Account Executive', 'Senior Product Manager', 'Senior Software Engineer',
    'Senior Marketing Manager', 'Senior Sales Manager', 'Senior Consultant',
    'Senior Software Architect', 'Senior Business Analyst', 'Senior Designer',
    'Senior Account Manager', 'Senior Data Scientist', 'Senior Developer'
  ]
};

const companiesByIndustry = {
  'Technology': [
    'Tech Innovations Portugal', 'Digital Solutions SA', 'CloudSphere Technologies',
    'Tech Unicorn Portugal', 'DataDriven Systems', 'AI Technologies PT',
    'Software House Lisboa', 'DevOps Solutions', 'Cloud Native PT'
  ],
  'Real Estate': [
    'Global Ventures Ltd', 'Iberian Properties Group', 'PropTech Solutions',
    'Atlantic Real Estate', 'Premium Properties PT', 'Urban Development Group',
    'Estate Masters', 'Property Solutions Lisboa', 'Real Estate Innovations'
  ],
  'Financial Services': [
    'Atlantic Capital Partners', 'European Property Fund', 'FinTech Innovations',
    'Investment Group PT', 'Capital Ventures', 'Financial Solutions SA',
    'Banking Tech PT', 'Wealth Management Group', 'Investment Partners'
  ],
  'Consulting': [
    'Strategy Consultants PT', 'Business Solutions Group', 'Management Advisors',
    'Digital Transformation Partners', 'Growth Consulting', 'Innovation Advisors',
    'Executive Consulting PT', 'Strategy Partners', 'Business Growth Advisors'
  ],
  'Marketing & Advertising': [
    'Brand Evolution Agency', 'Digital Marketing PT', 'Creative Studio Lisboa',
    'Performance Marketing Group', 'Brand Strategy Partners', 'Marketing Innovations',
    'Growth Agency PT', 'Creative Minds Studio', 'Marketing Solutions SA'
  ],
  'SaaS': [
    'SaaS Growth Partners', 'Cloud Solutions PT', 'Platform Technologies',
    'Software as a Service PT', 'B2B SaaS Lisboa', 'Enterprise Software Group',
    'SaaS Innovations', 'Platform Solutions', 'Cloud Software PT'
  ],
  'E-commerce': [
    'E-commerce Solutions PT', 'Online Retail Group', 'Digital Commerce SA',
    'Marketplace Technologies', 'Retail Tech PT', 'E-commerce Innovations',
    'Online Business Group', 'Digital Retail Partners', 'Commerce Platform PT'
  ],
  'Healthcare': [
    'HealthTech Solutions', 'Medical Innovations PT', 'Digital Health Group',
    'Healthcare Systems SA', 'MedTech Lisboa', 'Health Solutions PT',
    'Medical Technology Group', 'Healthcare Innovations', 'Digital Medicine PT'
  ]
};

const skillsByRole = {
  'CEO': ['Leadership', 'Strategy', 'Business Development', 'Vision', 'Team Building', 'Fundraising'],
  'CTO': ['Technology Strategy', 'Architecture', 'Team Leadership', 'Cloud', 'DevOps', 'Innovation'],
  'CMO': ['Brand Strategy', 'Digital Marketing', 'Growth', 'Analytics', 'Content Strategy', 'Performance Marketing'],
  'CFO': ['Financial Planning', 'Budgeting', 'Investment', 'Risk Management', 'Corporate Finance', 'FP&A'],
  'VP': ['Strategic Planning', 'Team Management', 'Execution', 'Cross-functional', 'KPI Management', 'Scaling'],
  'Director': ['Team Leadership', 'Project Management', 'Strategy Execution', 'Budget Management', 'Stakeholder Management', 'Process Optimization'],
  'Manager': ['Team Coordination', 'Project Delivery', 'Tactical Planning', 'Resource Management', 'Reporting', 'Problem Solving'],
  'Sales': ['B2B Sales', 'Negotiation', 'CRM', 'Pipeline Management', 'Account Management', 'Closing'],
  'Marketing': ['Digital Marketing', 'SEO/SEM', 'Content', 'Social Media', 'Analytics', 'Campaigns'],
  'Product': ['Product Management', 'Roadmap', 'User Research', 'Agile', 'Data-Driven', 'UX Strategy'],
  'Engineering': ['Software Development', 'Architecture', 'Agile', 'CI/CD', 'Cloud', 'Microservices'],
  'Investment': ['Real Estate Investment', 'Due Diligence', 'Portfolio Management', 'Financial Analysis', 'M&A', 'Risk Assessment']
};

// Fotos reais do Unsplash - 100+ variações
const unsplashPhotos = [
  'photo-1507003211169-0a1dd7228f2d', 'photo-1494790108377-be9c29b29330', 'photo-1500648767791-00dcc994a43e',
  'photo-1438761681033-6461ffad8d80', 'photo-1472099645785-5658abf4ff4e', 'photo-1487412720507-e7ab37603c6f',
  'photo-1519085360753-af0119f7cbe7', 'photo-1573496359142-b8d87734a5a2', 'photo-1506794778202-cad84cf45f1d',
  'photo-1534528741775-53994a69daeb', 'photo-1560250097-0b93528c311a', 'photo-1580489944761-15a19d654956',
  'photo-1558203728-00f45181dd84', 'photo-1531123897727-8f129e1688ce', 'photo-1599566150163-29194dcaad36',
  'photo-1570295999919-56ceb5ecca61', 'photo-1568602471122-7832951cc4c5', 'photo-1488426862026-3ee34a7d66df',
  'photo-1552374196-c4e7ffc6e126', 'photo-1556157382-97eda2d62296', 'photo-1539571696357-5a69c17a67c6',
  'photo-1524504388940-b1c1722653e1', 'photo-1592621385645-e41659e8aabe', 'photo-1557862921-37829c790f19',
  'photo-1566492031773-4f4e44671857', 'photo-1492562080023-ab3db95bfbce', 'photo-1502685104226-ee32379fefbe',
  'photo-1527980965255-d3b416303d12', 'photo-1531427186611-ecfd6d936c79', 'photo-1513910367299-72f1a7ce2d2f',
  'photo-1521119989659-a83eee488004', 'photo-1544005313-94ddf0286df2', 'photo-1547425260-76bcadfb4437',
  'photo-1512361943970-a047c9d827e0', 'photo-1552374196-1ab2a1c593e8', 'photo-1578774204375-826dc5d996ed',
  'photo-1522529599102-193c0d76b5b6', 'photo-1516534775068-ba3e7458af70', 'photo-1618641986557-1ecd230959aa',
  'photo-1573497019940-1c28c88b4f3e', 'photo-1519648023493-d82b5f8d7b8a', 'photo-1601933973783-43cf8a7d4c5f',
  'photo-1614283233556-f35b0c801ef1', 'photo-1598550476439-6847785fcea6', 'photo-1596524430615-b46475ddff6e',
  'photo-1603415526960-f7e0328c63b1', 'photo-1557296387-5358ad7997bb', 'photo-1564564244660-5d73c057f2d2',
  'photo-1580894908361-967195033215', 'photo-1628157588553-5eeea00af15c', 'photo-1613679074971-91fc87e3238c',
  'photo-1542740348-39501cd6e2b4', 'photo-1589571894960-20bbe2828d0a', 'photo-1611432579699-484f7990b127',
  'photo-1590086782792-42dd2350140d', 'photo-1594745561149-2211ca8c5d98', 'photo-1609010697446-11f2155278f0'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getSkillsForTitle(title: string): string[] {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('ceo') || titleLower.includes('chief executive')) {
    return getRandomElement([skillsByRole.CEO, skillsByRole.VP]).slice(0, 5);
  }
  if (titleLower.includes('cto') || titleLower.includes('chief technology')) {
    return [...skillsByRole.CTO, ...skillsByRole.Engineering].slice(0, 6);
  }
  if (titleLower.includes('cmo') || titleLower.includes('chief marketing')) {
    return [...skillsByRole.CMO, ...skillsByRole.Marketing].slice(0, 6);
  }
  if (titleLower.includes('cfo') || titleLower.includes('chief financial')) {
    return skillsByRole.CFO.slice(0, 5);
  }
  if (titleLower.includes('vp') || titleLower.includes('vice president')) {
    return [...skillsByRole.VP, ...skillsByRole.Director].slice(0, 5);
  }
  if (titleLower.includes('director')) {
    return skillsByRole.Director.slice(0, 5);
  }
  if (titleLower.includes('manager') || titleLower.includes('head of')) {
    return skillsByRole.Manager.slice(0, 5);
  }
  if (titleLower.includes('sales')) {
    return skillsByRole.Sales.slice(0, 5);
  }
  if (titleLower.includes('marketing')) {
    return skillsByRole.Marketing.slice(0, 5);
  }
  if (titleLower.includes('product')) {
    return skillsByRole.Product.slice(0, 5);
  }
  if (titleLower.includes('engineer') || titleLower.includes('developer') || titleLower.includes('architect')) {
    return skillsByRole.Engineering.slice(0, 5);
  }
  if (titleLower.includes('investment') || titleLower.includes('investor')) {
    return skillsByRole.Investment.slice(0, 5);
  }
  
  return getRandomElement([skillsByRole.Manager, skillsByRole.Director]).slice(0, 4);
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
  const targetIndustry = industry?.[0] || getRandomElement(Object.keys(companiesByIndustry));
  const targetSeniority = seniority?.[0] || getRandomElement(Object.keys(jobTitlesByLevel));

  // Gerar leads baseados nos parâmetros
  for (let i = 0; i < limit; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const fullName = `${firstName} ${lastName}`;
    
    // Se o usuário especificou um cargo, usar ele. Senão, usar um aleatório do nível de seniority
    let jobTitle: string;
    if (currentTitle) {
      jobTitle = currentTitle;
    } else {
      const titleOptions = jobTitlesByLevel[targetSeniority as keyof typeof jobTitlesByLevel] || jobTitlesByLevel['Manager'];
      jobTitle = getRandomElement(titleOptions);
    }
    
    // Se o usuário especificou uma empresa, usar ela. Senão, usar uma aleatória da indústria
    let companyName: string;
    if (currentCompany) {
      companyName = currentCompany;
    } else {
      const companyOptions = companiesByIndustry[targetIndustry as keyof typeof companiesByIndustry] || companiesByIndustry['Technology'];
      companyName = getRandomElement(companyOptions);
    }
    
    // Variar um pouco a cidade para parecer mais real
    const leadCity = i % 3 === 0 ? targetCity : getRandomElement(portugueseCities);
    const location = `${leadCity}, ${targetCountry}`;
    
    // Foto aleatória do Unsplash
    const photoId = unsplashPhotos[i % unsplashPhotos.length];
    const avatar = `https://images.unsplash.com/photo-${photoId}?w=400&h=400&fit=crop&crop=faces`;
    
    // Email profissional baseado na empresa
    const companyDomain = companyName
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyDomain}.pt`;
    
    // Telefone português
    const phoneNumber = `+351 9${Math.floor(10 + Math.random() * 90)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
    
    // Skills baseadas no cargo
    const skills = getSkillsForTitle(jobTitle);
    
    // Match score baseado em quantos filtros foram aplicados
    let matchScore = 70 + Math.floor(Math.random() * 20);
    if (currentTitle) matchScore += 5;
    if (currentCompany) matchScore += 5;
    if (city) matchScore += 5;
    if (industry && industry.length > 0) matchScore += 5;
    matchScore = Math.min(98, matchScore);
    
    // Company size aleatório mas realista
    const companySizes = ['10-25', '25-50', '50-100', '100-250', '250-500', '500-1000', '1000+'];
    const companySize = getRandomElement(companySizes);
    
    // Anos de experiência baseado no seniority
    let yearsExperience = 5;
    if (targetSeniority === 'C-Level') yearsExperience = 12 + Math.floor(Math.random() * 8);
    else if (targetSeniority === 'VP') yearsExperience = 10 + Math.floor(Math.random() * 6);
    else if (targetSeniority === 'Director') yearsExperience = 8 + Math.floor(Math.random() * 5);
    else if (targetSeniority === 'Manager') yearsExperience = 5 + Math.floor(Math.random() * 5);
    else yearsExperience = 3 + Math.floor(Math.random() * 7);
    
    leads.push({
      id: `demo-${String(i + 1).padStart(3, '0')}`,
      name: fullName,
      firstName,
      lastName,
      title: jobTitle,
      company: companyName,
      location,
      country: targetCountry,
      avatar,
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}-demo`,
      email,
      phone: phoneNumber,
      industry: targetIndustry,
      companySize,
      seniority: targetSeniority,
      yearsExperience,
      skills,
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
  
  // Ordenar por match score
  leads.sort((a, b) => b.matchScore - a.matchScore);
  
  return leads;
}
