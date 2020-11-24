/**
 * api返回值对象
 */
export interface UseResult<T> {
  // 返回成功
  success?: boolean;
  // 返回数据
  data?: T;
  // 错误消息
  errorMessage?: string;
  // 总条数（分页用）
  totalCount?: number;
  // 错误code
  errorCode?: number;
}
