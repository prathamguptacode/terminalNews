import { newsletterCollector, removeNewsletter } from "../controllers/newsletterEmailCollectorController.js";
import express from "express";
const router = express.Router();
router.post("/collect", newsletterCollector);
router.delete("/del", removeNewsletter);
export default router;
//# sourceMappingURL=newsletterRoutes.js.map