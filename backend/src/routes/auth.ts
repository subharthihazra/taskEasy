import { Express, Router } from "express";
import {
  signup,
  signin,
  isAuth,
  logout,
  verifyUserMiddleware,
  isUserMiddleware,
  getNewToken,
} from "../controllers/auth";

const router = Router();

router.post("/signup", isUserMiddleware, signup);
router.post("/login", isUserMiddleware, signin);
router.post("/isauth", verifyUserMiddleware, isAuth);
router.post("/logout", verifyUserMiddleware, logout);
router.get("/getnewtoken", getNewToken);

export default router;
