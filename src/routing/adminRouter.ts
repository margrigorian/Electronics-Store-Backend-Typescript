import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { queriesParamsValidate } from "../middlewares/queriesParamsValidate.js";
import upload from "../middlewares/fileProcessing.js";
import { allProductsController } from "../controllers/allProductsController.js";
import { postProductController } from "../controllers/postProductController.js";

const router: Router = express.Router();

router.get("/edit-page", authenticate(true), queriesParamsValidate("searchQueries"), allProductsController);
router.post("/edit-page", authenticate(true), upload.single("image"), validate("postProduct"), postProductController);

export default router;
