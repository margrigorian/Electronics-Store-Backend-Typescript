import z from "zod";
import getResponseTemplate from "../lib/responseTemplate.js";
export function validate(action) {
    return (req, res, next) => {
        try {
            const orderSchema = z.object({
                productId: z.number().positive(),
                quantity: z.number().positive()
            });
            const schemas = {
                registration: z.object({
                    username: z.string().min(1),
                    email: z.string().email(),
                    password: z.string().min(5)
                }),
                authorization: z.object({
                    email: z.string().email(),
                    password: z.string().min(5)
                }),
                postProduct: z.object({
                    title: z.string().min(1),
                    description: z.string().min(1),
                    feildOfApplication: z.string().min(1),
                    category: z.string().min(1),
                    subcategory: z.string().min(1),
                    quantity: z.preprocess(a => parseInt(String(a), 10), z.number().nonnegative()),
                    price: z.preprocess(a => parseInt(String(a), 10), z.number().positive())
                }),
                putProduct: z.object({
                    id: z.preprocess(a => parseInt(String(a), 10), z.number().positive()),
                    title: z.union([z.string().min(1), z.literal(""), z.undefined()]),
                    description: z.union([z.string().min(1), z.literal(""), z.undefined()]),
                    feildOfApplication: z.union([z.string().min(1), z.literal(""), z.undefined()]),
                    category: z.union([z.string().min(1), z.literal(""), z.undefined()]),
                    subcategory: z.union([z.string().min(1), z.literal(""), z.undefined()]),
                    quantity: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().nonnegative(), z.literal("")])).optional(),
                    price: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional()
                }),
                productsPurchase: z.object({
                    order: z.array(orderSchema)
                }),
                postComment: z.object({
                    comment: z.string().min(2).optional()
                }),
                putComment: z.object({
                    productId: z.preprocess(a => parseInt(String(a), 10), z.number().positive()),
                    commentId: z.number().positive().optional(),
                    comment: z.string().min(2).optional()
                }),
                putBasketProductQuantity: z.object({
                    productId: z.number().positive(),
                    quantity: z.number().positive()
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
        }
        catch (err) {
            const message = "500 Server Error";
            const response = getResponseTemplate();
            response.error = {
                message
            };
            return res.status(500).json(response);
        }
    };
}
//# sourceMappingURL=validate.js.map