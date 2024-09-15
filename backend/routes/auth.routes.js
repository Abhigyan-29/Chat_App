import express from "express";
const router = express.Router();
import {signup } from"../controllers/auth.controllers.js";
import {login} from '../controllers/auth.controllers.js';
import {logout} from '../controllers/auth.controllers.js';


router.post("/signup", signup);
router.post("/login",login );
router.post("/logout",logout);


































export default router;