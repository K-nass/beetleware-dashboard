/**
 * Standardised return type for all Server Actions.
 * Every action returns either a success with typed data or a failure with an error message.
 */
export type ActionResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  fields?: Record<string, any>;
};
