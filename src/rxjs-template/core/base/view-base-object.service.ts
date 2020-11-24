import { BehaviorSubject, Observable } from 'rxjs';
import { ViewBaseCommonService } from './view-base-common.service';
import { map } from 'rxjs/operators';
import { LocalStorageUtils } from '../../utils/local-storage.utils';

export abstract class ViewBaseObjectService<P, T> extends ViewBaseCommonService<P> {

  // 默认值
  private _defaultValue: T;
  // 数据
  private _data$ = new BehaviorSubject<T>(undefined);

  // 获取列表
  get data$(): Observable<T> {
    return this._data$.asObservable().pipe(map(item => item || this._defaultValue));
  }

  set data(data: T) {
    if (this.localKey) {
      this.startTime = new Date().getTime();
      LocalStorageUtils.setCacheItem<T>(this.localKey, data, this.startTime);
    }
    this._data$.next(data);
  }

  get data(): T {
    return this._data$.value;
  }

  protected constructor() {
    super();
    this.initialize();
    this._data$.next(this.getLocalData());
  }

  // 初始化数据
  initialize(): void {
  }

  clear(): void {
    super.clear();
    if (this.localKey) {
      LocalStorageUtils.removeItem(this.localKey);
    }
    this._data$.next(undefined);
  }

  /**
   * 获取本地数据
   */
  private getLocalData(): T {
    if (this.localKey) {
      const result = LocalStorageUtils.getCacheItem<T>(this.localKey);
      if (result) {
        const {startTime, data} = result;
        this.startTime = startTime;
        return data;
      }
    }
    return undefined;
  }

}
