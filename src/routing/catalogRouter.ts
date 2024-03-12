import experss, { Router } from "express";
import { feildOfApplicationController } from "../controllers/feildOfApplicationController.js";

const router: Router = experss.Router();

router.get("/smart-home", feildOfApplicationController);
router.get("/life-style", feildOfApplicationController);

export default router;
