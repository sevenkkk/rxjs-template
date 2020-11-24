import { BehaviorSubject, Observable } from 'rxjs';
import { ViewStateService } from './view-state.service';

export abstract class ViewBaseParamService<P extends { page?: number, pageSize?: number }> extends ViewStateService {

  // 参数
  protected _params$ = new BehaviorSubject<P>({} as P);

  // 获取参数
  get params$(): Observable<P> {
    return this._params$.asObservable();
  }

  // 获取参数
  get params(): P {
    return this._params$.value;
  }

  // 设置参数
  set params(obj: P) {
    if (obj) {
      this._params$.next({...this.params, ...obj});
    }
  }

  /**
   * 定义api请求
   */
  abstract prepare(): Observable<any>;

  /**
   * 清理请求参数
   */
  clear(): void {
    this._params$.next({} as P);
  }

}
