import { ViewBaseParamService } from './view-base-param.service';
import { tap } from 'rxjs/operators';
import { UseResult } from '../../model/use-result.model';
import { Observable } from 'rxjs';
import { RxjsTempConfigService } from '../../rxjs-temp-config.service';

export abstract class ViewBaseCommonService<P> extends ViewBaseParamService<P> {

  // 是否默认设计返回值， 如果改为false的话，需要手动赋值data
  private _isDefaultSet = true;
  private _expires = 5 * 60 * 1000; // 设置默认过期时间五分钟
  private _startTime; // 开始缓存时间

  set isDefaultSet(isDefaultSet: boolean) {
    this._isDefaultSet = isDefaultSet;
  }

  get isDefaultSet(): boolean {
    return this._isDefaultSet;
  }

  set expires(expires: number) {
    this._expires = expires;
  }

  get expires(): number {
    return this._expires;
  }

  set startTime(startTime: number) {
    this._startTime = startTime;
  }

  get startTime(): number {
    return this._startTime;
  }

  fetch<T>(setData: (data: T) => void, params?: P): Observable<UseResult<T>> {
    this.params = params;
    return this.doFetch<T>(this.prepare()).pipe(tap((res) => {
      const {success, data, errorMessage} = res;
      if (success) {
        if (this._isDefaultSet) {
          setData(data);
        }
        this.onFetchSuccess(data);
      } else {
        this.onFetchFail(errorMessage);
      }
      this.onFetchComplete(res);
    }));
  }

  /**
   * 是否过期
   */
  isExpires(): boolean {
    const now = new Date().getTime();
    return now - this.startTime >= this.expires;
  }

  /**
   * 请求成功回调
   * @param data 返回值
   */
  onFetchSuccess(data: any): void {
    RxjsTempConfigService.showLog(`【 ${this.constructor.name} 】Response Data => `, data);
  }

  /**
   * 请求失败回调
   * @param errorMessage 返回错误信息
   */
  onFetchFail(errorMessage?: string): void {
    if (errorMessage) {
      RxjsTempConfigService.showErrorLog(`【 ${this.constructor.name} 】Response Error => `, errorMessage);
    }
  }

  /**
   * 请求完成回调
   * @param res 返回值
   */
  onFetchComplete(res: UseResult<any>): void {

  }

}
