import { RequestData, ResponseData, RouteSchema } from './types'

export interface HiRouteSchema extends RouteSchema {
  path: '/hi/:name'

  get(
    data: RequestData<{}, { name: string }, {}, void>
  ): Promise<ResponseData<{}, { message: string }>>
}
