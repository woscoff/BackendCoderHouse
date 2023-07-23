/* import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'
import { checkSessionRole } from "../config/middlewares.js";

const routerProducto = Router()

routerProducto.get("/", getProducts)
routerProducto.get("/:id", getProduct)
routerProducto.post("/", checkSessionRole("Admin"), createProduct)
routerProducto.put("/:id", checkSessionRole("Admin"), updateProduct)
routerProducto.delete("/:id", checkSessionRole("Admin"), deleteProduct)


export default routerProducto */

// import { Router } from "express";
// import { getProducts, getProduct, addProducts, modifyProduct, removeProduct} from "../controllers/product.controller.js";
// import { Roles, checkRole, isSessionActive } from "../middlewares/session.js";

// const routerProduct = Router()

// routerProduct.route('/')
//     .get(getProducts)
//     .post(addProducts)


// routerProduct.route('/:pid')
//     .get(getProduct)
//     .put(checkRole(Roles.ADMIN), modifyProduct)
//     .delete(checkRole(Roles.ADMIN), removeProduct)

// export default routerProduct

import { Router } from "express";
import { getProducts, getProduct, addProducts, modifyProduct, removeProduct } from "../controllers/product.controller.js";
import { Roles, checkRole, isSessionActive } from "../middlewares/session.js";

const routerProduct = Router()

routerProduct.route('/')
    .get(getProducts)
    .post(addProducts)

routerProduct.route('/:pid')
    .get(getProduct)
    .put(checkRole(Roles.ADMIN), modifyProduct)
    .delete(checkRole(Roles.ADMIN), removeProduct)

export default routerProduct