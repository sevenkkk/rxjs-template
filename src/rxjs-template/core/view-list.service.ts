import { Observable, of } from 'rxjs';
import { ViewBaseListService } from './base/view-base-list.service';
import { UseResult } from '../model/use-result.model';
import { take } from 'rxjs/operators';

/**
 * 处理http返回列表
 */
export abstract class ViewListService<P, T> extends ViewBaseListService<P, T> {

  /**
   * 加载数据
   * @param params 参数
   */
  loadData(params?: P): Observable<UseResult<Array<T>>> {
    if (this.list.length > 0 && this.localKey) {
      // 如果过期则刷新数据
      if (this.isExpires()) {
        this.request(params).subscribe();
      }
      return of({success: true, data: this.list} as UseResult<Array<T>>).pipe(take(1));
    } else {
      return this.request(params);
    }
  }

  /**
   * 发送请求
   * @param params 参数
   */
  private request(params?: P): Observable<UseResult<Array<T>>> {
    return this.fetch<Array<T>>((data) => this.list = data, params);
  }

  /**
   * 刷新
   */
  refresh(): Observable<UseResult<Array<T>>> {
    return this.request();
  }

  /**
   * 加载成功回调
   * @param data 返回数据
   */
  onFetchSuccess(data: Array<T>): void {
    super.onFetchSuccess(data);
    if (data != null && data.length === 0) {
      this.empty();
    }
  }
}
