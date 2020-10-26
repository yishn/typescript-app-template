export interface RequestData<
  H extends Record<string, string | undefined> = any,
  P extends Record<string, string> = any,
  Q extends Record<string, string | undefined> = any,
  B = any
> {
  headers: H
  params: P
  query: Q
  body: B
}

export interface ResponseData<
  H extends Record<string, string | undefined> = any,
  B = any
> {
  status: number
  headers: H
  body: B
}

export interface RouteSchema {
  path: string

  get?(data: RequestData): Promise<ResponseData>
  post?(data: RequestData): Promise<ResponseData>
  put?(data: RequestData): Promise<ResponseData>
  patch?(data: RequestData): Promise<ResponseData>
  delete?(data: RequestData): Promise<ResponseData>
}
