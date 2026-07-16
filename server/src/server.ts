import 'dotenv/config'
import express from 'express'
import cors from 'cors'


import { connectToMongoDB } from './config/mongoDB'
import responseHandler from './middlewares/responseHandler'
import errorHandler from './middlewares/errorHandler'
import asyncHandler from './middlewares/asyncHandler'

import Article from './models/Article'
import { isObjectIdOrHexString } from 'mongoose'

import articleRoutes from './routes/articleRoutes'



const app = express()

app.use(express.json())
app.use(cors({
    origin: 'localhost:5173',
    credentials: true
}))
app.use(responseHandler)


app.use('/api/articles', articleRoutes)

app.get('/news', asyncHandler(async (req, res) => {
    const MIN_LIMIT = 5
    const MAX_LIMIT = 50
    let limit = req.query.limit as string | number
    if (typeof limit == 'string') limit = Math.max(Math.min(parseInt(limit), MAX_LIMIT), MIN_LIMIT)
    else limit = MIN_LIMIT

    let { cursor } = req.query
    let searchQuery: Record<any, any> = {
        _id: { $gt: cursor }
    }

    if (!isObjectIdOrHexString(cursor)) searchQuery = {}
    const newsArticles = await Article.find(searchQuery).limit(limit + 1)
    const hasNextPage = newsArticles.length > limit
    hasNextPage && newsArticles.pop()
    const nextCursor = newsArticles[newsArticles.length - 1].id
    const hasPrevPage = isObjectIdOrHexString(cursor) && await Article.countDocuments({ _id: { $lte: cursor } }) > 0 // Could have a better way, not sure how though
    return res.success(200, {
        pagination: { nextCursor, hasNextPage, hasPrevPage, prevCursor: cursor },
        newsArticles
    })
}))



app.use(errorHandler)

connectToMongoDB()


app.listen(8080, () => {
    console.log(`Listening on port ${8080}`)
})

