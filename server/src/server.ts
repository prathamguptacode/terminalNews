import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { connectToMongoDB } from './config/mongoDB'
import responseHandler from './middlewares/responseHandler'
import errorHandler from './middlewares/errorHandler'

import articleRoutes from './routes/articleRoutes'
import { env } from './config/env'



await connectToMongoDB()

const app = express()

app.use(express.json())
app.use(cors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'QUERY']
}))
app.use(responseHandler)


app.use('/api/articles', articleRoutes)



app.use(errorHandler)

app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`)
})

