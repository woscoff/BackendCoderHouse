/* import { Router } from "express";

import routerCart from "./cart.routes.js";
import routerProducto from "./products.routes.js";
import routerSession from "./session.routes.js";
import routerUser from "./user.routes.js";
import routerGithub from "./github.routes.js";
import routerPoliticas from "./politicas.routes.js";
import routerChat from "./chat.routes.js";
import { getRandomProducts } from "../utils/mocking/mocking.controller.js";
import { logRequest } from "../middlewares/logger.js";

const router = Router()

router.use(logRequest)

router.use('/product', routerProducto)
router.use('/user', routerUser)
router.use('/api/cart', routerCart)
router.use('/api/session', routerSession)
router.use('/authSession', routerGithub)
router.use('/politicas', routerPoliticas)
router.use('/api/chat', routerChat)
router.use('*', (req, res) => {
    res.status(404).send({ error: "404 No se encuentra la pagina solicitada" })
})
router.get('/mockingproducts', getRandomProducts)

export default router */

import { Router } from "express"
//import { __dirname } from "../path.js"
import routerCart from "./carts.routes.js"
import routerProduct from "./products.routes.js"
import routerSession from "./sessions.routes.js"
import routerUser from "./users.routes.js"
import routerViews from "./views.routes.js"
import routerGithub from "./github.routes.js"
//import { routerChat } from "./chat.routes.js"
import { getRandomProducts } from "../utils/mocking/mocking.controller.js"
import { logRequest } from "../middlewares/logger.js"

const router = Router()

// Request logger middleware
router.use(logRequest)

router.use('/api/carts', routerCart)
router.use('/api/products', routerProduct)
router.use('/api/session', routerSession)
router.use('/api/users', routerUser)
//router.use('/api/chat', routerChat)
router.use('/authSession', routerGithub)
router.use('/', routerViews)

// Temporal endpoint to create 100 random products
router.get('/mockingproducts', getRandomProducts)
// Temporal endpoint to test logging
router.get('/loggerTest', (req, res) => {
    try {
        req.logger.debug(`Debug message test`)
        req.logger.http(`HTTP message test`)
        req.logger.info(`Info message test`)
        req.logger.warning(`Warning message test`)
        req.logger.error(`Error message test`)
        req.logger.fatal(`Fatal error message test`)

        res.status(200).send({
            message: 'Logs registered and/or created'
        })
    } catch (error) {
        req.logger.error(`Error on logger testing, really? - ${error.message}`)
        res.status(500).send({
            status: 'error',
            error: error.message
        })
    }
})

export default router