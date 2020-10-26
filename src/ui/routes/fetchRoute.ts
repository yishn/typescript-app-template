import {
  RequestData,
  ResponseData,
  RouteSchema,
} from '../../shared/routes/types'

type OptionalDefault<T, K extends keyof T, D> = D extends T[K] ? {} : Pick<T, K>

type RouteFunction<T = RequestData, U = ResponseData> = (
  data: Partial<T> &
    OptionalDefault<T, 'headers' & keyof T, {}> &
    OptionalDefault<T, 'params' & keyof T, {}> &
    OptionalDefault<T, 'query' & keyof T, {}> &
    OptionalDefault<T, 'body' & keyof T, undefined>
) => Promise<U>

export type Route<R extends RouteSchema> = {
  [K in keyof R]: R[K] extends (data: infer T) => Promise<infer U>
    ? RouteFunction<T, U>
    : R[K]
}

export function fetchRoute<R extends RouteSchema>(path: R['path']): Route<R> {
  let methods = ['get', 'post', 'put', 'patch', 'delete'] as const
  let result = { path } as Record<'path', R['path']> &
    Partial<Record<typeof methods[number], RouteFunction>>

  for (let method of methods) {
    result[method] = async (
      data: Partial<RequestData>
    ): Promise<ResponseData> => {
      let renderedPath = path

      for (let [name, value] of Object.entries(data.params ?? {})) {
        if (!/^\w+$/.test(name)) {
          throw new Error(
            'Parameter names may only contain alphanumeric characters'
          )
        }

        let regex = new RegExp(`:${name}`, 'g')
        renderedPath = renderedPath.replace(
          regex,
          encodeURIComponent(value as string)
        )
      }

      let query = new URLSearchParams(data.query).toString()
      if (query.length > 0) renderedPath += `?${query}`

      let rawResponse = await fetch(renderedPath, {
        method,
        body: data.body != null ? JSON.stringify(data.body) : null,
        headers: {
          'Content-Type': 'application/json',
          ...data.headers,
        },
      })

      let body = await rawResponse.json()

      return {
        status: rawResponse.status,
        headers: [...rawResponse.headers.entries()].reduce(
          (acc, [name, value]) => {
            acc[name] = value
            return acc
          },
          {} as Record<string, string>
        ),
        body,
      }
    }
  }

  return result as Route<R>
}
