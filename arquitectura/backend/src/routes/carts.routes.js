/* import { Router } from "express";
import { getProductsCart, addProductCart, updateProductCart, createNewCart, deleteProductCart } from '../controllers/cart.controller.js'
import { checkSessionRole, checkRole } from "../config/middlewares.js";

const routerCart = Router()

routerCart.use(checkRole("user"))
routerCart.get("/:id", getProductsCart)
routerCart.put("/:id", updateProductCart)
routerCart.delete("/:id", deleteProductCart)
routerCart.post("/", createNewCart)
routerCart.put("/:id/product/:id_prod", updateProductCart)
routerCart.post("/:id/products/:id_prod", addProductCart)
routerCart.delete("/:id/product/:id_prod", deleteProductCart)


export default routerCart */

import { Router } from "express";
import { purchaseCart, getCart, addProduct, changeProductQuantity, clearCart, removeProduct, overwriteCart, createNewCart } from "../controllers/cart.controller.js";
import { Roles, checkRole } from "../middlewares/session.js";

const routerCart = Router()

// Middleware to use in every cart related request
routerCart.use(checkRole(Roles.USER))

routerCart.route('/')
    .post(createNewCart)
    .get(getCart)
    .put(overwriteCart)

routerCart.route('/:cid')
    .delete(clearCart)

routerCart.route('/product/:pid')
    .post(addProduct)

routerCart.route('/:cid/product/:pid')
    .put(changeProductQuantity)
    .delete(removeProduct)

routerCart.route('/purchase')
    .post(purchaseCart)

export default routerCart