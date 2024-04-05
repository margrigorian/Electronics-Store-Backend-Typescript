import experss, { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { queriesParamsValidate } from "../middlewares/queriesParamsValidate.js";
import { validate } from "../middlewares/validate.js";
import { feildOfApplicationController } from "../controllers/feildOfApplicationController.js";
import { productListController } from "../controllers/productListController.js";
import { searchController } from "../controllers/searchController.js";
import { productController } from "../controllers/productController.js";
import { addProductToBasketOrPostCommentAndRateController } from "../controllers/addProductToBasketOrPostCommentAndRateController.js";
import { putCommentAndRateController } from "../controllers/putCommentAndRateController.js";
import { deleteCommentController } from "../controllers/deleteCommentController.js";

const router: Router = experss.Router();

router.get("/smart-home", feildOfApplicationController);
router.get("/life-style", feildOfApplicationController);
router.get("/product-list/:category", queriesParamsValidate("productListQueryParams"), productListController);
router.get("/search", queriesParamsValidate("searchQueryParams"), searchController);
router.get("/product/:id", queriesParamsValidate("productIdParam"), productController);
router.post(
  "/product/:id",
  authenticate(),
  queriesParamsValidate("rateQueryParam"),
  validate("postComment"),
  addProductToBasketOrPostCommentAndRateController
);
router.put("/product/:id", authenticate(), queriesParamsValidate("rateQueryParam"), validate("putComment"), putCommentAndRateController);
router.delete("/product/:id", authenticate(), queriesParamsValidate("queryParamsOfDeletedComment"), deleteCommentController);

export default router;
