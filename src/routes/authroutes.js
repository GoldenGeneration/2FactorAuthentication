import { Router } from "express";
import passport from "passport";
import { register, login, authStatus, logout, setup2FA, verify2FA, reset2FA } from "../controllers/authController.js";

const router = Router();

//registration
router.post("/register", register);
//login
router.post("/login", passport.authenticate("local"), login);
//auth status route
router.get("/status", authStatus);
//logout
router.post("/logout", logout);
    
//mfa routes

//2FA setup
router.post("/2fa/setup", setup2FA);

//verify route
router.post("/2fa/verify", verify2FA);

//reset route
router.post("/2fa/reset", reset2FA);

export default router;