export interface UseResult<T> {
  success?: boolean;
  data?: T;
  errorMessage?: string;
  totalCount?: number;
  errorCode?: number;
}
