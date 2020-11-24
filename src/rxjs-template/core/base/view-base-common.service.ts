import { ViewBaseParamService } from './view-base-param.service';
import { tap } from 'rxjs/operators';
import { UseResult } from '../../model/response-body.model';

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

  private _localKey: string;

  /**
   * 设置本地存储
   * @param localKey key值
   */
  set localKey(localKey: string) {
    this._localKey = localKey;
  }

  get localKey() {
    return this._localKey;
  }

  fetch<T>(setData: (data: T) => void, params?: P) {
    this.params = params;
    return this.doFetch<T>(this.prepare()).pipe(tap((res) => {
      const {success, data, errorMessage, errorCode} = res;
      if (success) {
        if (this._isDefaultSet) {
          if (data != null) {
            setData(data);
          }
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
  isExpires() {
    const now = new Date().getTime();
    return now - this.startTime >= this.expires;
  }

  /**
   * 请求成功回调
   * @param data 返回值
   */
  onFetchSuccess(data: any) {
    console.log('Response Data=> ', data);
  }

  /**
   * 请求失败回调
   * @param errorMessage 返回错误信息
   */
  onFetchFail(errorMessage?: string) {
    if (errorMessage) {
      console.log('Response Error=> ', errorMessage);
    }
  }

  /**
   * 请求完成回调
   * @param res 返回值
   */
  onFetchComplete(res: UseResult<any>) {

  }

}
