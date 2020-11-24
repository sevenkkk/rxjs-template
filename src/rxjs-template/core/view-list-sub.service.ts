import { ViewListService } from './view-list.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class ViewListSubService<P, T, S> extends ViewListService <P, T> {

  // 索引子index
  private _subIndex$ = new BehaviorSubject<number>(0);

  set subIndex(index: number) {
    this._subIndex$.next(index);
  }

  get subIndex(): number {
    return this._subIndex$.getValue();
  }

  get subIndex$(): Observable<number> {
    return this._subIndex$.asObservable();
  }

  protected abstract getSubAttrName(): keyof T;

  getSubAttr(obj: T): S[] {
    return (obj[this.getSubAttrName()] || []) as S[];
  }

  /**
   * 所有的二级列表
   */
  get allSubList$(): Observable<Array<S>> {
    return this.list$.pipe(
      map(list => list.reduce((m, n) => [...m, ...this.getSubAttr(n)], [])),
    );
  }

  /**
   * 选中的二级列表
   */
  get activeSubList$(): Observable<Array<S>> {
    return this.active$.pipe(map(item => this.getSubAttr(item)));
  }

  /**
   * 子索引选中对象
   */
  get subActive$(): Observable<S> {
    return combineLatest([this.activeSubList$, this.subIndex$]).pipe(
      map(([list, index]) => (list.length > 0 && list.length > index) ? list[index] : undefined),
    );
  }
}
