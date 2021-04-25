import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UseResult } from '../model/use-result.model';
import { ViewBaseListService } from './base/view-base-list.service';

/**
 * 处理http返回列表（带有分页, pc）
 */
export abstract class ViewPageListService<P, T> extends ViewBaseListService<P, T> {

  private _page = 1;
  private _pageSize = 10;

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

  private _totalCount$ = new BehaviorSubject<number>(0);

  protected constructor() {
    super();
    // @ts-ignore
    this.params = {page: this.page, pageSize: this.pageSize};
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
    const _params = {...this.params, page: this.page, pageSize: this.pageSize};
    // @ts-ignore
    if (params) {
      this.params = {..._params, ...params};
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
