import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map, tap, withLatestFrom } from 'rxjs/operators';
import { UseResult } from '../model/use-result.model';
import { ViewBaseListService } from './base/view-base-list.service';

/**
 * 处理http返回列表（带有分页，app）
 */
export abstract class ViewMoreListService<P, T> extends ViewBaseListService<P, T> {

  private _page = 1;
  private _pageSize = 20;

  set pageSize(pageSize: number) {
    this._pageSize = pageSize;
    // @ts-ignore
    this.params = {pageSize: this.pageSize};
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set page(page: number) {
    this._page = page;
    // @ts-ignore
    this.params = {page: this.page};
  }

  get page(): number {
    return this._page;
  }

  private count: number;

  private _disabled$ = new BehaviorSubject<boolean>(true);
  private _noMore$ = new BehaviorSubject<boolean>(false);
  private _totalCount$ = new BehaviorSubject<number>(0);

  protected constructor() {
    super();
    // @ts-ignore
    this.params = {page: this.page, pageSize: this.pageSize};
  }


  /**
   * 获取disabled状态
   */
  get disabled$(): Observable<boolean> {
    return this._disabled$.asObservable();
  }

  /**
   * 获取noMore状态
   */
  set noMore(noMore: boolean) {
    this._noMore$.next(noMore);
  }


  /**
   * 获取disabled状态
   */
  get noMore$(): Observable<boolean> {
    return this._noMore$.asObservable();
  }

  /**
   * 获取disabled状态
   */
  set disabled(disabled: boolean) {
    this._disabled$.next(disabled);
  }


  /**
   * 获取数据总数
   */
  set totalCount(count: number) {
    this._totalCount$.next(count);
  }


  get totalCount(): number {
    return this._totalCount$.value;
  }

  /**
   * 获取数据总数
   */
  get totalCount$(): Observable<number> {
    return this._totalCount$.asObservable();
  }

  /**
   * 加载
   */
  loadData(params?: P): Observable<UseResult<Array<T>>> {
    let _params = {page: this.page, pageSize: this.pageSize};
    // @ts-ignore
    if (params) {
      _params = {..._params, ...params};
    }
    // @ts-ignore
    this.params = _params;
    return this.doFetch<Array<T>>(this.prepare()).pipe(
      tap((res) => {
        const {success, data, errorMessage, totalCount} = res;
        if (success) {
          if (this.isDefaultSet) {
            this.setList(data);
          }
          this.totalCount = totalCount;
          this.onFetchSuccess(data);
          this.noMore = false;
        } else {
          this.onFetchFail(errorMessage);
        }
        this.onFetchComplete(res);
      }),
    );
  }

  /**
   * 加载更多
   */
  loadMore(): Observable<boolean> {
    // @ts-ignore
    this.params = {page: this.params.page + 1};
    return this.doFetch<Array<T>>(this.prepare()).pipe(
      withLatestFrom(this.list$),
      delay(300),
      tap(([res, old]) => {
        const {success, data, errorMessage} = res;
        if (success) {
          if (this.isDefaultSet) {
            this.setList(data, old);
          }
          this.onFetchSuccess(this.list);
          this.noMore = data.length < this.pageSize;
        } else {
          this.onFetchFail(errorMessage);
        }
        this.onFetchComplete(res);
      }),
      map(([{success}]) => success),
    );
  }

  /**
   * 刷新
   */
  refresh(): Observable<UseResult<Array<T>>> {
    // @ts-ignore
    return this.loadData();
  }

  /**
   * 设置值
   * @param list 当前请求数据
   * @param oldList 之前的数据
   */
  private setList(list: Array<T>, oldList: Array<T> = null): void {
    let newList = list;
    if (oldList) {
      newList = [...oldList, ...list];
    }
    this.list = newList;
    this.count = newList.length;
    this.disabled = list.length < this.pageSize;
  }

  /**
   * 加载成功回调
   * @param data 返回数据
   */
  onFetchSuccess(data: Array<T>): void {
    super.onFetchSuccess(data);
    if (data.length === 0) {
      this.empty();
    }
  }


}
