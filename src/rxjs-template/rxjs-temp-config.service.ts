import { ConfigModel } from './model/config.model';

export class RxjsTempConfigService {

  static config: ConfigModel = {errorMessage: '网络请求发送失败'};

  static setup(config: ConfigModel): void {
    this.config = {...this.config, ...config};
  }

}
