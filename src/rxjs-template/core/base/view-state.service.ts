import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ViewState } from '../../model/view-state.model';
import { UseResult } from '../../model/use-result.model';
import { RxjsTempConfigService } from '../../rxjs-temp-config.service';

export abstract class ViewStateService {

  // 异常信息
  private _errorMessage = new BehaviorSubject<string>('');

  private _state$ = new BehaviorSubject<ViewState>(ViewState.idle);
  private _isError$ = new BehaviorSubject<boolean>(false);

  get errorMessage$(): Observable<string> {
    return this._errorMessage.asObservable();
  }

  set errorMessage(_errorMessage: string) {
    this._errorMessage.next(_errorMessage);
  }

  get errorMessage(): string {
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

  setState(state: ViewState): void {
    this._state$.next(state);
  }

  start(): void {
    this.setState(ViewState.busy);
  }

  end(): void {
    this.setState(ViewState.idle);
    this.isError = false;
  }

  error(): void {
    this.setState(ViewState.error);
    this.isError = true;
  }

  empty(): void {
    this.setState(ViewState.empty);
  }

  resetState(): void {
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

  /**
   * 请求api
   * @param ob 请求体
   * @param errorCallback 错误回调
   */
  doFetch<T>(ob: Observable<any>, errorCallback = null): Observable<UseResult<T>> {
    this.start();
    return ob.pipe(
      map((item) => {
        if (!RxjsTempConfigService.config?.handleHttpResult) {
          throw Error('必须指定 RxjsTempConfigService.config.handleHttpResult');
        }
        return ({success: true, ...(RxjsTempConfigService.config?.handleHttpResult<T>(item) || {})});
      }),
      tap(() => this.end()),
      catchError((err) => this.handleError(err, (errorMessage: string, errorCode: number) => of({
        success: false,
        errorCode,
        errorMessage,
      }), errorCallback)),
    );
  }

  /**
   * 异常处理
   * @param error 错误
   * @param returnCallback 返回
   * @param errorCallback 错误回调
   */
  handleError<R>(error: any, returnCallback: (errorMessage: string, errorCode: number) => Observable<R>, errorCallback): Observable<R> {
    const {errorCode, errorMessage} = RxjsTempConfigService.config?.handleHttpError(error,
      () => this.error()) || {errorMessage: RxjsTempConfigService.config.errorMessage, errorCode: 500};
    this.errorMessage = errorMessage;
    if (errorCallback) {
      errorCallback();
    }
    return returnCallback(this.errorMessage, errorCode);
  }

}
