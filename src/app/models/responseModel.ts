export interface ResponseModel<T = any> {
  data: T;
  success: boolean;
  message: string;
}