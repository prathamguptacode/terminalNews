import { ARTICLE_SECTIONS } from './../constants';
import Article from "@/models/Article";
import { RequestHandler } from "express";
import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod'

export const fetchArticlesBySection: RequestHandler = async (req, res) => {
    const paramSchema = z.object({
        sectionName: z.string()
    })
    const parsedData = paramSchema.safeParse(req.params)
    if (!parsedData.success || !ARTICLE_SECTIONS.includes(parsedData.data.sectionName)) return res.fail(404, "NOT_FOUND", "News section does not exist")


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
    const articles = await Article.find({ 'sections.name': parsedData.data.sectionName, ...searchQuery }).limit(limit + 1)
    const hasNextPage = articles.length > limit
    hasNextPage && articles.pop()
    const nextCursor = articles[articles.length - 1]?.id
    const hasPrevPage = isObjectIdOrHexString(cursor) && await Article.countDocuments({ _id: { $lte: cursor } }) > 0 // Could have a better way, not sure how though
    return res.success(200, {
        count: articles.length,
        pagination: { nextCursor, hasNextPage, hasPrevPage, prevCursor: cursor },
        articles
    })
}

export const fetchArticle: RequestHandler = async (req, res) => {
    const paramSchema = z.object({
        articleId: z.string()
    })
    const parsedData = paramSchema.safeParse(req.params)
    if (!parsedData.success) return res.fail(404, "NOT_FOUND", "This article does not exist")

    const { articleId } = parsedData.data
    if (!isObjectIdOrHexString(articleId)) return res.fail(404, "NOT_FOUND", "This article does not exist")
    const article = await Article.findById(articleId)

    return res.success(200, { article })
}