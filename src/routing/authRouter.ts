import express, { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { userRegistrationController, userLoginController } from "../controllers/authControllers.js";
// import user

const router: Router = express.Router();

router.post("/register", validate("registration"), userRegistrationController);
router.post("/login", validate("authorization"), userLoginController);

export default router;
