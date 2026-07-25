import { ARTICLE_SECTIONS } from './../constants';
import Article from "@/models/Article";
import { RequestHandler } from "express";
import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod'
import axios, { isAxiosError } from "axios"

const articlesBySectionSchema = z.object({
    sectionName: z.string()
})

export const fetchArticlesBySection: RequestHandler = async (req, res) => {
    const parsedData = articlesBySectionSchema.safeParse(req.params)
    if (!parsedData.success || !ARTICLE_SECTIONS.includes(parsedData.data.sectionName)) return res.fail(404, "NOT_FOUND", "News section does not exist")


    const MIN_LIMIT = 5
    const MAX_LIMIT = 50
    let limit = req.query.limit as string | number
    if (typeof limit == 'string') limit = Math.max(Math.min(parseInt(limit), MAX_LIMIT), MIN_LIMIT)
    else limit = MIN_LIMIT

    let { cursor } = req.query
    let cursorFilterQuery: Record<any, any> = {
        _id: { $gt: cursor }
    }

    if (!isObjectIdOrHexString(cursor)) cursorFilterQuery = {}

    // filter by cursor,sectionName, and sectionLastUpdatedAt
    const maxNewsAgeInMilliseconds = 15 * 60 * 1000
    const articles = await Article.find({
        'sections.name': parsedData.data.sectionName,
        'sections.updatedAt': { $gte: Date.now() - maxNewsAgeInMilliseconds },
        ...cursorFilterQuery
    })
        .limit(limit + 1)
        .sort({ rank: -1 })

    const hasNextPage = articles.length > limit
    hasNextPage && articles.pop()
    const nextCursor = articles[articles.length - 1]?.id
    // const hasPrevPage = isObjectIdOrHexString(cursor) && await Article.countDocuments({ _id: { $lte: cursor } }) > 0 // Could have a better way, not sure how though
    return res.success(200, {
        pagination: { nextCursor, hasNextPage },
        articles
    })
}

const articleParamsSchema = z.object({
    articleId: z.string()
})

export const fetchArticle: RequestHandler = async (req, res) => {
    const parsedData = articleParamsSchema.safeParse(req.params)
    if (!parsedData.success) return res.fail(404, "NOT_FOUND", "This article does not exist")

    const { articleId } = parsedData.data
    if (!isObjectIdOrHexString(articleId)) return res.fail(404, "NOT_FOUND", "This article does not exist")
    const article = await Article.findById(articleId)

    return res.success(200, { article })
}


export const fetchImage: RequestHandler = async (req, res) => {
    const id = req.params.id
    const width = req.query.width
    if (typeof id != "string") {
        return res.status(400).json({ message: "Something went wrong" })
    }
    let url = `http://localhost:3080/file/${id}`
    if (typeof width == "string") {
        url += `?width=${width}`
    }
    try {
        const data = await axios.get(url, { responseType: "arraybuffer" })
        const contentType = data.headers['content-type']?.toString()
        res.set("Content-Type", contentType)
        res.send(data.data)
    } catch (error) {
        if (isAxiosError(error)) {
            return res.status(error.status || 500).json({ message: "Something went wrong" })
        }
        res.status(500).json({ message: "Something went wrong" })
    }
}
