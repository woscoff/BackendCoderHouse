/* import { getManagerCart } from "../dao/daoManager.js";

const data = await getManagerCart()
export const managerCart = new data.ManagerCartMongoDB

export const getProductsCart = async (req, res) => {

    try {
        const productos = await managerCart.getProductsCart()

        if (productos) {
            return res.status(200).json(productos)
        }

        res.status(200).json({
            message: "Productos no encontrados"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const createNewCart = async (req, res) => {
    try {
        req.logger.http(`POST on /api/carts`)
        const newCart = {}
        const data = await createCart(newCart)

        res.send({
            status: "success",
            payload: data
        })
        console.log(data)
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
        req.logger.error(error.message)
        //console.log(error)
    }
}


export const addProductCart = async (req, res) => {
    const { id } = req.params
    const { id_prod, cant } = req.body

    try {
        const product = await managerCart.addProductCart(id, id_prod, cant)
        res.status(204).json(product)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateProductCart = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    try {
        const product = await managerCart.updateElement(id, { title: title, description: description, code: code, price: price, status: status, stock: stock, category: category, thumbnails: thumbnails })

        if (product) {
            return res.status(200).json({
                message: "Producto actualizado"
            })
        }

        res.status(200).json({
            message: "Producto no encontrado"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

export const deleteProductCart = async (req, res) => {
    const { id } = req.params
    try {
        const product = await managerCart.deleteElement(id)

        if (product) {
            return res.status(200).json({
                message: "Producto eliminado"
            })
        }

        res.status(200).json({
            message: "Producto no encontrado"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

} */

import productModel from "../models/MongoDB/productModel.js"
import { findCartById, updateCart, createCart, removeFromCart } from "../services/cartServices.js"
import { findProductById, updateProduct } from "../services/productServices.js"

import { createTicket } from "../services/ticketServices.js"

export const getCart = async (req, res) => {
  if (req.session.login) {
    try {
      const cartID = req.session.user.cart_id

      const cart = await findCartById(cartID)
      if (!cart) {
        throw new Error("Cart not found")
      }
      const popCart = await cart.populate({ path: 'products.productId', model: productModel })

      res.status(200).send({ cart: popCart })

    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message
      })
    }
  } else {
    return res.status(401).send("No active session")
  }
}

export const createNewCart = async (req, res) => {
  try {
    req.logger.http(`POST on /api/carts`)
    const newCart = {}
    const data = await createCart(newCart)

    res.status(201).send({
      status: "success",
      payload: data
    })

  } catch (error) {
    req.logger.error(error.message)
    res.status(500).send({
      status: "error",
      message: error.message
    })
    //console.log(error)
  }
}

export const addProduct = async (req, res) => {
  if (req.session.login) {
    try {
      const cartID = req.session.user.cart_id
      const productID = req.params.pid

      const foundProduct = await findProductById(productID)
      if (foundProduct) {
        const cart = await findCartById(cartID)
        const productIndex = cart.products.findIndex(prod => prod.productId.equals(productID))

        productIndex === -1 ? cart.products.push({ productId: productID }) : cart.products[productIndex].quantity++

        await cart.save()
        return res.status(201).send(`Product added to cart`)
      }

      return res.status(404).send(`Cannot add product (reason: not found)`)
    } catch (error) {
      res.status(500).send({
        error: error.message
      })
    }
  } else {
    return res.status(401).send("No active session")
  }

}

export const overwriteCart = async (req, res) => {
  if (req.session.login) {
    try {
      const cartID = req.session.user.cart_id
      const productsToAdd = req.body

      const response = await updateCart(cartID, productsToAdd)

      res.status(200).send({
        status: 'success',
        payload: response
      })
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message
      })
    }
  } else {
    return res.status(401).send("No active session")
  }

}

export const changeProductQuantity = async (req, res) => {
  if (req.session.login) {
    try {
      const { quantity } = req.body
      const newQuantity = parseInt(quantity)

      const updatedCart = await changeProductQuantity(req.params.cid, req.params.pid, newQuantity)

      res.status(200).send({
        status: "success",
        payload: updatedCart
      })

    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message
      })
    }
  } else {
    return res.status(401).send("No active session")
  }
}

export const removeProduct = async (req, res) => {
  try {
    const cart = await removeFromCart(req.params.cid, req.params.pid)

    res.status(200).send({
      status: "success",
      payload: cart
    })
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message
    })
  }
}

export const clearCart = async (req, res) => {
  try {
    const cart = await cartManager.emptyCart(req.params.cid)
    res.status(200).send(`Cart id:${req.params.cid} is now empty`)
  } catch (error) {
    re.status(500).send({
      status: "error",
      message: error.message
    })
  }
}

export const purchaseCart = async (req, res) => {
  /* ****
  * Esta funcion viene despues de un MW que corrobora si hay una sesion de usuario activa (y un cart_id asociado, no por ruta)
  1 - Comprobar si el stock existente alcanza para el stock pedido en la compra
      a. Si no tiene stock suficiente, se elimina el producto del proceso de compra
      b. Si tiene stock suficiente, restarlo del stock de producto y continuar la compra
  **** */
  if (req.session.login) {
    const cartID = req.session.user.cart_id
    const purchaser = req.session.user.email

    try {
      const cart = await findCartById(cartID)
      const populatedCart = await cart.populate({
        path: "products.productId", model: productModel
      })

      const products = populatedCart.products
      if (products === -1) {
        throw new Error(`Cart empty, unable to continue with the purchase`)
      }

      let totalAmount = 0
      products.forEach(elem => {
        let stockBeforePurchase = parseInt(elem.productId.stock)
        let stockAfterPurchase = stockBeforePurchase - elem.quantity
        let productID = elem.productId._id

        req.logger.debug(`[purchase] product: ${elem.productId.title}`)
        req.logger.debug(`[purchase] stock before: ${stockBeforePurchase}`)
        req.logger.debug(`[purchase] selected quantity: ${elem.quantity}`)
        req.logger.debug(`[purchase] stock after: ${stockAfterPurchase}`)

        if (stockAfterPurchase >= 0) {
          totalAmount += elem.productId.price * elem.quantity
          updateProduct(productID, { stock: stockAfterPurchase })
          /* 
              Products succesfully purchased are removed
              Those with insufficient stock are retained in the cart but not considered in the purchase
          */
          removeFromCart(cartID, productID)
        } else {
          req.logger.info(`[purchase] insufficient stock, returning item "${elem.productId.title}" to the cart`)
        }

      })
      req.logger.debug(`[purchase] total amount: $ ${totalAmount}`)

      if (totalAmount <= 0) {

        return res.status(400).send({
          message: `Purchase cancelled. The products in the cart are unavailable due to stock`,
          cart_content: populatedCart
        })
      }

      const newTicket = await createTicket({
        total_amount: totalAmount,
        purchaser: purchaser
      })

      const savedTicket = await newTicket.save()

      let message
      const finalCart = await findCartById(cartID)
      finalCart.products > 0 ? message = `Purchase completed. Some products were not added due to insufficient stock` : message = `Purchase completed`

      return res.status(201).send({
        message: message,
        invoice: savedTicket
      })
    } catch (error) {
      req.logger.error(error)
      res.status(500).send({
        message: `Error on purchase`,
        error: error
      })
    }
  } else {
    res.status(401).send({
      message: 'No session active',
    })
  }
}