import express, { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { userRegistrationController } from "../controllers/authControllers.js";
// import user

const router: Router = express.Router();

router.post("/register", validate("registration"), userRegistrationController);

export default router;
