export interface APIResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
  error?: any;
}

export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}
