import express from "express";
import { getMessages } from "../controllers/msgs.controller";
import { Request, Response } from "express";

const router = express.Router();

router.get("/",getMessages);

export default router;