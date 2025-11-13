import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router()

router.post("/register", auth.registerUser)
router.post("/login" , auth.loginUser)
router.post("/logout" , auth.logoutUser)
router.post("/refresh" , auth.refreshToken)
router.get("/me" , requireAuth ,auth.getMe)

router.get("/connection", auth.testConection)

export default router