/* import { Router } from "express";
import { destroySession } from "../controllers/session.controller.js";
import passport from "passport";
import { passportError, roleVerification } from "../utils/errorMessages.js";
import { loginUser } from "../controllers/session.controller.js";
import { checkSessionRole, isSessionActive } from "../config/middlewares.js";
const routerSession = Router()


routerSession.post("/login", loginUser)
routerSession.get("/logout", destroySession)
routerSession.get("testJWT", passport.authenticate('jwt', { session: false }, (req, res) => {
    res.send({ "message": "tokenJWT" })
}))
routerSession.get("/current", passportError('jwt'), roleVerification('User'), (req, res) => {
    res.send(req.user)
})

export default routerSession */

import { Router } from "express";
import { loginUser, destroySession, getSession, registerUser, sendResetPasswordLink, resetPassword } from "../controllers/session.controller.js";

const routerSession = Router()

routerSession.post('/login', loginUser)
routerSession.get('/logout', destroySession)
routerSession.get('/current', getSession)
routerSession.post('/register', registerUser)
routerSession.post('/password/createlink', sendResetPasswordLink)
routerSession.put('/password/reset', resetPassword)

export default routerSession