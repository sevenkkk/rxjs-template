import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageUtils } from '../utils/local-storage.utils';

export class LocalObjectService<T> {

  private _target$ = new BehaviorSubject<T>(undefined);

  constructor(private localKey?: string) {
    this.setInitData();
  }

  /**
   * 获取目标数据
   */
  get target$(): Observable<T> {
    return this._target$.asObservable();
  }

  get target() {
    return this._target$.value;
  }

  set target(data: T) {
    if (this.localKey) {
      LocalStorageUtils.setItem<T>(this.localKey, data);
    }
    this._target$.next(data);
  }

  /**
   * 清空数据
   */
  clear() {
    if (this.localKey) {
      LocalStorageUtils.removeItem(this.localKey);
    }
    this._target$.next(undefined);
  }


  /**
   * 设置初始化数据
   */
  private setInitData() {
    if (this.localKey) {
      const result = LocalStorageUtils.getItem<T>(this.localKey);
      if (result) {
        this.target = result;
      }
    }
  }
}
