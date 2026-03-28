export const CACHE_TAGS = {
  LOOKUP: 'lookup',
  CLASSIFICATIONS: 'classifications',
  ROLES_CLAIMS: 'roles-claims',
  COMMISSION_SETTINGS: 'commission-settings',
  COMMUNICATIONS_SETTINGS: 'communications-settings',
  FAQ: 'faq',
  DASHBOARD: 'dashboard',
} as const;

export const CACHE_TTL = {
  REFERENCE: 3600, // 1 hour — lookup, classifications, roles/claims
  SETTINGS: 300,   // 5 minutes — commission, communications, FAQ
  ANALYTICS: 300,  // 5 minutes — dashboard KPIs and charts
} as const;
