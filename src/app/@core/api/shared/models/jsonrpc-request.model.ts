export interface IJsonRpcRequestData<T> {
  id?: string | number;
  method: string;
  params?: T;
  jsonrpc: string;
}

export class JsonRpcRequest<P> implements IJsonRpcRequestData<P> {
  id: string | number;
  jsonrpc: string;
  method: string;
  params?: P;

  constructor(method: string, params?: P, id = 1) {
    this.id = id;
    this.method = method;
    this.jsonrpc = '2.0';
    this.params = params;
  }
}
