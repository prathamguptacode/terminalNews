import { decrementLikeController, fetchArticle, fetchArticleIdsBySection, fetchArticlesByIds, fetchImage, incrementLikeController } from '@/controllers/articleControllers'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()


router.get('/sections/:sectionName', asyncHandler(fetchArticleIdsBySection))

if (router.query) router.query('/', asyncHandler(fetchArticlesByIds))
else console.error("ERROR: Query Method is undefined")

router.get('/image/:id', asyncHandler(fetchImage))

router.get('/:articleId', asyncHandler(fetchArticle))

router.patch('/:articleId/likes', asyncHandler(incrementLikeController))
router.delete('/:articleId/likes', asyncHandler(decrementLikeController))


export default router
