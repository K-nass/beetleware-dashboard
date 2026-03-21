export interface Classification {
  id: number;
  code: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  discountPercent?: number;
}

export interface SetLandClassificationRequest {
  landId: number;
  classificationId: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: T | null;
}
