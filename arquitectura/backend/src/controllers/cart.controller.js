import { getManagerCart } from "../dao/daoManager.js";

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

/*
export const getProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await managerCart.getElementById(id);
        if (product) {
            return res.status(200).json(product)
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
*/
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

}