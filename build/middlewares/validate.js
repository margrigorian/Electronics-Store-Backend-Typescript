import z from "zod";
import getResponseTemplate from "../lib/responseTemplate.js";
export function validate(action) {
    return (req, res, next) => {
        const schemas = {
            registration: z.object({
                username: z.string().min(1),
                email: z.string().email(),
                password: z.string().min(5)
            })
        };
        const validatedData = schemas[action].safeParse(req.body);
        if (validatedData.success) {
            next();
            return;
        }
        const message = "The sent data is incorrect";
        const response = getResponseTemplate();
        response.error = {
            message
        };
        return res.status(406).json(response);
    };
}
//# sourceMappingURL=validate.js.map