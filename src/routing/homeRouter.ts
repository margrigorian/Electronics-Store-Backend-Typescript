import express, { Router } from "express";
import { homePageProductsController } from "../controllers/homePageProductsController.js";

const router: Router = express.Router();

router.get("/", homePageProductsController);

export default router;
