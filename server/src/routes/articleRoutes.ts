import { fetchArticle, fetchArticlesBySection, fetchImage } from '@/controllers/articleControllers'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()


router.get('/sections/:sectionName', asyncHandler(fetchArticlesBySection))

router.get('/image/:id', asyncHandler(fetchImage))

router.get('/:articleId', asyncHandler(fetchArticle))


export default router
