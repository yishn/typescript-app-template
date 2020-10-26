import * as path from 'path'
import * as express from 'express'
import { attachRoute } from './routes/attachRoute'
import { HiRoute } from './routes/hi'

const app = express()
const port = 3000

app.use(express.json())
app.use('/', express.static(path.resolve(__dirname, '../ui')))

attachRoute(app, HiRoute)

app.listen(port, () => {
  console.log(`Server listening at :${port}`)
})
