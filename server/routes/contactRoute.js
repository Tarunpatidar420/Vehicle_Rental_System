// server/routes/contactRoute.js
import express from "express";
import { sendContactMail } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact
router.post("/", sendContactMail);

export default router;
