import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ViewState } from '../../model/view-state.model';
import { ResponseBody, UseResult } from '../../model/response-body.model';
import { EventBusService, UN_AUTHORIZED_EXCEPTION } from '../../utils/event-bus.service';

export abstract class ViewStateService {

  // 异常信息
  private _errorMessage = new BehaviorSubject<string>('');

  private _state$ = new BehaviorSubject<ViewState>(ViewState.idle);
  private _isError$ = new BehaviorSubject<boolean>(false);

  get errorMessage$() {
    return this._errorMessage.asObservable();
  }

  set errorMessage(_errorMessage: string) {
    this._errorMessage.next(_errorMessage);
  }

  get errorMessage() {
    return this._errorMessage.getValue();
  }

  get state$(): Observable<ViewState> {
    return this._state$.asObservable();
  }

  get isError$(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  set isError(isError: boolean) {
    this._isError$.next(isError);
  }

  setState(state: ViewState) {
    this._state$.next(state);
  }

  start() {
    this.setState(ViewState.busy);
  }

  end() {
    this.setState(ViewState.idle);
    this.isError = false;
  }

  error() {
    this.setState(ViewState.error);
    this.isError = true;
  }

  empty() {
    this.setState(ViewState.empty);
  }

  resetState() {
    this.setState(ViewState.idle);
  }

  /**
   * 正常状态
   */
  get normal$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state === ViewState.idle || state === ViewState.busy),
    );
  }

  /**
   * 无数据
   */
  get empty$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state === ViewState.empty),
    );
  }

  /**
   * 发生错误
   */
  get error$(): Observable<boolean> {
    return this.isError$;
  }

  unAuthorized() {
    this.setState(ViewState.unAuthorized);
    this.onUnAuthorizedException();
  }

  /// 未授权的回调
  onUnAuthorizedException() {
    EventBusService.emit(UN_AUTHORIZED_EXCEPTION);
  }

  /**
   * 请求api
   * @param ob 请求体
   * @param errorCallback 错误回调
   */
  doFetch<T>(ob: Observable<ResponseBody>, errorCallback = null): Observable<UseResult<T>> {
    this.start();
    return ob.pipe(
      map((item) => {
        return {
          success: true,
          data: item.payload,
          totalCount: item.count ? item.count : 0,
          errorCode: item.errorCode,
        };
      }),
      tap(() => this.end()),
      catchError((err) => this.handleError(err, (errorMessage: string) => of({
        success: false,
        errorMessage,
      }), errorCallback)),
    );
  }

  handleError<R>(error: any, returnCallback: (errorMessage: string) => Observable<R>, errorCallback, state = true): Observable<R> {
    this.errorMessage = '网络请求发送失败';
    console.log(error);
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          this.errorMessage = error.error.errorMessage;
          if (state) {
            this.error();
          }
          break;
        case 403:
          this.errorMessage = error.error.errorMessage;
          if (state) {
            this.error();
          }
          break;
        case 401:
          this.unAuthorized();
          break;
        default:
          if (state) {
            this.error();
          }
          break;
      }
    }
    if (errorCallback) {
      errorCallback();
    }
    return returnCallback(this.errorMessage);
  }

}
