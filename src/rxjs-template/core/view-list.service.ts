import { Observable, of } from 'rxjs';
import { ViewBaseListService } from './base/view-base-list.service';
import { UseResult } from '../model/response-body.model';
import { take } from 'rxjs/operators';

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
  private request(params?: P) {
    return this.fetch<Array<T>>((data) => this.list = data, params);
  }

  /**
   * 刷新
   */
  refresh(): Observable<UseResult<Array<T>>> {
    return this.loadData();
  }

  /**
   * 加载成功回调
   * @param data 返回数据
   */
  onFetchSuccess(data: Array<T>) {
    super.onFetchSuccess(data);
    if (data != null && data.length === 0) {
      this.empty();
    }
  }
}
