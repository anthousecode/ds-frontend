import {IJsonRpcResponseError} from './jsonrpc-response-error.interface';

export interface IJsonRpcResponse<T> {
  id: string;
  jsonrpc: string;
  method: string;
  result?: T;
  error?: IJsonRpcResponseError;
}
