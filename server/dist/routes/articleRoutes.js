import { fetchArticle, fetchArticleIdsBySection, fetchArticles, fetchArticlesByIds, fetchImage, toggleBookmarkController, toggleLikeController } from '../controllers/articleControllers.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import express from 'express';
const router = express.Router();
router.get('/', asyncHandler(fetchArticles));
router.get('/sections/:sectionName', asyncHandler(fetchArticleIdsBySection));
if (router.query)
    router.query('/', asyncHandler(fetchArticlesByIds));
else
    console.error("ERROR: Query Method is undefined");
router.get('/image/:id', asyncHandler(fetchImage));
router.get('/:articleId', asyncHandler(fetchArticle));
router.put('/:articleId/likes', asyncHandler(toggleLikeController));
router.put('/:articleId/bookmarks', asyncHandler(toggleBookmarkController));
export default router;
//# sourceMappingURL=articleRoutes.js.map