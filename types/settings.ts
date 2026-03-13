// API Response wrapper
export interface ApiResponse<T> {
  statusCode: number;
  succeeded: boolean;
  message: string | null;
  errors?: string[] | null;
  data: T;
}

// ============================================
// Land Classification Types
// ============================================

export interface LandClassification {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  discountPercent: number;
}

export interface CreateLandClassificationCommand {
  code: string;
  nameAr: string;
  nameEn: string;
  discountPercent: number;
}

export interface UpdateLandClassificationCommand {
  id: number;
  nameAr: string;
  nameEn: string;
  discountPercent: number;
}

// ============================================
// Commission & Offer Settings Types
// ============================================

export interface CommissionOfferSettings {
  globalCommissionRate: number;
  minOfferPercent: number;
  maxOfferPercent: number;
}

export interface UpdateCommissionOfferSettingsCommand {
  globalCommissionRate: number;
  minOfferPercent: number;
  maxOfferPercent: number;
}

export interface UpdateGlobalCommissionRateCommand {
  globalCommissionRate: number;
}

export interface UpdateMinOfferPercentCommand {
  minOfferPercent: number;
}

export interface UpdateMaxOfferPercentCommand {
  maxOfferPercent: number;
}

// ============================================
// Communications Settings Types
// ============================================

export interface CommunicationsSettings {
  whatsAppNumber: string;
  contactUsEmail: string;
  supportEmail: string;
  businessHours: string;
  timeZone: string;
}

export interface UpdateCommunicationsSettingsCommand {
  whatsAppNumber: string;
  contactUsEmail: string;
  supportEmail: string;
  businessHours: string;
  timeZone: string;
}

// ============================================
// FAQ Types
// ============================================

export interface Faq {
  id: number;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  displayOrder: number;
}

export interface AddFaqCommand {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

export interface UpdateFaqCommand {
  id: number;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

export interface FaqOrderItem {
  id: number;
  displayOrder: number;
}

export interface ReorderFaqsCommand {
  items: FaqOrderItem[];
}
