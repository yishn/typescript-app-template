import { response } from 'express'
import { HiRouteSchema } from '../shared/routes/hi'
import { fetchRoute } from './routes/fetchRoute'

async function main() {
  let response = await fetchRoute<HiRouteSchema>('/hi/:name').get({
    params: {
      name: 'yishn',
    },
  })

  alert(response.body.message)
}

main()
