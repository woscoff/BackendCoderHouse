/* import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import passport from "passport";
import { isSessionActive } from "../config/middlewares.js";
import { registerUser } from "../controllers/session.controller.js";

const routerUser = Router()

//Ruta - Middleware - Controller
routerUser.post("/register", passport.authenticate('register'), registerUser)
routerUser.get('/chat', isSessionActive);

export default routerUser */

// import { Router } from "express";
// import { getUsers } from "../controllers/user.controller.js";

// const routerUser = Router()

// routerUser.get('/', getUsers)

// export default routerUser

import { Router } from "express";
import { eraseInactiveUsers, getUsers, uploadDocs } from "../controllers/user.controller.js";
import { Roles, checkRole, isSessionActive } from "../middlewares/session.js";
import { uploader } from "../utils/multer.js";

const routerUser = Router()

routerUser.get('/', isSessionActive, checkRole(Roles.ADMIN), getUsers)
routerUser.delete('/', isSessionActive, checkRole(Roles.ADMIN), eraseInactiveUsers)
routerUser.post('/:uid/documents', isSessionActive, uploader.single('file'), uploadDocs)

export default routerUser