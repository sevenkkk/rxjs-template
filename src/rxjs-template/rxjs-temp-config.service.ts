import { ConfigModel } from './model/config.model';

/**
 * 全局配置管理
 */
export class RxjsTempConfigService {

  // 全局配置
  static config: ConfigModel = {errorMessage: '网络请求发送失败', localVersion: 1, showLog: true};

  /**
   * 设置全局配置
   * @param config 配置
   */
  static setup(config: ConfigModel): void {
    this.config = {...this.config, ...config};
  }

  /**
   * 显示log
   * @param content 描述
   * @param data 参数
   */
  static showLog(content: string, data?: any): void {
    if (this.config.showLog) {
      if (data) {
        console.log(content, data);
      } else {
        console.log(content);
      }
    }
  }

  /**
   * 显示错误log
   * @param content 描述
   * @param data 参数
   */
  static showErrorLog(content: string, data?: any): void {
    if (this.config.showLog) {
      if (data) {
        console.error(content, data);
      } else {
        console.error(content);
      }
    }
  }

}
