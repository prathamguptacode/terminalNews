import newsletterEmails from "../models/newsletterEmails.js";
import { z } from "zod";
const newletterReqSchema = z.object({
    email: z.email()
});
export const newsletterCollector = async (req, res) => {
    const val = newletterReqSchema.safeParse(req.body);
    if (val.success == false) {
        return res.fail(400, "INVALID_BODY", "Something went wrong");
    }
    const newEmail = new newsletterEmails({ email: val.data.email });
    await newEmail.save();
    return res.success(201, { email: newEmail.email }, "Emailed saveed thanks for joining newsletter");
};
export const removeNewsletter = async (req, res) => {
    const val = newletterReqSchema.safeParse(req.body);
    if (val.success == false) {
        return res.fail(400, "INVALID_BODY", "Something went wrong");
    }
    const dbVal = await newsletterEmails.deleteOne({ email: val.data.email });
    if (dbVal.deletedCount > 0) {
        return res.success(204, { message: "Email removed from DB" });
    }
    return res.fail(404, "NOT_FOUND", "Email not found");
};
//# sourceMappingURL=newsletterEmailCollectorController.js.map