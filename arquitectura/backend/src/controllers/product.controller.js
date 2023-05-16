import { getManagerProducts } from "../dao/daoManager.js";
import CustomError from "../utils/errors/customError.js";

const data = await getManagerProducts()
const managerProduct = new data.ManagerProductMongoDB

export const getProducts = async (req, res) => {
    const { limit, page, filter, sort } = req.query;

    const pag = page != undefined ? page : 1
    const limi = limit != undefined ? limit : 10
    const ord = sort == "asc" ? 1 : -1
    try {
        const productos = await managerProduct.getProducts(limi, pag, filter, ord)

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

export const getProduct = async (req, res, next) => {
    const { id } = req.params

    try {
        const product = await managerProduct.getElementById(id);
        if (product) {
            return res.status(200).json(product)
        }

        res.status(200).json({
            message: "Producto no encontrado"
        })
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(400).json({
                error: error.name,
                message: error.message,
            })
        } else {
            res.status(500).send({
                message: `Error creating new products`,
                error: error.message
            })
        }
    }
}

export const createProduct = async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body

    try {
        const product = await managerProduct.addElements([{ title, description, code, price, status, stock, category }])
        res.status(204).json(product)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    try {
        const product = await managerProduct.updateElement(id, { title: title, description: description, code: code, price: price, status: status, stock: stock, category: category, thumbnails: thumbnails })

        if (product) {
            return res.status(200).json({
                message: "Producto actualizado"
            })
        }

        res.status(404).json({
            message: "Producto no encontrado"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await managerProduct.deleteElement(id)

        if (product) {
            return res.status(200).send({
                status: `success`,
                message: `Product ${product.title} [CODE: ${product.code}] deleted`
            })
        }

        res.status(404).json({
            message: "Producto no encontrado"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}