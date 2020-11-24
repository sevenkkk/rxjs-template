/**
 * 请求状态
 */
export enum ViewState {
  idle, // 正常
  busy, // 加载中
  empty, //  无数据
  error, // 加载失败
  unAuthorized, //  未登录
  unMember, // 不是会员
}
