import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { LocalStorageUtils } from '../utils/local-storage.utils';
import { map } from 'rxjs/operators';

/**
 * 本地类表对象管理
 */
export class LocalListService<T> {

  private _list$ = new BehaviorSubject<Array<T>>([]);

  constructor(private localKey?: string) {
    this.setInitData();
  }

  /**
   * 获取目标数据
   */
  get list$(): Observable<Array<T>> {
    return this._list$.asObservable();
  }

  get list(): Array<T> {
    return this._list$.value;
  }

  set list(list: Array<T>) {
    if (this.localKey) {
      LocalStorageUtils.setItem<Array<T>>(this.localKey, list);
    }
    this._list$.next(list);
  }


  // 索引
  private _index$ = new BehaviorSubject<number>(0);

  set index(index: number) {
    this._index$.next(index);
  }

  // 获取索引
  get index$(): Observable<number> {
    return this._index$.asObservable();
  }

  // 获取当前选中
  get active$(): Observable<T> {
    // 同时监听
    return combineLatest([this.list$, this.index$]).pipe(
      map(([list, index]) => list.length > index ? list[index] : undefined),
    );
  }

  get localList(): Array<T> {
    return LocalStorageUtils.getItem<Array<T>>(this.localKey);
  }

  /**
   * 清空数据
   */
  clear(): void {
    if (this.localKey) {
      LocalStorageUtils.removeItem(this.localKey);
    }
    this._list$.next([]);
  }


  /**
   * 设置初始化数据
   */
  private setInitData(): void {
    if (this.localKey) {
      const result = this.localList;
      if (result) {
        this.list = result;
      }
    }
  }
}
