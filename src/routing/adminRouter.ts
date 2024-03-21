import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { queriesParamsValidate } from "../middlewares/queriesParamsValidate.js";
import { allProductsController } from "../controllers/allProductsController.js";

const router: Router = express.Router();

router.get("/edit-page", authenticate(true), queriesParamsValidate("searchQueries"), allProductsController);

export default router;
