import { newsletterCollector, removeNewsletter } from "@/controllers/newsletterEmailCollectorController"
import express from "express"
const router = express.Router()

router.post("/collect", newsletterCollector)
router.delete("/del", removeNewsletter)

export default router
