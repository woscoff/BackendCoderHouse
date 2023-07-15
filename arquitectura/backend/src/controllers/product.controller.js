/* import { getManagerProducts } from "../dao/daoManager.js";
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

} */

import { findProductById, insertProducts, updateProduct, deleteProduct, paginateProducts } from "../services/productServices.js";

// Error handling imports
import CustomError from "../utils/errors/customError.js";

export const getProducts = async (req, res) => {
    let { limit = 10, page = 1, category = undefined, stock = undefined, sort = undefined } = req.query;

    try {
        // Checking wrong params
        if (isNaN(page)) throw new Error("Parameter 'page' must be type: number")

        // Pagination filter and options
        let filter = {} // Contains category and stock filters
        if (category) filter.category = category
        if (stock) filter.stock = { $gt: stock - 1 }

        const options = {
            page,
            limit,
            sort: sort && Object.keys(sort).length ? sort : undefined
        };

        // Sorting definition, if no parameter is received, do not sort
        if (sort != undefined) {
            if (sort != "ASC" && sort != "DESC") {
                throw new Error("Invalid sorting parameter")
            } else {
                sort == "ASC" ? options.sort = "price" : options.sort = "-price"
            }
        }

        const products = await paginateProducts(filter, options)

        if ((page > products.totalPages) || (page <= 0)) throw new Error("Parameter 'page' is out of range")

        // Creating links to prev and next pages
        const categoryLink = category ? `&category=${category}` : ""
        const stockLink = stock ? `&stock=${stock}` : ""
        const limitLink = limit ? `&limit=${limit}` : ""
        const sortLink = sort ? `&sort=${sort}` : ""
        const prevPageLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}${limitLink}${categoryLink}${stockLink}${sortLink}` : null
        const nextPageLink = products.hasNextPage ? `/api/products?page=${products.nextPage}${limitLink}${categoryLink}${stockLink}${sortLink}` : null

        res.status(200).send({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevPageLink,
            nextLink: nextPageLink
        })

    } catch (error) {
        req.logger.error(`Error on getProducts controller - ${error.message}`)
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await findProductById(req.params.pid)
        return res.status(200).send(product)
    } catch (error) {
        res.status(500).send({
            message: `Error during product search`,
            error: error.message
        })
    }
}

export const addProducts = async (req, res, next) => {
    const productsData = req.body

    try {
        const products = await insertProducts(productsData)
        res.status(201).send({
            message: `Product(s) added succesfully`,
            payload: products
        })
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(400).json({
                error: error.name,
                message: error.message,
            })
        } else {
            res.status(500).send({
                status: `Error creating new products`,
                message: error.message
            })
        }
    }
}

export const modifyProduct = async (req, res) => {
    const productID = req.params.pid
    const productData = req.body

    try {
        const product = await updateProduct(productID, productData)
        if (product) {
            return res.status(200).send(`Product up-to-date`)
        }
        return res.status(404).send(`Product not found`)

    } catch (error) {
        res.status(500).send({
            status: `Error on updating product`,
            message: error.message
        })
    }
}

export const removeProduct = async (req, res) => {
    const productID = req.params.pid
    try {
        const product = await deleteProduct(productID)
        if (product) {
            return res.status(200).send({
                status: `success`,
                message: `Product ${product.title} [CODE: ${product.code}] deleted`
            })
        }
        return res.status(404).send(`Product not found`)
    } catch (error) {
        res.status(500).send({
            message: `Error on deleting product`,
            error: error.message
        })
    }
}

