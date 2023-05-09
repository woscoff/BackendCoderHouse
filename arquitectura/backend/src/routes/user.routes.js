import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import passport from "passport";
import { registerUser } from "../controllers/session.controller.js";

const routerUser = Router()

//Ruta - Middleware - Controller
routerUser.post("/register", passport.authenticate('register'), registerUser)

export default routerUser