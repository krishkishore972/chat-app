import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";
const router = Router();


router.get("/", verifyToken,userController);

export default router;
