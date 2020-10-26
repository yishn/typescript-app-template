import { hi } from '../../shared/hi'
import { HiRouteSchema } from '../../shared/routes/hi'
import { Route } from './attachRoute'

export const HiRoute: Route<HiRouteSchema> = {
  path: '/hi/:name',

  async get(data) {
    return {
      body: {
        message: `${hi()} ${data.params.name}`,
      },
    }
  },
}
