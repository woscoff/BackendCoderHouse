import { ManagerMongoDB } from "../db/mongoDBManager.js";
import { Schema } from "mongoose";

const messageSchema = new Schema({
    nombre: String,
    email: {
        type: String,
        unique: true
    },
    message: String
})

export class ManagerMessageMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.MONGODBURL, "messages", messageSchema)
    }
}