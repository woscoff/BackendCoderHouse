import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import passport from "passport";
import { isSessionActive } from "../config/middlewares.js";
import { registerUser } from "../controllers/session.controller.js";

const routerUser = Router()

//Ruta - Middleware - Controller
routerUser.post("/register", passport.authenticate('register'), registerUser)
routerUser.get('/chat', isSessionActive);

export default routerUser