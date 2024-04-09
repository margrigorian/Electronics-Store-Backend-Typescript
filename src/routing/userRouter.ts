import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { queriesParamsValidate } from "../middlewares/queriesParamsValidate.js";
import { validate } from "../middlewares/validate.js";
import { productsOfBasketAndOrdersController } from "../controllers/productsOfBasketAndOrdersController.js";
import { putBasketProductQuantityController } from "../controllers/putBasketProductQuantityController.js";
import { productsPurchaseController } from "../controllers/productsPurchaseController.js";
import { deleteProductFromBasketController } from "../controllers/deleteBasketProductController.js";

const router: Router = express.Router();

router.get("/basket", authenticate(), productsOfBasketAndOrdersController);
router.put("/basket", authenticate(), validate("putBasketProductQuantity"), putBasketProductQuantityController);
router.post("/basket", authenticate(), validate("productsPurchase"), productsPurchaseController);
router.delete("/basket", authenticate(), queriesParamsValidate("productIdParam"), deleteProductFromBasketController);

export default router;
