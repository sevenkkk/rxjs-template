import { Observable } from 'rxjs';
import { UseResult } from '../model/response-body.model';
import { ViewBaseObjectService } from './base/view-base-object.service';

export abstract class ViewSubmitService<P, T> extends ViewBaseObjectService<P, T> {

  /**
   * 提交数据
   * @param params 参数
   */
  submit(params?: P): Observable<UseResult<T>> {
    return this.fetch<T>((data) => this.data = data, params);
  }
}
