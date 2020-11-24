import { ConfigModel } from './model/config.model';

/**
 * 全局配置管理
 */
export class RxjsTempConfigService {

  // 全局配置
  static config: ConfigModel = {errorMessage: '网络请求发送失败', localVersion: 1};

  /**
   * 设置全局配置
   * @param config 配置
   */
  static setup(config: ConfigModel): void {
    this.config = {...this.config, ...config};
  }

}
