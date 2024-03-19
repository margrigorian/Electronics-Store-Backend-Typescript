import experss, { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { queriesParamsValidate } from "../middlewares/queriesParamsValidate.js";
import { validate } from "../middlewares/validate.js";
import { feildOfApplicationController } from "../controllers/feildOfApplicationController.js";
import { productListController } from "../controllers/productListController.js";
import { searchController } from "../controllers/searchController.js";
import { productController } from "../controllers/productController.js";
import { postCommentAndRateController } from "../controllers/postCommentAndRateController.js";
import { putCommentAndRateController } from "../controllers/putCommentAndRateController.js";

const router: Router = experss.Router();

router.get("/smart-home", feildOfApplicationController);
router.get("/life-style", feildOfApplicationController);
router.get("/product-list/:category", queriesParamsValidate("productListQueries"), productListController);
router.get("/search", queriesParamsValidate("searchQueries"), searchController);
router.get("/product/:id", queriesParamsValidate("productIdParam"), productController);
router.post("/product/:id", authenticate(), queriesParamsValidate("rateQuery"), validate("postComment"), postCommentAndRateController);
router.put("/product/:id", authenticate(), queriesParamsValidate("rateQuery"), validate("putComment"), putCommentAndRateController);

export default router;
