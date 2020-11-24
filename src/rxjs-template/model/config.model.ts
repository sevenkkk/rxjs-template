import { UseResult } from './use-result.model';
import { ViewState } from './view-state.model';

export interface ConfigModel {
  errorMessage?: string;
  handleHttpError?: (error: any, errorCallback: (state: ViewState | any) => void) => string;
  handleHttpResult?: <T>(resBody: any) => UseResult<T>;
}
