import { ARTICLE_SECTIONS } from './../constants';
import Article from "@/models/Article";
import { RequestHandler } from "express";
import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod'
import axios, { isAxiosError } from "axios"

const articleIdsBySectionSchema = z.object({
    sectionName: z.string()
})

export const fetchArticleIdsBySection: RequestHandler = async (req, res) => {
    const parsedData = articleIdsBySectionSchema.safeParse(req.params)
    if (!parsedData.success || !ARTICLE_SECTIONS.includes(parsedData.data.sectionName)) return res.fail(404, "NOT_FOUND", "News section does not exist")



    const LIMIT = 200
    let { cursor } = req.query as { cursor: string | number }


    if (typeof cursor == 'string') cursor = parseInt(cursor)
    if (typeof cursor != 'number') cursor = 0

    const maxNewsAgeInMilliseconds = 15 * 60 * 1000 ** 2
    const maxAgeThreshold = new Date(Date.now() - maxNewsAgeInMilliseconds)

    const articles = await Article.aggregate([
        {
            $match: {
                sections: {
                    $elemMatch: {
                        updatedAt: { $gte: maxAgeThreshold },
                        name: parsedData.data.sectionName,
                        rank: { $gt: cursor }
                    }
                }
            }
        },
        {
            $addFields: {
                section: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: '$sections',
                                cond: { $eq: ['$$this.name', parsedData.data.sectionName] }
                            }
                        }, 0]
                }
            }
        },
        {
            $sort: { 'section.rank': 1 }
        },
        {
            $limit: LIMIT
        },
        {
            $project: {
                _id: 1
            }
        }
    ])

    const articleIds = articles.map(a => a._id)

    return res.success(200, {
        count: articleIds.length,
        articleIds
    })
}

const articleByIdsSchema = z.object({ articleIds: z.array(z.string()) })

export const fetchArticlesByIds: RequestHandler = async (req, res) => {
    const MIN_LIMIT = 5
    const MAX_LIMIT = 50

    let { limit } = req.query as { limit: string | number }
    if (typeof limit == 'string') limit = Math.max(Math.min(parseInt(limit), MAX_LIMIT), MIN_LIMIT)
    else limit = MIN_LIMIT

    const parsedData = articleByIdsSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid ids")

    const articles = await Article.find({ _id: parsedData.data.articleIds }).limit(limit).select("title content updatedAt image")

    return res.success(200, { articles })
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


export const incrementLikeController: RequestHandler = async (req, res) => {
    const { articleId } = req.params
    await Article.updateOne({ _id: articleId }, { $inc: { likes: 1 } })

    return res.success()
}
export const decrementLikeController: RequestHandler = async (req, res) => {
    const { articleId } = req.params
    await Article.updateOne({ _id: articleId }, { $inc: { likes: -1 } })

    return res.success()
}