import express from "express";
import { validate } from "../middlewares/validate.js";
const router = express.Router();
router.post("/register", validate("registration"));
export default router;
//# sourceMappingURL=authRouter.js.map