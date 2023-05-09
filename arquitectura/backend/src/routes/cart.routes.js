import { Router } from "express";
import { getProductsCart, addProductCart, updateProductCart, deleteProductCart } from '../controllers/cart.controller.js'

const routerCart = Router()

routerCart.get("/:id", getProductsCart)
routerCart.post("/:id", addProductCart)


routerCart.get("/:id", getProductsCart)
routerCart.post("/:id/products/:id_prod", addProductCart)
routerCart.put("/:id", updateProductCart)
routerCart.put("/:id/product/:id_prod", updateProductCart)
routerCart.delete("/:id", deleteProductCart)
routerCart.delete("/:id/product/:id_prod", deleteProductCart)
//routerCart.post("/", createCarrito)

export default routerCart