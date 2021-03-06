import { Observable } from 'rxjs';
import { UseResult } from '../model/use-result.model';
import { ViewBaseObjectService } from './base/view-base-object.service';

/**
 * 处理http提交
 */
export abstract class ViewSubmitService<P, T> extends ViewBaseObjectService<P, T> {

  /**
   * 提交数据
   * @param params 参数
   */
  submit(params?: P): Observable<UseResult<T>> {
    return this.fetch<T>((data) => this.data = data, params);
  }
}
