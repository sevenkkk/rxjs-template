import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class ViewBaseIndexService<T> {

  // 索引
  private _index$ = new BehaviorSubject<number>(0);

  set index(index: number) {
    this._index$.next(index);
  }

  get index(): number {
    return this._index$.value;
  }

  // 获取索引
  get index$(): Observable<number> {
    return this._index$.asObservable();
  }

  abstract list$: Observable<Array<T>>;

  // 获取当前选中
  get active$(): Observable<T> {
    // 同时监听
    return combineLatest([this.list$, this.index$]).pipe(
      map(([list, index]) => list.length > index ? list[index] : undefined),
    );
  }

}
