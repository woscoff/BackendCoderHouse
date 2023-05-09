import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'
import { checkSessionRole } from "../config/middlewares.js";

const routerProducto = Router()

routerProducto.get("/", getProducts)
routerProducto.get("/:id", getProduct)
routerProducto.post("/", checkSessionRole("Admin"), createProduct)
routerProducto.put("/:id", checkSessionRole("Admin"), updateProduct)
routerProducto.delete("/:id", checkSessionRole("Admin"), deleteProduct)


export default routerProducto