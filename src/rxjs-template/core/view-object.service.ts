import { Observable, of } from 'rxjs';
import { UseResult } from '../model/use-result.model';
import { ViewBaseObjectService } from './base/view-base-object.service';
import { take } from 'rxjs/operators';

export abstract class ViewObjectService<P, T> extends ViewBaseObjectService<P, T> {

  /**
   * 加载数据
   * @param params 参数
   */
  loadData(params?: P): Observable<UseResult<T>> {
    if (this.data && this.localKey) {
      // 如果过期则刷新数据
      if (this.isExpires) {
        this.request(params).subscribe();
      }
      return of({success: true, data: this.data} as UseResult<T>).pipe(take(1));
    } else {
      return this.request(params);
    }
  }

  /**
   * 发送请求
   * @param params 参数
   */
  private request(params?: P): Observable<UseResult<T>> {
    return this.fetch<T>((data) => this.data = data, params);
  }
}
