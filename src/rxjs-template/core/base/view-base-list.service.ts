import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ViewState } from '../../model/view-state.model';
import { UseResult } from '../../model/use-result.model';
import { ViewBaseCommonService } from './view-base-common.service';
import { LocalStorageUtils } from '../../utils/local-storage.utils';

export abstract class ViewBaseListService<P, T> extends ViewBaseCommonService<P> {

  // 默认值
  private _defaultValue: Array<T> = [];

  private _localKey: string;

  /**
   * 设置本地存储
   * @param localKey key值
   */
  set localKey(localKey: string) {
    this._localKey = localKey;
    this._list$.next(this.getLocalData());
  }

  get localKey(): string {
    return this._localKey;
  }

  // 列表数据
  private _list$ = new BehaviorSubject<Array<T>>([]);

  // 获取列表
  get list$(): Observable<Array<T>> {
    return this._list$.asObservable().pipe(map(item => item.length > 0 ? item : this._defaultValue));
  }

  set list(list: Array<T>) {
    if (this.localKey) {
      setTimeout(() => {
        this.startTime = new Date().getTime();
        LocalStorageUtils.setCacheItem<Array<T>>(this.localKey, list, this.startTime);
      });
    }
    if (list.length === 0) {
      this.setState(ViewState.empty);
    }
    this._list$.next(list);
  }

  get list(): Array<T> {
    return this._list$.value;
  }

  // 索引
  private _index$ = new BehaviorSubject<number>(0);

  set index(index: number) {
    this._index$.next(index);
  }

  get index(): number {
    return this._index$.getValue();
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

  // 获取当前选中
  get hasData$(): Observable<boolean> {
    return this.list$.pipe(map(list => list.length > 0));
  }

  // 是否显示
  get isShow$(): Observable<boolean> {
    return combineLatest([this.state$, this.hasData$]).pipe(
      distinctUntilChanged(), // 忽略跟上一次相同的值
      map(([state, hasData]) => state === ViewState.idle && hasData),
    );
  }

  set defaultValue(value: Array<T>) {
    this._defaultValue = value;
  }

  protected constructor() {
    super();
    this.initialize();
  }

  // 初始化数据
  initialize(): void {
  }

  /**
   * 定义api请求
   */
  abstract prepare(): Observable<any>;

  /**
   * 请求数据
   */
  abstract loadData(): Observable<UseResult<Array<T>>>;

  /**
   * 刷新数据
   */
  abstract refresh(): Observable<UseResult<Array<T>>>;


  /**
   * 清空缓冲数据
   */
  clear(): void {
    super.clear();
    this._list$.next([]);
    if (this.localKey) {
      LocalStorageUtils.removeItem(this.localKey);
    }
  }

  /**
   * 获取本地数据
   */
  private getLocalData(): Array<T> {
    if (this.localKey) {
      const result = LocalStorageUtils.getCacheItem<Array<T>>(this.localKey);
      if (result) {
        const {startTime, data} = result;
        this.startTime = startTime;
        return data;
      }
    }
    return [];
  }

}
