import { fetchArticle, fetchArticlesBySection } from '@/controllers/articleControllers'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()

router.get('/sections/:sectionName', asyncHandler(fetchArticlesBySection))

router.get('/:articleId', asyncHandler(fetchArticle))

export default router