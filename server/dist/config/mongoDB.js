import mongoose from 'mongoose';
import { env } from './env.js';
export const connectToMongoDB = async () => {
    try {
        console.log("Establishing connection to MongoDB...");
        await mongoose.connect(env.DB_URL);
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.log("ERROR: Connection to MongoDB failed", err);
    }
};
//# sourceMappingURL=mongoDB.js.map