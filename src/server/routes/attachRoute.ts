import { Application, Request, Response } from 'express'
import {
  RequestData,
  ResponseData,
  RouteSchema,
} from '../../shared/routes/types'

type OptionalDefault<T, K extends keyof T, D> = D extends T[K] ? {} : Pick<T, K>

type RouteFunction<T = RequestData, U = ResponseData> = (
  data: T & {
    req: Request
    res: Response
  }
) => Promise<
  Partial<U> &
    OptionalDefault<U, 'body' & keyof U, undefined> &
    OptionalDefault<U, 'headers' & keyof U, {}>
>

export type Route<R extends RouteSchema> = {
  [K in keyof R]: R[K] extends (data: infer T) => Promise<infer U>
    ? RouteFunction<T, U>
    : R[K]
}

export function attachRoute<R extends RouteSchema>(
  app: Application,
  route: Route<R>
) {
  for (let method in route) {
    if (typeof route[method] !== 'function' || !(method in app)) continue

    let routeFunction = route[method] as RouteFunction

    app[method as 'get'](route.path as string, async (req, res) => {
      let requestData: RequestData = {
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
      }

      let partialResponseData = await routeFunction({
        ...requestData,
        req,
        res,
      })

      let responseData: ResponseData = {
        status: 200,
        headers: {},
        body: undefined,
        ...partialResponseData,
      }

      for (let [name, value] of Object.entries(responseData.headers)) {
        res.header(name, value as string)
      }

      res.status(responseData.status).send(responseData.body)
    })
  }
}
