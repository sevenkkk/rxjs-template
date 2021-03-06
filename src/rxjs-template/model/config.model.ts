import { UseResult } from './use-result.model';

/**
 * 全局配置信息
 */
export interface ConfigModel {
  // 本地存储版本号
  localVersion?: number;
  // 系统错误消息
  errorMessage?: string;
  // 是否显示log
  showLog?: boolean;
  // 处理异常请求
  handleHttpError?: (error: any, errorCallback: () => void) => {errorMessage, errorCode};
  // 处理正常请求
  handleHttpResult?: <T>(resBody: any) => UseResult<T>;
}
