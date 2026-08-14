import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/mongoDB.js';
import responseHandler from './middlewares/responseHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import articleRoutes from './routes/articleRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import { env } from './config/env.js';
await connectToMongoDB();
const app = express();
app.use(express.json());
app.use(cors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'QUERY']
}));
app.use(responseHandler);
app.use('/api/articles', articleRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use(errorHandler);
app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT} v1`);
});
//# sourceMappingURL=server.js.map