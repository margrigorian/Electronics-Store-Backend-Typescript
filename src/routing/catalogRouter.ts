import experss, { Router } from "express";
import { queriesParamsValidate } from "../middlewares/queriesParamsValidate.js";
import { feildOfApplicationController } from "../controllers/feildOfApplicationController.js";
import { productListController } from "../controllers/productListController.js";

const router: Router = experss.Router();

router.get("/smart-home", feildOfApplicationController);
router.get("/life-style", feildOfApplicationController);
router.get("/product-list/:category", queriesParamsValidate("productListQueries"), productListController);

export default router;
