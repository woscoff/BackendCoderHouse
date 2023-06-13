import { Router } from "express";
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


export default routerCart