import { findUsers } from "../services/UserService.js"
import { getManagerUsers } from "../dao/daoManager.js";

export const getUsers = async (req, res) => {
    try {
        const users = await findUsers()
        res.status(200).send(users)

    } catch (error) {
        res.status(500).send(error)
    }

}

const data = await getManagerUsers()
export const managerUser = new data.ManagerUserMongoDB

export const createUser = async (req, res) => {
    res.send({ status: "success", message: "User Created" })
}
