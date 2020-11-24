export class LocalStorageUtils {

  static version = 'v2';

  /**
   * 设置对象
   * @param key key值
   * @param data 对象
   */
  static setItem<T>(key: string, data: T) {
    localStorage.setItem(`${key}-${this.version}`, JSON.stringify(data));
  }

  /**
   * 设置对象(缓存)
   * @param key key值
   * @param data 对象
   * @param startTime 过期时间
   */
  static setCacheItem<T>(key: string, data: T, startTime?: number) {
    const cacheObj: CacheObj<T> = {data, startTime: new Date().getTime()};
    localStorage.setItem(`${key}-${this.version}`, JSON.stringify(cacheObj));
  }

  /**
   * 获取对象
   * @param key key值
   */
  static getItem<T>(key: string): T {
    const data: string = localStorage.getItem(`${key}-${this.version}`);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  }

  /**
   * 获取对象（缓存）
   * @param key key值
   */
  static getCacheItem<T>(key: string): CacheObj<T> {
    const data: string = localStorage.getItem(`${key}-${this.version}`);
    if (data) {
      return JSON.parse(data) as CacheObj<T>;
    }
    return null;
  }

  /**
   * 移除单个缓存
   * @param key key
   */
  static removeItem(key: string) {
    localStorage.removeItem(`${key}-${this.version}`);
  }

  /**
   * 清理缓存
   */
  static clear() {
    localStorage.clear();
  }

}


export interface CacheObj<T> {
  data: T;
  startTime: number;
}
