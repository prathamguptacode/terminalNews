import 'dotenv/config'
import express from 'express'
import { connectToMongoDB } from './config/mongoDB'
import responseHandler from './middlewares/responseHandler'
import errorHandler from './middlewares/errorHandler'
import asyncHandler from './middlewares/asyncHandler'
import articleModel from './models/articleModel'
import { isObjectIdOrHexString } from 'mongoose'
import { z } from 'zod'


const app = express()


app.use(responseHandler)

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
    const newsArticles = await articleModel.find(searchQuery).limit(limit + 1)
    const hasNextPage = newsArticles.length > limit
    hasNextPage && newsArticles.pop()
    const nextCursor = newsArticles[newsArticles.length - 1].id
    const hasPrevPage = isObjectIdOrHexString(cursor) && await articleModel.countDocuments({ _id: { $lte: cursor } }) > 0 // Could have a better way, not sure how though
    return res.success(200, {
        pagination: { nextCursor, hasNextPage, hasPrevPage, prevCursor: cursor },
        newsArticles
    })
}))

app.get('/news/:articleId', asyncHandler(async (req, res) => {
    const paramData = z.object({ articleId: z.string() }).safeParse(req.params)
    if (!paramData.success) return res.fail(404, "NOT_FOUND", "Article with given id was not found")

    const { articleId } = paramData.data
    const article = await articleModel.findById(articleId)

    return res.success(200, { article })
}))


app.use(errorHandler)

connectToMongoDB()

app.listen(8080, () => {
    console.log(`Listening on port ${8080}`)
})

