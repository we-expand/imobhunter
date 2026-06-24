// 🌍 PAÍSES E FUSOS HORÁRIOS

export const countries = [
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
];

export const timezones = [
  { value: 'Europe/Lisbon', label: 'Portugal (WET/WEST)', offset: 'UTC+0/+1' },
  { value: 'America/Sao_Paulo', label: 'Brasil - São Paulo (BRT)', offset: 'UTC-3' },
  { value: 'America/New_York', label: 'USA - New York (EST/EDT)', offset: 'UTC-5/-4' },
  { value: 'America/Los_Angeles', label: 'USA - Los Angeles (PST/PDT)', offset: 'UTC-8/-7' },
  { value: 'America/Chicago', label: 'USA - Chicago (CST/CDT)', offset: 'UTC-6/-5' },
  { value: 'Europe/London', label: 'UK - London (GMT/BST)', offset: 'UTC+0/+1' },
  { value: 'Europe/Madrid', label: 'España - Madrid (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Paris', label: 'France - Paris (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Berlin', label: 'Germany - Berlin (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Rome', label: 'Italy - Rome (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'America/Mexico_City', label: 'México - CDMX (CST)', offset: 'UTC-6' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina - Buenos Aires (ART)', offset: 'UTC-3' },
  { value: 'America/Toronto', label: 'Canada - Toronto (EST/EDT)', offset: 'UTC-5/-4' },
  { value: 'Australia/Sydney', label: 'Australia - Sydney (AEDT/AEST)', offset: 'UTC+11/+10' },
  { value: 'Asia/Kolkata', label: 'India - Kolkata (IST)', offset: 'UTC+5:30' },
  { value: 'Asia/Shanghai', label: 'China - Shanghai (CST)', offset: 'UTC+8' },
  { value: 'Asia/Tokyo', label: 'Japan - Tokyo (JST)', offset: 'UTC+9' },
  { value: 'Asia/Seoul', label: 'South Korea - Seoul (KST)', offset: 'UTC+9' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 'UTC+8' },
  { value: 'Asia/Dubai', label: 'UAE - Dubai (GST)', offset: 'UTC+4' },
  { value: 'Africa/Johannesburg', label: 'South Africa - Johannesburg (SAST)', offset: 'UTC+2' },
  { value: 'Europe/Amsterdam', label: 'Netherlands - Amsterdam (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Brussels', label: 'Belgium - Brussels (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Zurich', label: 'Switzerland - Zurich (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Vienna', label: 'Austria - Vienna (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Stockholm', label: 'Sweden - Stockholm (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Oslo', label: 'Norway - Oslo (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Copenhagen', label: 'Denmark - Copenhagen (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Helsinki', label: 'Finland - Helsinki (EET/EEST)', offset: 'UTC+2/+3' },
  { value: 'Europe/Warsaw', label: 'Poland - Warsaw (CET/CEST)', offset: 'UTC+1/+2' },
  { value: 'Europe/Dublin', label: 'Ireland - Dublin (GMT/IST)', offset: 'UTC+0/+1' },
  { value: 'Pacific/Auckland', label: 'New Zealand - Auckland (NZDT/NZST)', offset: 'UTC+13/+12' },
];

// Helper para detectar timezone do navegador
export function detectBrowserTimezone(): string {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Verifica se está na lista
    const exists = timezones.find(tz => tz.value === detected);
    return exists ? detected : 'Europe/Lisbon';
  } catch {
    return 'Europe/Lisbon';
  }
}

// Helper para detectar país baseado no timezone
export function detectCountryFromTimezone(timezone: string): string {
  const mapping: Record<string, string> = {
    'Europe/Lisbon': 'PT',
    'America/Sao_Paulo': 'BR',
    'America/New_York': 'US',
    'America/Los_Angeles': 'US',
    'America/Chicago': 'US',
    'Europe/London': 'GB',
    'Europe/Madrid': 'ES',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Rome': 'IT',
    'America/Mexico_City': 'MX',
    'America/Argentina/Buenos_Aires': 'AR',
    'America/Toronto': 'CA',
    'Australia/Sydney': 'AU',
    'Asia/Kolkata': 'IN',
    'Asia/Shanghai': 'CN',
    'Asia/Tokyo': 'JP',
    'Asia/Seoul': 'KR',
    'Asia/Singapore': 'SG',
    'Asia/Dubai': 'AE',
    'Africa/Johannesburg': 'ZA',
  };
  
  return mapping[timezone] || 'PT';
}
