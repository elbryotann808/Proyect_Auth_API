import { Router } from "express";
import * as view from "../controllers/view.controller.js";
import { requireAuthCokkieRedirect  } from "../middleware/requireAuth.js";

const router = Router()

router.get("/login", view.pageLogin )
router.get("/register", view.pageRegister)
router.get("/", requireAuthCokkieRedirect ,view.pageHome)

export default router