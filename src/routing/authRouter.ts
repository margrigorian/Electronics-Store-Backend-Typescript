import express, { Router } from "express";
import { validate } from "../middlewares/validate.js";

const router: Router = express.Router();

router.post("/register", validate("registration"));

export default router;
