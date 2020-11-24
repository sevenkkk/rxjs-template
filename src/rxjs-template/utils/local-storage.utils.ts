import { RxjsTempConfigService } from '../rxjs-temp-config.service';

/**
 * 本地存储对象
 */
export class LocalStorageUtils {

  // 版本号
  static version = `v${RxjsTempConfigService.config?.localVersion || 1}`;

  /**
   * 设置对象
   * @param key key值
   * @param data 对象
   */
  static setItem<T>(key: string, data: T): void {
    localStorage.setItem(`${key}-${this.version}`, JSON.stringify(data));
  }

  /**
   * 设置对象(缓存)
   * @param key key值
   * @param data 对象
   * @param startTime 过期时间
   */
  static setCacheItem<T>(key: string, data: T, startTime?: number): void {
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
  static removeItem(key: string): void {
    localStorage.removeItem(`${key}-${this.version}`);
  }

  /**
   * 清理缓存
   */
  static clear(): void {
    localStorage.clear();
  }

}


export interface CacheObj<T> {
  data: T;
  startTime: number;
}
