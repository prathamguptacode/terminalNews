import { ARTICLE_SECTIONS } from './../constants.js';
import Article from '../models/Article.js';
import mongoose, { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';
import axios, { isAxiosError } from 'axios';
import { env } from '../config/env.js';
const articleIdsBySectionSchema = z.object({
    sectionName: z.string(),
});
export const fetchArticleIdsBySection = async (req, res) => {
    const parsedData = articleIdsBySectionSchema.safeParse(req.params);
    if (!parsedData.success || !ARTICLE_SECTIONS.includes(parsedData.data.sectionName))
        return res.fail(404, 'NOT_FOUND', 'News section does not exist');
    const LIMIT = 200;
    let { cursor } = req.query;
    if (typeof cursor == 'string')
        cursor = parseInt(cursor);
    if (typeof cursor != 'number')
        cursor = 0;
    const maxNewsAgeInMilliseconds = 24 * 60 * 60 * 1000;
    const maxAgeThreshold = new Date(Date.now() - maxNewsAgeInMilliseconds);
    const articles = await Article.aggregate([
        {
            $match: {
                sections: {
                    $elemMatch: {
                        updatedAt: { $gte: maxAgeThreshold },
                        name: parsedData.data.sectionName,
                        rank: { $gt: cursor },
                    },
                },
            },
        },
        {
            $addFields: {
                section: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: '$sections',
                                cond: { $eq: ['$$this.name', parsedData.data.sectionName] },
                            },
                        },
                        0,
                    ],
                },
            },
        },
        {
            $sort: { 'section.rank': 1 },
        },
        {
            $limit: LIMIT,
        },
        {
            $project: {
                _id: 1,
            },
        },
    ]);
    const articleIds = articles.map((a) => a._id);
    return res.success(200, {
        count: articleIds.length,
        articleIds,
    });
};
const articleByIdsSchema = z.object({ articleIds: z.array(z.string()) });
export const fetchArticlesByIds = async (req, res) => {
    const MIN_LIMIT = 5;
    const MAX_LIMIT = 50;
    let { limit } = req.query;
    if (typeof limit !== 'string')
        limit = MIN_LIMIT;
    else
        limit = typeof parseInt(limit) === 'number' ? parseInt(limit) : MIN_LIMIT;
    limit = Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, limit));
    const parsedData = articleByIdsSchema.safeParse(req.body);
    if (!parsedData.success)
        return res.fail(400, 'BAD_REQUEST', 'Invalid ids');
    let objectIdArray = [];
    try {
        objectIdArray = parsedData.data.articleIds.map((e) => new mongoose.Types.ObjectId(e));
    }
    catch {
        return res.fail(400, 'INVALID_ID');
    }
    const articles = await Article.aggregate([
        {
            $match: {
                _id: { $in: objectIdArray },
            },
        },
        {
            $addFields: {
                sortOrder: { $indexOfArray: [objectIdArray, '$_id'] },
            },
        },
        {
            $sort: { sortOrder: 1 },
        },
        {
            $project: {
                title: 1,
                content: 1,
                updatedAt: 1,
                image: 1,
                tags: 1,
                sections: 1,
            },
        },
    ]);
    return res.success(200, { articles });
};
const articleParamsSchema = z.object({
    articleId: z.string(),
});
export const fetchArticle = async (req, res) => {
    const parsedData = articleParamsSchema.safeParse(req.params);
    if (!parsedData.success)
        return res.fail(404, 'NOT_FOUND', 'This article does not exist');
    const { articleId } = parsedData.data;
    if (!isObjectIdOrHexString(articleId))
        return res.fail(404, 'NOT_FOUND', 'This article does not exist');
    const article = await Article.findById(articleId);
    return res.success(200, { article });
};
export const fetchImage = async (req, res) => {
    const id = req.params.id;
    const width = req.query.width;
    if (typeof id != 'string') {
        return res.status(400).json({ message: 'Something went wrong' });
    }
    let url = `${env.IMAGE_DB_URL}/file/${id}`;
    if (typeof width == 'string') {
        url += `?width=${width}`;
    }
    try {
        const data = await axios.get(url, { responseType: 'arraybuffer' });
        const contentType = data.headers['content-type']?.toString();
        res.set('Content-Type', contentType);
        res.send(data.data);
    }
    catch (error) {
        if (isAxiosError(error)) {
            return res.status(error.status || 500).json({ message: 'Something went wrong' });
        }
        res.status(500).json({ message: 'Something went wrong' });
    }
};
export const toggleLikeController = async (req, res) => {
    const { articleId } = req.params;
    const { isLiked } = req.body;
    await Article.updateOne({ _id: articleId }, { $inc: { likes: isLiked ? 1 : -1 } }, { timestamps: false });
    return res.success();
};
export const toggleBookmarkController = async (req, res) => {
    const { articleId } = req.params;
    const { isBookmarked } = req.body;
    await Article.updateOne({ _id: articleId }, { $inc: { bookmarks: isBookmarked ? 1 : -1 } }, { timestamps: false });
    return res.success();
};
export const fetchArticles = async (req, res) => {
    const { title } = req.query;
    if (typeof title !== 'string')
        return res.fail(400, 'BAD_REQUEST', 'Invalid body');
    const MIN_LIMIT = 5;
    const MAX_LIMIT = 20;
    let { limit } = req.query;
    if (typeof limit !== 'string')
        limit = MIN_LIMIT;
    else
        limit = typeof parseInt(limit) === 'number' ? parseInt(limit) : MIN_LIMIT;
    limit = Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, limit));
    const searchQuery = title
        ? {
            $search: {
                autocomplete: {
                    query: title.trim(),
                    path: 'title',
                    tokenOrder: 'sequential',
                },
            },
        }
        : {
            $match: { title: { $regex: title } },
        };
    const articles = await Article.aggregate([
        {
            ...searchQuery,
        },
        {
            $sort: { updatedAt: -1 },
        },
        {
            $limit: limit,
        },
        {
            $project: {
                title: 1,
            },
        },
    ]);
    return res.success(200, { articles });
};
export const nextBtn = async (req, res) => {
    const articleId = req.params.articleId;
    const article = await Article.findById(articleId).select('sections');
    if (!article)
        return res.fail(404, 'NOT_FOUND');
    const reqName = req.query.name;
    const name = typeof reqName === 'string' && reqName !== '' ? reqName : article.sections[0].name;
    let rank = 0;
    const BreakException = {};
    try {
        article.sections.forEach((e) => {
            if (name === e.name) {
                rank = e.rank;
                throw BreakException;
            }
        });
        return res.fail(404, 'NOT_FOUND', 'News section does not exist on id news');
    }
    catch (error) {
        if (error !== BreakException) {
            return res.fail();
        }
    }
    const LIMIT = 1;
    const maxNewsAgeInMilliseconds = 24 * 60 * 60 * 1000;
    const maxAgeThreshold = new Date(Date.now() - maxNewsAgeInMilliseconds);
    const articles = await Article.aggregate([
        {
            $match: {
                sections: {
                    $elemMatch: {
                        updatedAt: { $gte: maxAgeThreshold },
                        name: name,
                        rank: { $gt: rank },
                    },
                },
            },
        },
        {
            $limit: LIMIT,
        },
        {
            $project: {
                _id: 1,
            },
        },
    ]);
    const articleIds = articles.map((a) => a._id);
    return res.success(200, {
        articleIds,
        section: name,
    });
};
//# sourceMappingURL=articleControllers.js.map