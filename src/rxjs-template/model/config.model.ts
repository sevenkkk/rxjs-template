export interface ResponseBody {
  success: boolean;
  errorCode?: number;
  errorMessage?: string;
  payload?: any;
  totalPage?: number;
  count?: number;
}

export interface UseResult<T> {
  success: boolean;
  data?: T;
  errorMessage?: string;
  totalCount?: number;
  errorCode?: number;
}
