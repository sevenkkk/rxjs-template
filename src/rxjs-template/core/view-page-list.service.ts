import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UseResult } from '../model/use-result.model';
import { ViewBaseListService } from './base/view-base-list.service';

/**
 * 处理http返回列表（带有分页, pc）
 */
export abstract class ViewPageListService<P, T> extends ViewBaseListService<P, T> {

  private _totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);

  get pageSize$(): Observable<number> {
    return this._pageSize$.asObservable();
  }

  set pageSize(pageSize: number) {
    this._pageSize$.next(pageSize);
  }

  get pageSize(): number {
    return this._pageSize$.getValue();
  }

  get page$(): Observable<number> {
    return this._page$.asObservable();
  }

  set page(page: number) {
    this._page$.next(page);
  }

  get page(): number {
    return this._page$.getValue();
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

  protected constructor() {
    super();
  }

  /**
   * 分页加载
   * @param pageParams 分页条件
   */
  loadDataByPage(pageParams: { page?: number, pageSize?: number }): Observable<UseResult<Array<T>>> {
    const {page, pageSize} = pageParams;
    if (page) {
      this.page = page;
    }
    if (pageSize) {
      this.pageSize = pageSize;
    }
    return this.loadData();
  }

  /**
   * 加载
   */
  loadData(params?: P): Observable<UseResult<Array<T>>> {
    this.params = {...this.params, page: this.page, pageSize: this.pageSize};
    // @ts-ignore
    if (params) {
      this.params = {...this.params, ...params};
    }
    return this.doFetch<Array<T>>(this.prepare()).pipe(
      tap((res) => {
        const {success, data, errorMessage, totalCount} = res;
        if (success) {
          if (this.isDefaultSet) {
            this.list = data;
            this.totalCount = totalCount;
          }
          this.onFetchSuccess(data);
        } else {
          this.onFetchFail(errorMessage);
        }
        this.onFetchComplete(res);
      }),
    );
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
