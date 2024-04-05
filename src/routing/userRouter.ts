import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { putBasketProductQuantityController } from "../controllers/putBasketProductQuantityController.js";
import { productsPurchaseController } from "../controllers/productsPurchaseController.js";

const router: Router = express.Router();

router.put("/basket", authenticate(), validate("putBasketProductQuantity"), putBasketProductQuantityController);
router.post("/basket", authenticate(), validate("productsPurchase"), productsPurchaseController);

export default router;
