import { Router } from "express";
import { createCarrito, getProductsCart, addProductCart } from '../controllers/cart.controller.js'

const routerCart = Router()

routerCart.get("/:id", getProductsCart)
routerCart.post("/:id/products/:id_prod", addProductCart)
routerCart.put("/:id", createCarrito)
routerCart.put("/product/:id", createCarrito)
routerCart.delete("/:id", createCarrito)
routerCart.delete("/product/:id", createCarrito)
routerCart.post("/", createCarrito)

export default routerCart